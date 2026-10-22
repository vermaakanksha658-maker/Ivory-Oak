export function InstagramIcon({
  className,
  strokeWidth = 1.5,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function PinterestIcon({
  className,
  strokeWidth = 1.5,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.2 21c.5-1.6 1.2-4.5 1.5-5.7.2-.8.2-1.2.1-1.6-.2-.5-.6-1.1-.6-2 0-1.9 1.1-3.3 2.5-3.3 1.2 0 1.8.9 1.8 2 0 1.2-.8 3-1.2 4.7-.3 1.4.7 2.5 2.1 2.5 2.5 0 4.2-3.2 4.2-7 0-2.9-1.9-5.1-5.4-5.1-3.9 0-6.4 2.9-6.4 6.1 0 1.1.3 1.8.8 2.4.2.2.2.3.2.6-.1.4-.3 1.2-.4 1.6-.1.4-.4.6-.8.4-1.5-.6-2.2-2.2-2.2-4 0-3.5 2.9-7.6 8.8-7.6 4.7 0 7.8 3.4 7.8 7 0 4.9-2.7 8.5-6.7 8.5-1.3 0-2.6-.7-3-1.6l-.8 3.1" />
    </svg>
  );
}
