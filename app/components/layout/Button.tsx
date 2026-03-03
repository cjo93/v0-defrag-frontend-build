export function Button({ children, variant = "primary", className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" }) {
  const baseClasses = "px-[32px] py-[16px] text-body rounded-none outline-none focus:outline-none cursor-pointer";

  const variants = {
    primary: "bg-transparent border border-[#FFFFFF] text-[#FFFFFF] tracking-[0.03em] hover:bg-[#FFFFFF] hover:text-[#000000] transition-fast",
    secondary: "bg-transparent border border-[rgba(255,255,255,0.24)] text-textSecondary hover:border-[#FFFFFF] hover:text-[#FFFFFF] transition-standard"
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
