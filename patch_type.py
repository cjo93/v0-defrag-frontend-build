with open("components/editorial/type.tsx", "r") as f:
    content = f.read()

content = content.replace("export function H2({ children }: { children: ReactNode }) {", "export function H2({ children, className }: { children: ReactNode; className?: string }) {")
content = content.replace("className=\"font-display text-[24px] md:text-[32px] leading-[1.3] tracking-[-0.01em] font-medium text-white\"", "className={`font-display text-[24px] md:text-[32px] leading-[1.3] tracking-[-0.01em] font-medium text-white ${className || ''}`}")

content = content.replace("export function Body({ children }: { children: ReactNode }) {", "export function Body({ children, className }: { children: ReactNode; className?: string }) {")
content = content.replace("className=\"text-[16px] leading-[1.75] text-white/45\"", "className={`text-[16px] leading-[1.75] text-white/45 ${className || ''}`}")

with open("components/editorial/type.tsx", "w") as f:
    f.write(content)
