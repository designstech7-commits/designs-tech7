export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 border border-acid/20 rounded-sm animate-spin-slow" />
          <div className="absolute inset-2 bg-acid/20 rounded-sm animate-pulse" />
        </div>
        <p className="text-label text-platinum/30 animate-pulse">Loading…</p>
      </div>
    </div>
  );
}
