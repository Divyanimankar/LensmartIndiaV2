import { initials } from "../data/blogData";

const svgProps = (size, strokeWidth = 2) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
});

export const SearchIcon = ({ size = 16 }) => (
  <svg {...svgProps(size)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const CalendarIcon = ({ size = 14 }) => (
  <svg {...svgProps(size)}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" />
  </svg>
);

export const ClockIcon = ({ size = 14 }) => (
  <svg {...svgProps(size)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const CloseIcon = ({ size = 16, strokeWidth = 2.2 }) => (
  <svg {...svgProps(size, strokeWidth)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const ArrowRightIcon = ({ size = 14 }) => (
  <svg {...svgProps(size, 2.2)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ArrowUpRightIcon = ({ size = 19 }) => (
  <svg {...svgProps(size, 2.2)}>
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
);

export const SparkIcon = ({ size = 13 }) => (
  <svg {...svgProps(size, 2.4)}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.5 2.5M15.2 15.2l2.5 2.5M17.7 6.3l-2.5 2.5M8.8 15.2l-2.5 2.5" />
  </svg>
);

export const ChevronLeftIcon = ({ size = 16 }) => (
  <svg {...svgProps(size, 2.4)}>
    <path d="m15 6-6 6 6 6" />
  </svg>
);

export const ChevronRightIcon = ({ size = 16 }) => (
  <svg {...svgProps(size, 2.4)}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export function Avatar({ name, size = 28 }) {
  return (
    <span
      className="blog-avatar"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}