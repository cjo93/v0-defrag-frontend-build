export function Card({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="border border-borderSubtle p-lg transition-standard hover:border-white/25">
      <h3 className="text-h3 mb-md">{title}</h3>
      <p className="text-body text-textSecondary">
        {children}
      </p>
    </div>
  );
}
