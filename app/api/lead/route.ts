import { NextRequest, NextResponse } from "next/server";

/**
 * Receives first-party lead form submissions from yoramfriedman.co.il and
 * forwards them to SuperSeller's canonical Yoram lead engine.
 *
 * Canonical chain: this public form → superseller.agency/api/leads/yoram-insurance
 * → yoram_leads → worker enrichment → Yoram's /app/leads dashboard.
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

    const selectedTypes = Array.isArray(insuranceTypes) ? insuranceTypes.filter(Boolean) : [];
    const insuranceType = selectedTypes[0] || "בדיקת תיק מלאה";
    const leadEngineUrl = process.env.SUPERSELLER_YORAM_LEAD_URL || "https://superseller.agency/api/leads/yoram-insurance";
    const leadEngineSecret = process.env.SUPERSELLER_YORAM_LEAD_SECRET;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (leadEngineSecret) headers.Authorization = `Bearer ${leadEngineSecret}`;

    const leadRes = await fetch(leadEngineUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: String(name).trim(),
        phone: phoneClean,
        email: email || "",
        insurance_type: insuranceType,
        family_members: [],
        message: message || "",
        source: "yoramfriedman.co.il",
        selected_insurance_types: selectedTypes,
      }),
    });

    const leadJson = await leadRes.json().catch(() => ({}));
    if (!leadRes.ok) {
      console.error("[YORAM LEAD ENGINE ERROR]", leadRes.status, leadJson);
      return NextResponse.json({ error: "lead engine unavailable" }, { status: 502 });
    }

    return NextResponse.json(
      { ok: true, leadId: leadJson.leadId ?? null, status: leadJson.status ?? "pending_processing", deduped: leadJson.deduped === true },
      { status: leadJson.deduped ? 200 : 201 },
    );
  } catch (err) {
    console.error("[LEAD ERROR]", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
