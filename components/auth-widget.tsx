"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { LoaderCircle, LogIn, LogOut, ShieldCheck, UserPlus, UserRound, X } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/platform/types";

type Mode = "signin" | "signup";

const initialSignup = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  country: "Cameroun",
  company: "",
  tripInterest: "Vacances",
  password: ""
};

export function AuthWidget() {
  const supabase = useMemo(() => createClient(), []);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("signin");
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [signin, setSignin] = useState({ email: "", password: "" });
  const [signup, setSignup] = useState(initialSignup);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshProfile = useCallback(async () => {
    if (!supabase) {
      setUser(null);
      setProfile(null);
      return;
    }

    const { data } = await supabase.auth.getUser();
    setUser(data.user);

    if (!data.user) {
      setProfile(null);
      return;
    }

    const serverProfile = await fetch("/api/auth/profile", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .catch(() => null);

    if (serverProfile?.profile) {
      setProfile(serverProfile.profile);
      return;
    }

    const { data: profileData } = await supabase.from("profiles").select("*").eq("id", data.user.id).maybeSingle();
    setProfile((profileData as Profile | null) ?? null);
  }, [supabase]);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    void refreshProfile();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(() => {
      void refreshProfile();
    });

    return () => subscription.unsubscribe();
  }, [refreshProfile, supabase]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [open]);

  async function handleSignin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) {
      setStatus("Supabase n'est pas encore configuré. Ajoute les variables d'environnement du projet.");
      return;
    }

    setLoading(true);
    setStatus(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: signin.email,
      password: signin.password
    });

    if (error) {
      setStatus(error.message);
    } else {
      setStatus("Connexion réussie.");
      await refreshProfile();
      setOpen(false);
    }

    setLoading(false);
  }

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) {
      setStatus("Supabase n'est pas encore configuré. Ajoute les variables d'environnement du projet.");
      return;
    }

    setLoading(true);
    setStatus(null);

    const { error, data } = await supabase.auth.signUp({
      email: signup.email,
      password: signup.password,
      options: {
        data: {
          full_name: signup.fullName,
          phone: signup.phone,
          city: signup.city,
          country: signup.country,
          company: signup.company,
          trip_interest: signup.tripInterest
        }
      }
    });

    if (error) {
      setStatus(error.message);
    } else {
      setStatus(data.session ? "Compte créé et connecté." : "Compte créé. Vérifie ton email pour confirmer l'accès.");
      setSignup(initialSignup);
      await refreshProfile();
    }

    setLoading(false);
  }

  async function handleSignout() {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {profile?.role === "admin" ? (
          <a
            href="/admin"
            className="hidden min-h-11 items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-sun-600 transition hover:bg-white md:inline-flex"
          >
            <ShieldCheck aria-hidden="true" className="h-4 w-4" />
            Gestion
          </a>
        ) : null}

        {user ? (
          <button
            type="button"
            onClick={handleSignout}
            className="hidden min-h-11 items-center gap-2 rounded-full border border-cyan-100 bg-white px-4 py-2 text-sm font-semibold text-ocean-950 transition hover:border-ocean-300 md:inline-flex"
          >
            <LogOut aria-hidden="true" className="h-4 w-4" />
            Sortir
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-cyan-100 bg-white px-4 py-2 text-sm font-semibold text-ocean-950 transition hover:border-ocean-300"
          >
            <UserRound aria-hidden="true" className="h-4 w-4" />
            Connexion
          </button>
        )}
      </div>

      {open ? (
        <div className="fixed inset-0 z-[80] grid place-items-center overflow-hidden bg-ocean-950/35 p-3 backdrop-blur-sm md:p-6">
          <div className="relative flex max-h-[calc(100svh-1.5rem)] w-full max-w-2xl flex-col overflow-hidden rounded-[8px] border border-cyan-100 bg-white shadow-lift md:max-h-[calc(100svh-3rem)]">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer"
              className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-cyan-50 text-ocean-950"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>

            <div className="min-h-0 overflow-y-auto p-5 md:p-6">
              <p className="text-sm font-semibold uppercase text-sun-600">Espace client</p>
              <h2 className="mt-2 pr-12 font-display text-3xl font-semibold text-ocean-950">
                Connexion ou création de compte
              </h2>
              <div className="mt-5 grid grid-cols-2 rounded-full border border-cyan-100 bg-cyan-50 p-1">
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className={mode === "signin" ? tabActiveClass : tabClass}
                >
                  <LogIn aria-hidden="true" className="h-4 w-4" />
                  Connexion
                </button>
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className={mode === "signup" ? tabActiveClass : tabClass}
                >
                  <UserPlus aria-hidden="true" className="h-4 w-4" />
                  Créer un compte
                </button>
              </div>

              {mode === "signin" ? (
                <form onSubmit={handleSignin} className="mt-6 grid gap-4">
                  <Field label="Email" value={signin.email} onChange={(value) => setSignin((state) => ({ ...state, email: value }))} type="email" />
                  <Field label="Mot de passe" value={signin.password} onChange={(value) => setSignin((state) => ({ ...state, password: value }))} type="password" />
                  <SubmitButton loading={loading}>Se connecter</SubmitButton>
                </form>
              ) : (
                <form onSubmit={handleSignup} className="mt-6 grid gap-4 md:grid-cols-2">
                  <Field label="Nom complet" value={signup.fullName} onChange={(value) => setSignup((state) => ({ ...state, fullName: value }))} required />
                  <Field label="Email" value={signup.email} onChange={(value) => setSignup((state) => ({ ...state, email: value }))} type="email" required />
                  <Field label="Téléphone" value={signup.phone} onChange={(value) => setSignup((state) => ({ ...state, phone: value }))} required />
                  <Field label="Ville" value={signup.city} onChange={(value) => setSignup((state) => ({ ...state, city: value }))} />
                  <Field label="Pays" value={signup.country} onChange={(value) => setSignup((state) => ({ ...state, country: value }))} />
                  <Field label="Entreprise / organisation" value={signup.company} onChange={(value) => setSignup((state) => ({ ...state, company: value }))} />
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">Intérêt principal</span>
                    <select
                      value={signup.tripInterest}
                      onChange={(event) => setSignup((state) => ({ ...state, tripInterest: event.target.value }))}
                      className="min-h-12 w-full rounded-[8px] border border-cyan-100 bg-cyan-50/60 px-4 text-sm outline-none transition focus:border-ocean-500"
                    >
                      <option>Vacances</option>
                      <option>Billet d&apos;avion</option>
                      <option>Assistance visa</option>
                      <option>Voyage d&apos;affaires</option>
                      <option>Excursion Cameroun</option>
                      <option>Événement / séminaire</option>
                    </select>
                  </label>
                  <Field label="Mot de passe" value={signup.password} onChange={(value) => setSignup((state) => ({ ...state, password: value }))} type="password" required />
                  <div className="md:col-span-2">
                    <SubmitButton loading={loading}>Créer mon compte</SubmitButton>
                  </div>
                </form>
              )}

              {status ? (
                <p className="mt-5 rounded-[8px] border border-cyan-100 bg-cyan-50 p-4 text-sm font-semibold text-ocean-950">
                  {status}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 w-full rounded-[8px] border border-cyan-100 bg-cyan-50/60 px-4 text-sm outline-none transition focus:border-ocean-500"
      />
    </label>
  );
}

function SubmitButton({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-ocean-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-ocean-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
}

const tabClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-slate-600 transition hover:text-ocean-950";

const tabActiveClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-ocean-950 shadow-sm";
