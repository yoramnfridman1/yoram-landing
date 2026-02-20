import { NextRequest, NextResponse } from "next/server";

/**
 * Lead capture endpoint.
 * Stores leads in a simple JSON format and optionally sends WhatsApp notification.
 *
 * Environment variables:
 * - WHATSAPP_TOKEN (optional): WhatsApp Cloud API token
 * - WHATSAPP_PHONE_NUMBER_ID (optional): WhatsApp business phone number ID
 * - NOTIFICATION_PHONE (optional): Phone number to notify (with country code, no +)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      );
    }

    const lead = {
      name,
      phone,
      email: email || "",
      timestamp: new Date().toISOString(),
      source: "landing_page",
    };

    // Log the lead (visible in Vercel logs)
    console.log("NEW LEAD:", JSON.stringify(lead));

    // Send WhatsApp notification if configured
    const whatsappToken = process.env.WHATSAPP_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const notificationPhone = process.env.NOTIFICATION_PHONE;

    if (whatsappToken && phoneNumberId && notificationPhone) {
      try {
        await fetch(
          `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${whatsappToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              to: notificationPhone,
              type: "text",
              text: {
                body: `ליד חדש מדף הנחיתה:\nשם: ${name}\nטלפון: ${phone}\nאימייל: ${email || "לא צוין"}`,
              },
            }),
          }
        );
      } catch (err) {
        // Don't fail the lead submission if notification fails
        console.error("WhatsApp notification failed:", err);
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
