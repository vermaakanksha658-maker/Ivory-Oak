export default function AdminLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-3 w-40 bg-charcoal/8" />
      <div className="mt-4 h-12 w-80 max-w-full bg-charcoal/8" />
      <div className="mt-3 h-3 w-60 max-w-full bg-charcoal/8" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-44 border border-charcoal/8 bg-cream"
          />
        ))}
      </div>
      <div className="mt-8 h-72 border border-charcoal/8 bg-cream" />
    </div>
  );
}
