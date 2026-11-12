export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="panel bg-white/70 p-8 text-center text-muted" style={{ boxShadow: "none", borderStyle: "dashed" }}>
      {children}
    </div>
  );
}
