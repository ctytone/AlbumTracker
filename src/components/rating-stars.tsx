"use client";

import { useState } from "react";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export function RatingStars({
  value,
  name,
}: {
  value: number | null;
  /** If `name` is provided, each star will be rendered as a submit button with this name/value. Useful inside forms. */
  name?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => {
        const active = (value ?? 0) >= star;
        const hovered = hover !== null && hover >= star;
        const filled = hovered || active;

        const commonProps = {
          key: star,
          onMouseEnter: () => setHover(star),
          onMouseLeave: () => setHover(null),
          className: cn(
            "inline-flex items-center justify-center rounded-md p-1 transition",
            filled ? "text-yellow-400" : "text-muted-foreground hover:text-yellow-300",
          ),
          'aria-label': `Rate ${star} stars`,
        } as any;

        if (name) {
          return (
            <button {...commonProps} type="submit" name={name} value={String(star)}>
              <Star className={cn("h-5 w-5", filled && "fill-current")} />
            </button>
          );
        }

        return (
          <button
            {...commonProps}
            type="button"
            onClick={() => {
              /* noop - callers can handle clicks by wrapping in a form or controlling state */
            }}
          >
            <Star className={cn("h-5 w-5", filled && "fill-current")} />
          </button>
        );
      })}
    </div>
  );
}
