import { NextRequest, NextResponse } from "next/server";

/**
 * Lead capture endpoint.
 * Sends WhatsApp notification to Yoram via SuperSeller WAHA Pro.
 *
 * Environment variables:
 * - WAHA_API_URL:  WAHA Pro base URL (e.g. http://172.245.56.50:3000)
 * - WAHA_API_KEY:  WAHA Pro API key
 * - WAHA_SESSION:  WAHA session name (default: "default")
 * - NOTIFY_CHAT_ID: Recipient chatId (e.g. 972522422274@c.us)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email } = body;

    if (\!name || \!phone) {
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

    console.log("NEW LEAD:", JSON.stringify(lead));

    const wahaUrl = process.env.WAHA_API_URL;
    const wahaKey = process.env.WAHA_API_KEY;
    const wahaSession = process.env.WAHA_SESSION || "default";
    const notifyChatId = process.env.NOTIFY_CHAT_ID;

    if (wahaUrl && wahaKey && notifyChatId) {
      try {
        const message = [
          "ליד חדש מדף הנחיתה\!",
          "",
          `שם: ${name}`,
          `טלפון: ${phone}`,
          `אימייל: ${email || "לא צוין"}`,
          "",
          `זמן: ${new Date().toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" })}`,
        ].join("
");

        await fetch(`${wahaUrl}/api/sendText`, {
          method: "POST",
          headers: { "X-Api-Key": wahaKey, "Content-Type": "application/json" },
          body: JSON.stringify({ session: wahaSession, chatId: notifyChatId, text: message }),
        });
      } catch (err) {
        console.error("WAHA notification failed:", err);
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
