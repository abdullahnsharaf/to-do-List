export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="theme-muted rounded-[2rem] border border-dashed border-outline-soft px-6 py-12 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-7 theme-text-muted">{description}</p>
    </div>
  );
}
