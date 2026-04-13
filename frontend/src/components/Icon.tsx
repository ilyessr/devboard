type IconName =
  | "home"
  | "login"
  | "boards"
  | "plus"
  | "close"
  | "calendar"
  | "trash"
  | "edit"
  | "more"
  | "logout"
  | "check"
  | "spark";

type IconProps = {
  name: IconName;
  className?: string;
};

export function Icon({ name, className }: IconProps) {
  const baseProps = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "home":
      return (
        <svg {...baseProps}>
          <path d="M3 10.5L12 3l9 7.5" />
          <path d="M5.5 9.5V21h13V9.5" />
        </svg>
      );
    case "login":
      return (
        <svg {...baseProps}>
          <path d="M14 4h4a2 2 0 012 2v12a2 2 0 01-2 2h-4" />
          <path d="M10 17l5-5-5-5" />
          <path d="M15 12H4" />
        </svg>
      );
    case "boards":
      return (
        <svg {...baseProps}>
          <rect x="3" y="4" width="7" height="16" rx="1.5" />
          <rect x="14" y="4" width="7" height="8" rx="1.5" />
          <rect x="14" y="14" width="7" height="6" rx="1.5" />
        </svg>
      );
    case "plus":
      return (
        <svg {...baseProps}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case "close":
      return (
        <svg {...baseProps}>
          <path d="M6 6l12 12" />
          <path d="M18 6L6 18" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...baseProps}>
          <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
          <path d="M7.5 3.5v3M16.5 3.5v3M3.5 9.5h17" />
        </svg>
      );
    case "trash":
      return (
        <svg {...baseProps}>
          <path d="M4 7h16" />
          <path d="M9 7V4h6v3" />
          <path d="M7 7l1 13h8l1-13" />
        </svg>
      );
    case "edit":
      return (
        <svg {...baseProps}>
          <path d="M4 20h4l10-10-4-4L4 16v4z" />
          <path d="M12 6l4 4" />
        </svg>
      );
    case "more":
      return (
        <svg {...baseProps}>
          <circle cx="5" cy="12" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="19" cy="12" r="1.5" />
        </svg>
      );
    case "logout":
      return (
        <svg {...baseProps}>
          <path d="M10 4H6a2 2 0 00-2 2v12a2 2 0 002 2h4" />
          <path d="M14 17l5-5-5-5" />
          <path d="M19 12H9" />
        </svg>
      );
    case "check":
      return (
        <svg {...baseProps}>
          <path d="M5 12.5l4 4L19 7.5" />
        </svg>
      );
    case "spark":
      return (
        <svg {...baseProps}>
          <path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3z" />
          <path d="M5 17l.8 1.9L7.7 20l-1.9.8L5 22l-.8-1.2L2.3 20l1.9-1.1L5 17z" />
        </svg>
      );
  }
}
