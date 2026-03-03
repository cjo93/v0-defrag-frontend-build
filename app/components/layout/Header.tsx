export function Header() {
  return (
    <header className="h-[72px] border-b border-borderSubtle flex items-center">
      <div className="max-w-container mx-auto w-full px-lg flex justify-between">
        <div className="text-small tracking-widest uppercase">
          DEFRAG
        </div>
        <a href="/login" className="text-small text-textSecondary hover:text-textPrimary transition-standard">
          Login
        </a>
      </div>
    </header>
  );
}
