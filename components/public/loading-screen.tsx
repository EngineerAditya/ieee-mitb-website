/**
 * Branded splash, used as the route-level Suspense fallback. Pure
 * presentational — the editorial wordmark on the bone canvas.
 */
export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--canvas)]">
      <div
        className="font-display text-4xl tracking-tight text-[var(--ink)] sm:text-6xl"
        style={{ animation: "loader-fade-in 1.4s ease forwards" }}
      >
        IEEE <span className="italic text-[var(--accent)]">MIT</span>
      </div>
    </div>
  );
}
