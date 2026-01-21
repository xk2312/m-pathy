type SecurityIconType =
  | "emotional"
  | "storage"
  | "deletion"
  | "triketon";


type Props = {
  type: SecurityIconType;
  className?: string;
};

export default function SecurityIcon({ type, className }: Props) {
  switch (type) {
    case "emotional":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          className={className}
        >
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );

    case "storage":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          className={className}
        >
          <rect x="4" y="6" width="16" height="10" rx="2" />
          <path d="M9 16v2h6v-2" />
          <path d="M12 10v2" />
        </svg>
      );

    case "deletion":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          className={className}
        >
          <rect x="6" y="4" width="12" height="16" rx="1" />
          <line x1="8" y1="8" x2="16" y2="16" />
        </svg>
      );

    case "triketon":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          className={className}
        >
          <polygon points="12 2 19 6 19 18 12 22 5 18 5 6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
  }
}
