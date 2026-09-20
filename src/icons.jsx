// One stroke weight and style for every icon. Decorative by default (aria-hidden).
const Svg = ({ size = 20, stroke = 1.9, children, ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...rest}
  >
    {children}
  </svg>
)

export const ExtIcon = (p) => (
  <Svg size={14} stroke={2.25} {...p}>
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </Svg>
)
export const InboxIcon = (p) => (
  <Svg {...p}>
    <path d="M3 13h5l1.5 3h5L16 13h5" />
    <path d="M5 5h14l2 8v6H3v-6z" />
  </Svg>
)
export const FlagIcon = (p) => (
  <Svg {...p}>
    <path d="M5 21V4" />
    <path d="M5 4h11l-2 4 2 4H5" />
  </Svg>
)
export const PenIcon = (p) => (
  <Svg {...p}>
    <path d="M4 20h4L19 9l-4-4L4 16z" />
    <path d="M13.5 6.5l4 4" />
  </Svg>
)
export const CheckIcon = (p) => (
  <Svg stroke={2.3} {...p}>
    <path d="M5 12l4.5 4.5L19 7" />
  </Svg>
)
export const ClockIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
)
export const ChevronIcon = (p) => (
  <Svg size={18} stroke={2.25} {...p}>
    <path d="M9 6l6 6-6 6" />
  </Svg>
)
export const MailIcon = (p) => (
  <Svg {...p}>
    <path d="M3 6h18v12H3z" />
    <path d="M3 7l9 7 9-7" />
  </Svg>
)
export const FileIcon = (p) => (
  <Svg {...p}>
    <path d="M6 3h8l4 4v14H6z" />
    <path d="M14 3v4h4" />
  </Svg>
)
export const FolderIcon = (p) => (
  <Svg {...p}>
    <path d="M3 7h6l2 2h10v10H3z" />
  </Svg>
)
export const UsersIcon = (p) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
    <circle cx="17.5" cy="9" r="2.5" />
    <path d="M17 14.2c2.6.2 4.5 2 4.5 5.3" />
  </Svg>
)
export const UserPlusIcon = (p) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
    <path d="M19 8v6" />
    <path d="M16 11h6" />
  </Svg>
)
export const ChartIcon = (p) => (
  <Svg {...p}>
    <path d="M4 20V4" />
    <path d="M4 20h16" />
    <path d="M8 16v-4" />
    <path d="M12 16V8" />
    <path d="M16 16v-6" />
  </Svg>
)
export const TrendIcon = (p) => (
  <Svg {...p}>
    <path d="M3 17l6-6 4 4 8-8" />
    <path d="M15 7h6v6" />
  </Svg>
)
export const SlidersIcon = (p) => (
  <Svg {...p}>
    <path d="M4 6h10" />
    <path d="M18 6h2" />
    <circle cx="16" cy="6" r="2" />
    <path d="M4 12h2" />
    <path d="M10 12h10" />
    <circle cx="8" cy="12" r="2" />
    <path d="M4 18h10" />
    <path d="M18 18h2" />
    <circle cx="16" cy="18" r="2" />
  </Svg>
)
export const ShieldIcon = (p) => (
  <Svg {...p}>
    <path d="M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6z" />
    <path d="M8.5 12l2.5 2.5L15.5 10" />
  </Svg>
)
