import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const eventTypes = new Set(["visit", "click", "whatsapp_click"]);

type AnalyticsPayload = {
  eventType?: unknown;
  path?: unknown;
  label?: unknown;
  target?: unknown;
  metadata?: unknown;
};

export async function POST(request: NextRequest) {
  const payload = (await request.json().catch(() => null)) as AnalyticsPayload | null;
  const eventType = typeof payload?.eventType === "string" ? payload.eventType : "";

  if (!eventTypes.has(eventType)) {
    return NextResponse.json({ error: "Événement invalide." }, { status: 400 });
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase n'est pas configuré." }, { status: 503 });
  }

  const { error } = await supabase.from("site_events").insert({
    event_type: eventType,
    path: limitText(payload?.path, 500),
    label: limitText(payload?.label, 180),
    target: limitText(payload?.target, 500),
    metadata: {
      ...cleanMetadata(payload?.metadata),
      referrer: limitText(request.headers.get("referer"), 500),
      userAgent: limitText(request.headers.get("user-agent"), 500)
    }
  });

  if (error) {
    return NextResponse.json({ error: "Impossible d'enregistrer l'événement." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

function limitText(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : null;
}

function cleanMetadata(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([, item]) => item == null || ["string", "number", "boolean"].includes(typeof item))
      .slice(0, 20)
  );
}
