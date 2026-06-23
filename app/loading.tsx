/**
 * Route-level Suspense fallback. Shown only while a route's server data is
 * streaming.
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="kicker animate-pulse">Loading</p>
    </div>
  );
}
