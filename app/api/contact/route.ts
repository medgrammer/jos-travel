import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const MAX_LENGTH = {
  name: 120,
  email: 180,
  phone: 40,
  destination: 160,
  service: 120,
  message: 1600,
  country: 80,
  countryCode: 8,
  dialCode: 12,
  locale: 8
};

export async function POST(request: NextRequest) {
  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase n'est pas configuré." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Formulaire invalide." }, { status: 400 });
  }

  const fullName = clean(body.fullName ?? body.name, MAX_LENGTH.name);
  const email = clean(body.email, MAX_LENGTH.email);
  const countryName = clean(body.countryName, MAX_LENGTH.country);
  const countryCode = clean(body.countryCode, MAX_LENGTH.countryCode).toUpperCase();
  const dialCode = normalizeDialCode(clean(body.dialCode, MAX_LENGTH.dialCode));
  const phone = clean(body.phone, MAX_LENGTH.phone);
  const fullPhone = clean(body.fullPhone, MAX_LENGTH.phone) || buildFullPhone(dialCode, phone);
  const destination = clean(body.destination, MAX_LENGTH.destination);
  const service = clean(body.service, MAX_LENGTH.service);
  const message = clean(body.message, MAX_LENGTH.message);
  const locale = clean(body.locale, MAX_LENGTH.locale) || "fr";

  if (!fullName || !countryName || !countryCode || !dialCode || !phone || !fullPhone || !service || !message) {
    return NextResponse.json(
      { error: "Merci de renseigner votre nom, pays, téléphone, service et message." },
      { status: 400 }
    );
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("contact_messages")
    .insert({
      full_name: fullName,
      email: email || null,
      country_name: countryName,
      country_code: countryCode,
      dial_code: dialCode,
      phone,
      full_phone: fullPhone,
      destination: destination || null,
      service,
      message,
      locale,
      metadata: {
        userAgent: request.headers.get("user-agent"),
        referrer: request.headers.get("referer")
      }
    })
    .select("id,created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: "Impossible d'enregistrer votre demande pour le moment." }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    requestId: data.id,
    createdAt: data.created_at,
    message: "Votre demande a bien été envoyée. L'équipe JOS-Travel vous répondra rapidement."
  });
}

function clean(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function normalizeDialCode(value: string) {
  const digits = value.replace(/[^\d]/g, "");
  return digits ? `+${digits}` : "";
}

function buildFullPhone(dialCode: string, phone: string) {
  const digits = phone.replace(/[^\d]/g, "");
  return dialCode && digits ? `${dialCode}${digits.replace(/^0+/, "")}` : "";
}
