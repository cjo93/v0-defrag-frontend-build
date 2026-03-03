export function Section({ children }: { children: React.ReactNode }) {
  return (
    <section className="py-4xl border-t border-borderSubtle">
      <div className="max-w-container mx-auto px-lg">
        {children}
      </div>
    </section>
  );
}
