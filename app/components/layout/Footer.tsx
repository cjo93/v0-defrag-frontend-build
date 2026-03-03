export function Footer() {
  return (
    <footer className="border-t border-borderSubtle py-xl text-small text-textSecondary">
      <div className="max-w-container mx-auto px-lg flex justify-between">
        <span>© DEFRAG</span>
        <div className="flex gap-lg">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/contact">Contact</a>
        </div>
      </div>
    </footer>
  );
}
