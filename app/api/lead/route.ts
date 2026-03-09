import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, insuranceTypes, message } = body;

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
      email: email || "",
      insuranceTypes: insuranceTypes || [],
      message: message || "",
      source: "landing_page",
      createdAt: new Date().toISOString(),
      ip:
        req.headers.get("x-forwarded-for") ||
        req.headers.get("x-real-ip") ||
        "unknown",
      ua: req.headers.get("user-agent") || "unknown",
    };

    console.log("[LEAD]", JSON.stringify(lead));

    // Send WhatsApp notification via WAHA
    const wahaUrl = process.env.WAHA_URL || "http://172.245.56.50:3000";
    const wahaKey = process.env.WAHA_API_KEY;
    const notifyChat = process.env.LEAD_NOTIFY_CHAT || "972522422274@c.us";
    const wahaSession = process.env.WAHA_SESSION || "superseller-whatsapp";

    if (wahaKey) {
      const insuranceStr = Array.isArray(lead.insuranceTypes) && lead.insuranceTypes.length > 0
        ? lead.insuranceTypes.join(", ")
        : "לא צוין";

      const msg = [
        "\ud83d\udd14 ליד חדש - יורם פרידמן",
        "",
        `שם: ${lead.name}`,
        `טלפון: ${lead.phone}`,
        `אימייל: ${lead.email || "לא צוין"}`,
        `תחומי עניין: ${insuranceStr}`,
        lead.message ? `הערות: ${lead.message}` : "",
        "",
        `מקור: ${lead.source}`,
        `תאריך: ${new Date().toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" })}`,
      ].filter(Boolean).join("\n");

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
