"use client";

interface StarRatingProps {
  value: number | null;
  max?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
}

const SIZE: Record<NonNullable<StarRatingProps["size"]>, string> = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

function Star({ filled, className }: { filled: boolean; className: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.5}
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M12 2.5l2.92 6.18 6.58.96-4.75 4.7 1.12 6.66L12 17.85l-5.87 3.15 1.12-6.66L2.5 9.64l6.58-.96L12 2.5z" />
    </svg>
  );
}

export default function StarRating({
  value,
  max = 5,
  interactive = false,
  onChange,
  size = "md",
}: StarRatingProps) {
  const sizeCls = SIZE[size];
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => {
        const filled = i < (value ?? 0);
        const colorCls = filled ? "text-amber-400" : "text-slate-300";
        if (interactive) {
          return (
            <button
              key={i}
              type="button"
              onClick={() => onChange?.(i + 1)}
              aria-label={`Rate ${i + 1} out of ${max}`}
              className="cursor-pointer p-0.5 transition-transform hover:scale-110"
            >
              <Star filled={filled} className={`${sizeCls} ${colorCls}`} />
            </button>
          );
        }
        return (
          <Star key={i} filled={filled} className={`${sizeCls} ${colorCls}`} />
        );
      })}
    </span>
  );
}
