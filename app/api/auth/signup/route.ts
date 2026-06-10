import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type SignupPayload = {
  fullName?: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  company?: string;
  tripInterest?: string;
  password?: string;
};

export async function POST(request: Request) {
  const admin = createAdminClient();

  if (!admin) {
    return NextResponse.json(
      { error: "La création de compte n'est pas encore configurée côté serveur." },
      { status: 503 }
    );
  }

  const payload = (await request.json().catch(() => null)) as SignupPayload | null;
  if (!payload) {
    return NextResponse.json({ error: "Données d'inscription invalides." }, { status: 400 });
  }

  const fullName = clean(payload.fullName);
  const email = clean(payload.email).toLowerCase();
  const phone = clean(payload.phone);
  const city = clean(payload.city);
  const country = clean(payload.country) || "Cameroun";
  const company = clean(payload.company);
  const tripInterest = clean(payload.tripInterest) || "Vacances";
  const password = payload.password ?? "";

  if (!fullName || !email || !phone || !password) {
    return NextResponse.json(
      { error: "Nom, email, téléphone et mot de passe sont obligatoires." },
      { status: 400 }
    );
  }

  if (!email.includes("@")) {
    return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Le mot de passe doit contenir au moins 6 caractères." },
      { status: 400 }
    );
  }

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      phone,
      city,
      country,
      company,
      trip_interest: tripInterest
    }
  });

  if (error || !data.user) {
    const alreadyExists = error?.message.toLowerCase().includes("already");
    return NextResponse.json(
      { error: alreadyExists ? "Un compte existe déjà avec cette adresse email." : error?.message ?? "Création impossible." },
      { status: alreadyExists ? 409 : 400 }
    );
  }

  await admin.from("profiles").upsert(
    {
      id: data.user.id,
      email: data.user.email ?? email,
      full_name: fullName,
      phone,
      city: city || null,
      country,
      company: company || null,
      trip_interest: tripInterest
    },
    { onConflict: "id" }
  );

  return NextResponse.json({ userId: data.user.id });
}

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
