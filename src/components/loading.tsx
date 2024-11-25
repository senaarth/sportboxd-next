import { twMerge } from "tailwind-merge";

const sizeVariants = {
  xs: "h-4 w-4 border-2",
  sm: "",
  base: "h-10 w-10 border-4",
  lg: "",
};

const colorVariants = {
  lime: "text-lime-500",
  neutral: "text-neutral-500",
  "neutral-dark": "text-neutral-950",
};

export function Loading({
  color = "lime",
  size = "base",
}: {
  color?: "lime" | "neutral" | "neutral-dark";
  size?: "xs" | "sm" | "base" | "lg";
}) {
  return (
    <div
      className={twMerge(
        "inline-block animate-spin rounded-full border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite]",
        sizeVariants[size],
        colorVariants[color]
      )}
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
}
