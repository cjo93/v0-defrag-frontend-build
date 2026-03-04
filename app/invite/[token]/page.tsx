"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type InviteState = "loading" | "invalid" | "form" | "submitting" | "success";
type Step = 1 | 2 | 3;

export default function InvitePage() {
  const params = useParams();
  const token = params.token as string;

  const [state, setState] = useState<InviteState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [inviteeName, setInviteeName] = useState("");

  // Form fields
  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [shareTime, setShareTime] = useState(true);
  const [sharePlace, setSharePlace] = useState(true);

  // Validate token on load
  useEffect(() => {
    async function validate() {
      try {
        const res = await fetch(`/api/invite/validate?token=${encodeURIComponent(token)}`);
        const data = await res.json();

        if (!res.ok || !data.valid) {
          setErrorMessage(data.error || "This invite is no longer valid.");
          setState("invalid");
          return;
        }

        setInviteeName(data.invitee_name || "");
        setName(data.invitee_name || "");
        setState("form");
      } catch {
        setErrorMessage("Unable to verify invite. Please try again.");
        setState("invalid");
      }
    }
    validate();
  }, [token]);

  const handleSubmit = async () => {
    if (!name.trim() || !birthDate) return;

    setState("submitting");

    try {
      const privacyLevel = shareTime && sharePlace ? "full" : "partial";

      const res = await fetch("/api/invite/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          name: name.trim(),
          birth_date: birthDate,
          birth_time: shareTime ? (birthTime || "12:00") : null,
          birth_place: sharePlace ? (birthPlace || null) : null,
          privacy_level: privacyLevel,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Something went wrong.");
        setState("invalid");
        return;
      }

      setState("success");
    } catch {
      setErrorMessage("Network error. Please try again.");
      setState("form");
    }
  };

  // ─── LOADING ───
  if (state === "loading") {
    return (
      <Shell>
        <p className="font-mono text-[11px] text-white/40 uppercase tracking-[0.2em] animate-pulse">
          Verifying invite…
        </p>
      </Shell>
    );
  }

  // ─── INVALID ───
  if (state === "invalid") {
    return (
      <Shell>
        <div className="space-y-4 text-center">
          <h1 className="text-[22px] md:text-[26px] font-normal tracking-[-0.015em] text-white">
            Invite expired
          </h1>
          <p className="text-[15px] text-white/50 leading-relaxed">
            {errorMessage}
          </p>
        </div>
      </Shell>
    );
  }

  // ─── SUCCESS ───
  if (state === "success") {
    return (
      <Shell>
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 mx-auto rounded-full border border-green-400/30 bg-green-400/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-[22px] md:text-[26px] font-normal tracking-[-0.015em] text-white">
            Thank you
          </h1>
          <p className="text-[15px] text-white/50 leading-relaxed">
            Your information has been securely added.
          </p>
        </div>
      </Shell>
    );
  }

  // ─── FORM ───
  return (
    <Shell>
      <div className="w-full max-w-[440px] space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <p className="font-mono text-[13px] font-semibold tracking-[0.2em] text-white">DEFRAG</p>
          <h1 className="text-[22px] md:text-[26px] font-normal tracking-[-0.015em] text-white">
            Share your birth details
          </h1>
          <p className="text-[14px] text-white/40 leading-relaxed">
            This helps someone understand your relational dynamics better.
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                s <= step ? "bg-white/60" : "bg-white/10"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Birth Date */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-2">
              <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
                Your name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First name"
                className="w-full h-[48px] px-4 bg-white/[0.04] border border-white/10 rounded-xl text-[15px] text-white placeholder:text-white/25 outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
                Date of birth
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full h-[48px] px-4 bg-white/[0.04] border border-white/10 rounded-xl text-[15px] text-white outline-none focus:border-white/30 transition-colors [color-scheme:dark]"
              />
            </div>
            <button
              onClick={() => {
                if (name.trim() && birthDate) setStep(2);
              }}
              disabled={!name.trim() || !birthDate}
              className="w-full h-[48px] bg-white text-black text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-xl hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Birth Time */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-2">
              <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
                Birth time
              </label>
              <p className="text-[13px] text-white/30">
                Optional — defaults to noon if unknown.
              </p>
              <input
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="w-full h-[48px] px-4 bg-white/[0.04] border border-white/10 rounded-xl text-[15px] text-white outline-none focus:border-white/30 transition-colors [color-scheme:dark]"
              />
            </div>

            {/* Privacy toggle */}
            <PrivacyToggle
              label="Share exact birth time"
              enabled={shareTime}
              onToggle={() => setShareTime(!shareTime)}
            />

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 h-[48px] border border-white/15 text-white/60 text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-xl hover:text-white hover:border-white/30 transition-all duration-200"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 h-[48px] bg-white text-black text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-xl hover:bg-white/90 transition-all duration-200"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Birth Place */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div className="space-y-2">
              <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
                Birth place
              </label>
              <p className="text-[13px] text-white/30">
                City where you were born.
              </p>
              <input
                type="text"
                value={birthPlace}
                onChange={(e) => setBirthPlace(e.target.value)}
                placeholder="e.g. Los Angeles, CA"
                className="w-full h-[48px] px-4 bg-white/[0.04] border border-white/10 rounded-xl text-[15px] text-white placeholder:text-white/25 outline-none focus:border-white/30 transition-colors"
              />
            </div>

            {/* Privacy toggle */}
            <PrivacyToggle
              label="Share exact location"
              enabled={sharePlace}
              onToggle={() => setSharePlace(!sharePlace)}
            />

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 h-[48px] border border-white/15 text-white/60 text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-xl hover:text-white hover:border-white/30 transition-all duration-200"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={state === "submitting"}
                className="flex-1 h-[48px] bg-white text-black text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-xl hover:bg-white/90 disabled:opacity-50 transition-all duration-200"
              >
                {state === "submitting" ? "Submitting…" : "Submit"}
              </button>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}

// ─── Shell ───
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased flex items-center justify-center p-6">
      <div className="w-full max-w-[440px] border border-white/10 bg-white/[0.02] p-6 md:p-8 rounded-xl animate-fade-in">
        {children}
      </div>
    </div>
  );
}

// ─── Privacy Toggle ───
function PrivacyToggle({
  label,
  enabled,
  onToggle,
}: {
  label: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between border border-white/[0.06] bg-white/[0.02] rounded-lg px-4 py-3 hover:border-white/15 transition-colors"
    >
      <span className="text-[14px] text-white/60">{label}</span>
      <div
        className={`w-10 h-6 rounded-full transition-colors duration-200 relative ${
          enabled ? "bg-white/30" : "bg-white/10"
        }`}
      >
        <div
          className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-200 ${
            enabled ? "left-5 bg-white" : "left-1 bg-white/40"
          }`}
        />
      </div>
    </button>
  );
}
