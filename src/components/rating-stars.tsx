"use client";

import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

const values = Array.from({ length: 10 }, (_, index) => (index + 1) * 0.5);

export function RatingStars({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (rating: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {values.map((rating) => {
        const active = value !== null && value >= rating;

        return (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className={cn(
              "inline-flex items-center rounded-md border px-2 py-1 text-xs transition",
              active
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border bg-background text-muted-foreground hover:border-primary/30",
            )}
            aria-label={`Rate ${rating} stars`}
          >
            <Star className={cn("mr-1 h-3 w-3", active && "fill-primary")} />
            {rating.toFixed(1)}
          </button>
        );
      })}
    </div>
  );
}
