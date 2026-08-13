"use client";
// ============================================================================
// Sign in / create account (email + password via Supabase Auth).
// Supabase stores only a bcrypt hash of the password in auth.users — we never
// see or store the plaintext. A profiles row is auto-created by a DB trigger;
// the app collects display name / favourite team in onboarding afterwards.
// "Continue with Google" is a planned follow-up (needs a Google OAuth app).
// ============================================================================
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Turnstile } from "@/components/Turnstile";

type Mode = "signin" | "signup";

// Set once you create a Turnstile widget; until then the CAPTCHA is skipped so
// the form still works. Must be enabled on BOTH sides (here + Supabase Auth).
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // CAPTCHA state (only relevant when a site key is configured).
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaKey, setCaptchaKey] = useState(0); // bump to remount = fresh token
  const onCaptchaToken = useCallback((t: string | null) => setCaptchaToken(t), []);
  const resetCaptcha = useCallback(() => {
    setCaptchaToken(null);
    setCaptchaKey((k) => k + 1);
  }, []);

  const captchaOk = !TURNSTILE_SITE_KEY || !!captchaToken;
  const canSubmit =
    /\S+@\S+\.\S+/.test(email) && password.length >= 6 && captchaOk && !busy;

  async function signInWithGoogle() {
    setError(null);
    setNotice(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    // On success the browser is redirected to Google; we only get here on error.
    if (error) setError(error.message);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy(true);
    setError(null);
    setNotice(null);

    const options = captchaToken ? { captchaToken } : undefined;

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password, options });
      if (error) {
        setError(error.message);
        resetCaptcha();
        setBusy(false);
        return;
      }
      // If email confirmation is ON, there is no session yet.
      if (!data.session) {
        setNotice("Check your email to confirm your account, then sign in.");
        setMode("signin");
        resetCaptcha();
        setBusy(false);
        return;
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password, options });
      if (error) {
        setError(error.message);
        resetCaptcha();
        setBusy(false);
        return;
      }
    }

    // Session cookie is now set — go to the game (proxy will allow it).
    router.replace("/");
    router.refresh();
  }

  return (
    <div className="min-h-dvh flex flex-col px-6 py-10" style={{ background: "var(--rp-ground)" }}>
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">⚽️</div>
        <h1 className="rp-display text-3xl font-extrabold text-white">Real Predictions</h1>
        <p className="text-sm mt-1" style={{ color: "#9fb0c2" }}>
          Predict the Premier League. Beat your mates.
        </p>
      </div>

      <div className="card p-6 mt-2 w-full max-w-sm mx-auto">
        <h2 className="font-bold text-lg mb-1">
          {mode === "signin" ? "Sign in" : "Create your account"}
        </h2>
        <p className="text-sm mb-5" style={{ color: "var(--rp-muted)" }}>
          {mode === "signin"
            ? "Welcome back — pick up where you left off."
            : "Sign up once, then play on any device."}
        </p>

        <button
          type="button"
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold mb-4"
          style={{ background: "#fff", color: "#1c1424", border: "1px solid var(--rp-border)" }}
        >
          <span>🔵</span> Continue with Google
        </button>

        <div className="flex items-center gap-3 mb-4">
          <span className="flex-1 h-px" style={{ background: "var(--rp-border)" }} />
          <span className="text-xs" style={{ color: "var(--rp-muted)" }}>or with email</span>
          <span className="flex-1 h-px" style={{ background: "var(--rp-border)" }} />
        </div>

        <form onSubmit={submit}>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-3 py-2.5 rounded-xl mb-4"
            style={{ background: "var(--rp-surface-2)", border: "1px solid var(--rp-border)", color: "var(--rp-text)" }}
          />

          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="w-full px-3 py-2.5 rounded-xl mb-2"
            style={{ background: "var(--rp-surface-2)", border: "1px solid var(--rp-border)", color: "var(--rp-text)" }}
          />

          {error && (
            <p className="text-sm mb-2" style={{ color: "#ff6b6b" }}>{error}</p>
          )}
          {notice && (
            <p className="text-sm mb-2" style={{ color: "var(--rp-mint)" }}>{notice}</p>
          )}

          {TURNSTILE_SITE_KEY && (
            <div className="mt-3">
              <Turnstile key={captchaKey} siteKey={TURNSTILE_SITE_KEY} onToken={onCaptchaToken} />
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="btn-primary w-full py-3 rounded-xl font-semibold mt-3"
          >
            {busy ? "…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="text-sm text-center mt-5" style={{ color: "var(--rp-muted)" }}>
          {mode === "signin" ? "New here? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
              setNotice(null);
            }}
            className="font-semibold"
            style={{ color: "var(--rp-accent)" }}
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
