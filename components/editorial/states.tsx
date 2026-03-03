import { H1, Body, MicroLabel, H2 } from "./type";
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
  description,
  productName,
  price,
  priceInterval,
  features,
  onUnlock,
  isProcessing,
  error,
}: {
  title: string;
  description: string;
  productName: string;
  price: string;
  priceInterval: string;
  features: string[];
  onUnlock: () => void;
  isProcessing: boolean;
  error?: string;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full max-w-[520px] px-6 md:px-8 pt-32 pb-40">
        <H1>{title}</H1>
        <Spacer size="m" />
        <Body>{description}</Body>
        <Spacer size="xl" />

        <div className="border border-white/20 p-6">
           <H2>{productName}</H2>
           <Spacer size="s" />
           <div className="text-sm font-mono text-white/60 mb-6">{price} / {priceInterval}</div>

           <ul className="space-y-3 mb-8">
             {features.map((feature, i) => (
                <li key={i} className="text-sm flex items-start gap-3 text-white/80">
                   <span className="text-white/40 mt-0.5">-</span>
                   <span>{feature}</span>
                </li>
             ))}
           </ul>

           {error && (
             <div className="text-red-500 text-sm mb-4">{error}</div>
           )}

           <PrimaryActionButton onClick={onUnlock} disabled={isProcessing}>
             {isProcessing ? "Processing..." : `Unlock ${productName}`}
           </PrimaryActionButton>
        </div>
      </div>
    </div>
  );
}
