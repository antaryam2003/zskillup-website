/**
 * One icon family for the whole site.
 *
 * The brief is specific about this: "Keep all seven icons in a consistent visual
 * style and colour family. Avoid giving each icon an unrelated colour."
 *
 * So every icon here is the same 24x24 grid, the same 1.6 stroke weight, and
 * draws in `currentColor` - the surrounding element decides the colour. There is
 * no per-icon colour anywhere in the set.
 */

export type IconName =
  | "graduation"
  | "briefcase"
  | "users"
  | "target"
  | "book"
  | "chart"
  | "file"
  | "trending"
  | "building"
  | "globe"
  | "bulb"
  | "message"
  | "code"
  | "layers"
  | "database"
  | "search"
  | "calculator"
  | "shield"
  | "receipt"
  | "landmark"
  | "clipboard"
  | "coins"
  | "sparkle"
  | "play"
  | "arrowRight"
  | "arrowDown"
  | "chevronLeft"
  | "chevronRight"
  | "plus"
  | "minus"
  | "check"
  | "linkedin"
  | "phone"
  | "mail"
  | "pin"
  | "menu"
  | "close";

const paths: Record<IconName, React.ReactNode> = {
  graduation: (
    <>
      <path d="M2 8.5 12 4l10 4.5-10 4.5L2 8.5Z" />
      <path d="M6 10.6V16c0 1.4 2.7 2.6 6 2.6s6-1.2 6-2.6v-5.4" />
      <path d="M21 9v5" />
    </>
  ),
  briefcase: (
    <>
      <rect x="2.5" y="7" width="19" height="13" rx="2.5" />
      <path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7" />
      <path d="M2.5 12h19" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.8 19.5a6.2 6.2 0 0 1 12.4 0" />
      <path d="M16.5 5.2a3.2 3.2 0 0 1 0 5.9" />
      <path d="M17.6 14.2a6.2 6.2 0 0 1 3.6 5.3" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  book: (
    <>
      <path d="M4 4.5h5.5A2.5 2.5 0 0 1 12 7v12a2 2 0 0 0-2-2H4V4.5Z" />
      <path d="M20 4.5h-5.5A2.5 2.5 0 0 0 12 7v12a2 2 0 0 1 2-2h6V4.5Z" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20V10.5" />
      <path d="M10 20V4.5" />
      <path d="M16 20v-7" />
      <path d="M22 20H2" />
    </>
  ),
  file: (
    <>
      <path d="M13.5 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5L13.5 3Z" />
      <path d="M13.5 3v5.5H19" />
      <path d="M9 13h6M9 16.5h4" />
    </>
  ),
  trending: (
    <>
      <path d="M3 16.5 9.5 10l4 4L21 6.5" />
      <path d="M15.5 6.5H21v5.5" />
    </>
  ),
  building: (
    <>
      <path d="M3 20.5h18" />
      <path d="M5 20.5V9.2l7-4.7 7 4.7v11.3" />
      <path d="M10 20.5v-4.8h4v4.8" />
      <path d="M9.5 11.5h1M13.5 11.5h1" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M3.6 12h16.8" />
      <path d="M12 3.6c2.1 2.3 3.3 5.3 3.3 8.4s-1.2 6.1-3.3 8.4c-2.1-2.3-3.3-5.3-3.3-8.4S9.9 5.9 12 3.6Z" />
    </>
  ),
  bulb: (
    <>
      <path d="M9 17.5h6" />
      <path d="M10 20.5h4" />
      <path d="M12 3.5a5.8 5.8 0 0 0-3.4 10.5c.5.4.8 1 .9 1.6h5c.1-.6.4-1.2.9-1.6A5.8 5.8 0 0 0 12 3.5Z" />
    </>
  ),
  message: (
    <>
      <path d="M20.5 12.3c0 4-3.8 7.2-8.5 7.2a9.8 9.8 0 0 1-2.6-.35L4.5 20.5l1.2-3.4a6.9 6.9 0 0 1-2.2-4.8c0-4 3.8-7.2 8.5-7.2s8.5 3.2 8.5 7.2Z" />
    </>
  ),
  code: (
    <>
      <path d="M8.5 8 4 12.2l4.5 4.2" />
      <path d="M15.5 8 20 12.2l-4.5 4.2" />
      <path d="M13.4 5.5 10.6 19" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3.5 8.5 4.3-8.5 4.3-8.5-4.3L12 3.5Z" />
      <path d="m3.5 12.2 8.5 4.3 8.5-4.3" />
      <path d="m3.5 16.4 8.5 4.3 8.5-4.3" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="6.2" rx="7.6" ry="2.9" />
      <path d="M4.4 6.2v11.6c0 1.6 3.4 2.9 7.6 2.9s7.6-1.3 7.6-2.9V6.2" />
      <path d="M4.4 12c0 1.6 3.4 2.9 7.6 2.9s7.6-1.3 7.6-2.9" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.8" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  calculator: (
    <>
      <rect x="4.5" y="3" width="15" height="18" rx="2.5" />
      <path d="M8 7.5h8" />
      <path d="M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16.5h.01M12 16.5h.01M15.5 16.5h.01" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.2 5 6v5.6c0 4.2 2.9 7.5 7 9.2 4.1-1.7 7-5 7-9.2V6l-7-2.8Z" />
      <path d="m9.2 12 2 2 3.6-3.8" />
    </>
  ),
  receipt: (
    <>
      <path d="M5.5 3h13v18l-2.2-1.6-2.2 1.6-2.1-1.6L9.9 21l-2.2-1.6L5.5 21V3Z" />
      <path d="M9 8h6M9 12h6" />
    </>
  ),
  landmark: (
    <>
      <path d="M3 20.5h18" />
      <path d="M4.5 9.8h15L12 4.5 4.5 9.8Z" />
      <path d="M7 12v5.6M12 12v5.6M17 12v5.6" />
    </>
  ),
  clipboard: (
    <>
      <path d="M9 4.5H7.5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-12a2 2 0 0 0-2-2H15" />
      <rect x="9" y="2.8" width="6" height="3.4" rx="1.2" />
      <path d="m9.5 13 1.8 1.8 3.4-3.6" />
    </>
  ),
  coins: (
    <>
      <ellipse cx="9" cy="7" rx="5.4" ry="2.5" />
      <path d="M3.6 7v4.2c0 1.4 2.4 2.5 5.4 2.5s5.4-1.1 5.4-2.5V7" />
      <path d="M9.6 16.6c.6 1.2 2.7 2.1 5.2 2.1 3 0 5.4-1.1 5.4-2.5v-4.3" />
      <ellipse cx="15" cy="12" rx="5.4" ry="2.5" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3.5 13.7 9l5.5 1.7-5.5 1.7L12 18l-1.7-5.6L4.8 10.7 10.3 9 12 3.5Z" />
      <path d="M18.5 16.5 19.2 19l2.3.8-2.3.8-.7 2.4" />
    </>
  ),
  play: <path d="M8.5 5.6 18 12l-9.5 6.4V5.6Z" />,
  arrowRight: (
    <>
      <path d="M4.5 12h15" />
      <path d="m13.5 6 6 6-6 6" />
    </>
  ),
  arrowDown: (
    <>
      <path d="M12 4.5v15" />
      <path d="m6 13.5 6 6 6-6" />
    </>
  ),
  chevronLeft: <path d="m14.5 5.5-7 6.5 7 6.5" />,
  chevronRight: <path d="m9.5 5.5 7 6.5-7 6.5" />,
  plus: (
    <>
      <path d="M12 5.5v13" />
      <path d="M5.5 12h13" />
    </>
  ),
  minus: <path d="M5.5 12h13" />,
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7.5 10.5V17" />
      <path d="M7.5 7.4h.01" />
      <path d="M11.5 17v-3.6a2.4 2.4 0 0 1 4.8 0V17" />
      <path d="M11.5 10.5V17" />
    </>
  ),
  phone: (
    <path d="M6.2 3.8h3l1.5 3.8-1.9 1.4a11.5 11.5 0 0 0 5.2 5.2l1.4-1.9 3.8 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.2 6a2 2 0 0 1 2-2.2Z" />
  ),
  mail: (
    <>
      <rect x="2.8" y="5" width="18.4" height="14" rx="2.5" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21.5s7-5.8 7-11a7 7 0 1 0-14 0c0 5.2 7 11 7 11Z" />
      <circle cx="12" cy="10.2" r="2.6" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </>
  ),
  close: (
    <>
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </>
  ),
};

type Props = {
  name: IconName;
  className?: string;
  /** Icons here are decorative by default - the adjacent text carries the meaning. */
  title?: string;
};

export function Icon({ name, className = "h-5 w-5", title }: Props) {
  const filled = name === "play";
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {paths[name]}
    </svg>
  );
}
