// Instant fallback for route navigations. Without it, a client navigation
// can't commit until the destination's server render finishes, which in
// production (remote API) left the transition curtain in providers.js
// covering the screen until then. With it, the route commits right away
// and the curtain reveals this blank page while the real content streams in.
export default function Loading() {
  return <div className="min-h-dvh bg-background" aria-busy="true" />;
}
