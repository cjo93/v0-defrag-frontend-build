import { H1, Body, MicroLabel } from "./type";
import { Spacer } from "./spacing";
import { PrimaryActionButton } from "./controls";

export function LoadingScreen({ label = "Loading" }: { label?: string }) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center">
      <div className="w-full max-w-[520px] mx-auto px-6 md:px-8">
        <MicroLabel>{label}</MicroLabel>
        <div className="mt-6 h-px w-10 bg-white/10" />
      </div>
    </div>
  );
}

export function LockedScreen({
  title,
  body,
  ctaLabel,
  onCta,
}: {
  title: string;
  body: string;
  ctaLabel: string;
  onCta: () => void;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full max-w-[520px] px-6 md:px-8 pt-32 pb-40">
        <H1>{title}</H1>
        <Spacer size="m" />
        <Body>{body}</Body>
        <Spacer size="l" />
        <PrimaryActionButton onClick={onCta}>{ctaLabel}</PrimaryActionButton>
      </div>
    </div>
  );
}
