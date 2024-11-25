import { forwardRef, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type HTMLAttributes = React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export type InputProps = HTMLAttributes & {
  label?: string;
  error?: string;
  isTextArea?: boolean;
  mask?: string;
  validationRules?: string | ReactNode;
  wrapperClassName?: string;
};

const TextInputElement = forwardRef<
  HTMLElement,
  HTMLAttributes & { isTextArea?: boolean }
>(({ isTextArea, ...props }, ref) => {
  return isTextArea ? (
    <textarea ref={ref as React.RefObject<HTMLTextAreaElement>} {...props} />
  ) : (
    <input ref={ref as React.RefObject<HTMLInputElement>} {...props} />
  );
});

TextInputElement.displayName = "TextInput";

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (
    {
      className,
      error,
      id,
      isTextArea,
      label,
      validationRules,
      wrapperClassName,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={twMerge(
          "relative flex flex-col items-start w-full",
          wrapperClassName
        )}
      >
        {label ? (
          <label className="mb-1 text-sm text-neutral-200" htmlFor={id}>
            {label}
          </label>
        ) : null}
        <TextInputElement
          className={twMerge(
            "flex h-10 w-full rounded-lg border border-neutral-600 bg-neutral-800 p-4 text-sm text-neutral-200 outline-0 focus:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-neutral-600",
            className
          )}
          id={id}
          isTextArea={isTextArea}
          ref={ref}
          {...props}
        />
        {error ? (
          <p className="mt-1 text-left text-xs text-orange-700">{error}</p>
        ) : null}
        {validationRules ? (
          <p className="mt-1 text-left text-xs text-neutral-300">
            {validationRules}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
