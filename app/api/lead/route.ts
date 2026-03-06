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
      ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown",
      ua: req.headers.get("user-agent") || "unknown",
    };

    console.log("[LEAD]", JSON.stringify(lead));

    // Send to n8n webhook for WhatsApp notification
    const webhookUrl = process.env.LEAD_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(lead),
        });
      } catch (webhookErr) {
        console.error("[LEAD WEBHOOK ERROR]", webhookErr);
      }
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[LEAD ERROR]", err);
    return NextResponse.json(
      { error: "server error" },
      { status: 500 }
    );
  }
}
