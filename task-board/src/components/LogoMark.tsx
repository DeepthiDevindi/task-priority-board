/**
 * LogoMark Component
 * App mark: a prioritized list — three rows with High / Medium / Low status dots
 * and bars that shorten as priority drops. Colors come from theme tokens.
 */
export function LogoMark() {
  return (
    <div className="app-logo-badge" aria-hidden="true">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="5" cy="6" r="2.25" fill="var(--color-high-dot)" />
        <circle cx="5" cy="12" r="2.25" fill="var(--color-medium-dot)" />
        <circle cx="5" cy="18" r="2.25" fill="var(--color-low-dot)" />
        <g stroke="var(--text-secondary)" strokeWidth="2.25" strokeLinecap="round">
          <path d="M10 6h11" stroke="var(--text-primary)" />
          <path d="M10 12h8" />
          <path d="M10 18h5" opacity="0.7" />
        </g>
      </svg>
    </div>
  );
}

export default LogoMark;
