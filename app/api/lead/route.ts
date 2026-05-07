import { NextRequest, NextResponse } from "next/server";

/**
 * Forwards lead form submissions to the SuperSeller worker, which handles
 * DB persistence, agent-template formatting, and WA notification to Yoram's
 * review group (so the AI agent can see and act via mark_lead_status).
 *
 * The page form posts here client-side; this server-side handler holds the
 * shared secret in a Vercel env var and re-validates phone before forwarding.
 * If the worker is unreachable, we fall back to a direct WAHA notify so leads
 * are never silently dropped.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, insuranceTypes, message } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "name and phone are required" }, { status: 400 });
    }
    const phoneClean = String(phone).replace(/[\s\-()]/g, "");
    const isValid =
      /^0[2-9]\d{7,8}$/.test(phoneClean) ||
      /^05\d{8}$/.test(phoneClean) ||
      /^\+972\d{8,9}$/.test(phoneClean);
    if (!isValid) {
      return NextResponse.json({ error: "invalid phone number" }, { status: 400 });
    }

    const workerUrl = process.env.WORKER_LEAD_URL;
    const workerSecret = process.env.WORKER_API_SECRET;

    if (workerUrl && workerSecret) {
      try {
        const fwd = await fetch(workerUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Worker-Secret": workerSecret,
          },
          body: JSON.stringify({
            name: String(name).trim(),
            phone: phoneClean,
            email: email || "",
            insuranceTypes: Array.isArray(insuranceTypes) ? insuranceTypes : [],
            message: message || "",
            source: "yoramfriedman.co.il",
          }),
        });
        if (fwd.ok) {
          const j = await fwd.json();
          return NextResponse.json({ ok: true, leadId: j.leadIdPrefix }, { status: 201 });
        }
        console.error("[LEAD WORKER ERROR]", fwd.status, await fwd.text().catch(() => ""));
      } catch (err) {
        console.error("[LEAD WORKER FETCH ERROR]", err);
      }
    }

    // Fallback: direct WAHA notify so the lead is never silently lost.
    const wahaUrl = process.env.WAHA_URL || "http://172.245.56.50:3000";
    const wahaKey = process.env.WAHA_API_KEY;
    const notifyChat = process.env.LEAD_NOTIFY_CHAT || "972522422274@c.us";
    const wahaSession = process.env.WAHA_SESSION || "superseller-whatsapp";
    if (wahaKey) {
      const insuranceStr = Array.isArray(insuranceTypes) && insuranceTypes.length > 0 ? insuranceTypes.join(", ") : "לא צוין";
      const fallbackMsg = [
        "🔔 ליד חדש (fallback - worker unreachable)",
        "",
        `שם: ${String(name).trim()}`,
        `טלפון: ${phoneClean}`,
        `אימייל: ${email || "לא צוין"}`,
        `תחומי עניין: ${insuranceStr}`,
        message ? `הערות: ${message}` : "",
      ].filter(Boolean).join("\n");
      try {
        await fetch(`${wahaUrl}/api/sendText`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Api-Key": wahaKey },
          body: JSON.stringify({ chatId: notifyChat, text: fallbackMsg, session: wahaSession }),
        });
      } catch (e) {
        console.error("[LEAD FALLBACK WAHA ERROR]", e);
      }
    }

    return NextResponse.json({ ok: true, fallback: true }, { status: 201 });
  } catch (err) {
    console.error("[LEAD ERROR]", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
