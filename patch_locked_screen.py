import re

with open('components/editorial/states.tsx', 'r') as f:
    content = f.read()

# Replace LockedScreen with the proper props
replacement = """export function LockedScreen({
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
  productName?: string;
  price?: string;
  priceInterval?: string;
  features?: string[];
  onUnlock: () => Promise<void>;
  isProcessing?: boolean;
  error?: string;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full max-w-[520px] px-6 md:px-8 pt-32 pb-40">
        <H1>{title}</H1>
        <Spacer size="m" />
        <Body>{description}</Body>
        <Spacer size="l" />
        {features && features.length > 0 && (
          <ul className="mb-8 space-y-2">
            {features.map((feature, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-white/40">-</span>
                <span className="text-white/80">{feature}</span>
              </li>
            ))}
          </ul>
        )}
        <PrimaryActionButton onClick={onUnlock} disabled={isProcessing}>
          {isProcessing ? 'Processing...' : `Unlock ${productName || 'Access'} (${price || ''})`}
        </PrimaryActionButton>
        {error && (
          <p className="mt-4 text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
}"""

content = re.sub(r"export function LockedScreen\(\{.*\}\) \{\s*return \(\s*<div.*?</div>\s*\);\s*\}", replacement, content, flags=re.DOTALL)

with open('components/editorial/states.tsx', 'w') as f:
    f.write(content)
