import { useState } from "react";
import { twMerge } from "tailwind-merge";

const colorVariants = {
  lime: "bg-lime-500",
  neutral: "bg-neutral-200",
  "neutral-dark": "bg-neutral-500",
};

const hoverVariants = {
  lime: "hover:bg-lime-500",
  neutral: "hover:bg-neutral-500",
  "neutral-dark": "bg-neutral-800",
};

const sizeVariants = {
  "2xs": {
    gap: "gap-[1px]",
    size: "w-[6px] h-[6px]",
  },
  xs: {
    gap: "gap-0.5",
    size: "w-2.5 h-2.5",
  },
  sm: {
    gap: "",
    size: "",
  },
  base: {
    gap: "",
    size: "",
  },
  lg: {
    gap: "gap-1.5",
    size: "w-[26px] h-[26px]",
  },
};

interface StarsProps {
  color: "lime" | "neutral" | "neutral-dark";
  number: number;
  onStarClick?: (rating: number) => void;
  size: "2xs" | "xs" | "sm" | "base" | "lg";
}

export function Stars({ color, number, onStarClick, size }: StarsProps) {
  const [starsToHighlightNum, setStarsToHighlightNum] =
    useState<number>(number);

  return (
    <div className={twMerge("flex items-center", sizeVariants[size].gap)}>
      {[0, 1, 2, 3, 4].map((item) => {
        return (
          <div
            key={`star-${item}`}
            className={twMerge(
              "flex items-center justify-center",
              sizeVariants[size].size
            )}
            style={{
              maskImage: `url(/icons/star_mask.svg)`,
              maskSize: "100%",
              maskRepeat: "no-repeat",
            }}
          >
            <button
              className={twMerge(
                "w-[50%] h-full transition-all",
                item + 0.5 <= starsToHighlightNum
                  ? colorVariants[color]
                  : "bg-neutral-600",
                onStarClick ? hoverVariants[color] : "cursor-default"
              )}
              onClick={() => (onStarClick ? onStarClick(item + 0.5) : null)}
              onMouseEnter={() => {
                if (!onStarClick) return;
                setStarsToHighlightNum(item + 0.5);
              }}
              onMouseLeave={() => {
                if (!onStarClick) return;
                setStarsToHighlightNum(number);
              }}
              type="button"
            ></button>
            <button
              className={twMerge(
                "w-[50%] h-full transition-all",
                item + 1 <= starsToHighlightNum
                  ? colorVariants[color]
                  : "bg-neutral-600",
                onStarClick ? hoverVariants[color] : "cursor-default"
              )}
              onClick={() => (onStarClick ? onStarClick(item + 1) : null)}
              onMouseEnter={() => {
                if (!onStarClick) return;
                setStarsToHighlightNum(item + 1);
              }}
              onMouseLeave={() => {
                if (!onStarClick) return;
                setStarsToHighlightNum(number);
              }}
              type="button"
            ></button>
          </div>
        );
      })}
    </div>
  );
}
