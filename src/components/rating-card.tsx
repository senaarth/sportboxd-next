import { formatDateLabel } from "@/utils/date";
import { ChevronDown } from "lucide-react";
import { Dispatch, SetStateAction, useState, useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { Stars } from "@/components/stars";
import { useMutation } from "react-query";
import { Loading } from "@/components/loading";

export const RatingCard = ({
  rating,
  setRatingToShare,
}: {
  rating: Rating;
  setRatingToShare: Dispatch<SetStateAction<Rating | null>>;
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
  const mutation = useMutation({
    mutationFn: async () => {},
    onError: () => {},
    onSuccess: () => {},
  });
  const textRef = useRef<HTMLParagraphElement>(null);

  const checkOverflow = () => {
    if (textRef.current) {
      const lineHeight = parseFloat(
        window.getComputedStyle(textRef.current).lineHeight
      );
      const lines = Math.round(textRef.current.scrollHeight / lineHeight);
      setIsOverflowing(lines > 3);
    }
  };

  useEffect(() => {
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [rating.comment, isExpanded]);

  return (
    <div
      key={`rating-${rating.ratingId}`}
      className="w-full bg-neutral-900 border border-neutral-800 rounded-md text-neutral-200 p-4"
    >
      <div className="w-full flex items-center justify-between gap-2">
        <div className="flex flex-col items-start justify-start gap-0.5">
          <p className="text-base font-semibold line-clamp-2">{rating.title}</p>
          <Stars color="lime" number={rating.rating} size="xs" />
        </div>
        <div className="flex flex-col items-end justify-center">
          <p className="text-xs font-semibold text-right">{rating.author}</p>
          <p className="text-xs text-neutral-600">
            {formatDateLabel(rating.createdAt)}
          </p>
        </div>
      </div>
      <p
        ref={textRef}
        className={twMerge(
          "text-sm mt-4 transition-all",
          isExpanded ? "" : "line-clamp-3"
        )}
      >
        {rating.comment}
      </p>
      {isOverflowing && (
        <button
          className="text-xs mt-2 w-full text-right text-neutral-400 flex items-center justify-end gap-0.5"
          onClick={() => setIsExpanded(!isExpanded)}
          type="button"
        >
          <ChevronDown
            className={twMerge(
              "h-3 w-3 transition-all",
              isExpanded ? "rotate-180" : ""
            )}
          />
          {isExpanded ? "Ver menos" : "Ver mais"}
        </button>
      )}
      <div className="w-full flex items-center justify-between mt-2">
        <div className="flex items-center gap-1.5">
          <button className="mr-0.5" type="button">
            <img
              className="w-4 h-4"
              src="/icons/thumbs_up_filled.svg"
              alt="ícone de compartilhar"
            />
          </button>
          <p className="text-xs text-neutral-600">
            {mutation.isLoading ? (
              <Loading size="xs" color="neutral" />
            ) : (
              rating.likes
            )}
          </p>
          <button type="button">
            <img
              className="w-5 h-5"
              src="/icons/thumbs_down_outline.svg"
              alt="ícone de compartilhar"
            />
          </button>
        </div>
        <button
          className="p-1 rounded hover:bg-neutral-800 ml-auto"
          onClick={() => setRatingToShare(rating)}
          type="button"
        >
          <img
            className="w-4 h-4"
            src="/icons/share.svg"
            alt="ícone de compartilhar"
          />
        </button>
      </div>
    </div>
  );
};
