import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, source } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "name and phone are required" },
        { status: 400 }
      );
    }

    const phoneClean = phone.replace(/[\s\-()]/g, "");
    const isValid =
      /^0[2-9]\d{7,8}$/.test(phoneClean) ||
      /^05\d{8}$/.test(phoneClean) ||
      /^\+972\d{8,9}$/.test(phoneClean);

    if (!isValid) {
      return NextResponse.json(
        { error: "invalid phone number" },
        { status: 400 }
      );
    }

    const lead = {
      name: name.trim(),
      phone: phoneClean,
      source: source || "landing_page",
      createdAt: new Date().toISOString(),
      ip:
        req.headers.get("x-forwarded-for") ||
        req.headers.get("x-real-ip") ||
        "unknown",
      ua: req.headers.get("user-agent") || "unknown",
    };

    console.log("[LEAD]", JSON.stringify(lead));

    // Send WhatsApp notification via WAHA (direct call, bypasses n8n)
    const wahaUrl = process.env.WAHA_URL || "http://172.245.56.50:3000";
    const wahaKey = process.env.WAHA_API_KEY;
    const notifyChat = process.env.LEAD_NOTIFY_CHAT || "972544969668@c.us";
    const wahaSession = process.env.WAHA_SESSION || "superseller-whatsapp";

    if (wahaKey) {
      const msg = [
        "\ud83d\udd14 \u05dc\u05d9\u05d3 \u05d7\u05d3\u05e9 - \u05d9\u05d5\u05e8\u05dd \u05e4\u05e8\u05d9\u05d3\u05de\u05df",
        "",
        `\u05e9\u05dd: ${lead.name}`,
        `\u05d8\u05dc\u05e4\u05d5\u05df: ${lead.phone}`,
        `\u05de\u05e7\u05d5\u05e8: ${lead.source}`,
        `\u05ea\u05d0\u05e8\u05d9\u05da: ${lead.createdAt}`,
      ].join("\n");

      try {
        await fetch(`${wahaUrl}/api/sendText`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": wahaKey,
          },
          body: JSON.stringify({
            chatId: notifyChat,
            text: msg,
            session: wahaSession,
          }),
        });
      } catch (wahaErr) {
        console.error("[LEAD WAHA ERROR]", wahaErr);
      }
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[LEAD ERROR]", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
