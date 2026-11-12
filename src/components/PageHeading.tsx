export function PageHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mt-4 mb-8">
      <h1 className="font-display text-5xl tracking-wide sm:text-6xl">{title}</h1>
      {description && <p className="mt-2 max-w-2xl text-lg text-muted">{description}</p>}
    </div>
  );
}
