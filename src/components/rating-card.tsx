import { formatDateLabel } from "@/utils/date";
import { ChevronDown, MessageSquareText } from "lucide-react";
import { Dispatch, SetStateAction, useState, useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { Stars } from "@/components/stars";
import { useMutation } from "react-query";
import { Loading } from "@/components/loading";
import { createRatingPreview, likeRating } from "@/api";
import { useAuth } from "@/contexts/auth";
import Link from "next/link";
import { queryClient } from "@/app/layout";

export const RatingCard = ({
  match,
  rating,
  setRatingToShare,
}: {
  match: Match;
  rating: Rating;
  setRatingToShare: Dispatch<SetStateAction<Rating | null>>;
}) => {
  const { isAuthenticated, openLoginModal, user } = useAuth();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
  const [useExtraLike, setUseExtraLike] = useState<boolean>(false);
  const [useExtraDislike, setUseExtraDislike] = useState<boolean>(false);
  const { mutate: requestPreviewCreation } = useMutation({
    mutationFn: async () => {
      await createRatingPreview(match, rating);
    },
    retry: true,
  });
  const { mutate: requestRatingLike, isLoading: isLikeLoading } = useMutation({
    mutationFn: async (option: string) => {
      if (!rating || !user?.uid || rating.dislikes.includes(user.uid)) return;
      await likeRating(rating.ratingId, option);
      if (option === "likes") setUseExtraLike(true);
    },
    onSuccess: () => {
      if (match) queryClient.refetchQueries(["match", match.matchId]);
    },
  });
  const { mutate: requestRatingDislike, isLoading: isDislikeLoading } =
    useMutation({
      mutationFn: async (option: string) => {
        if (!rating || !user?.uid || rating.likes.includes(user.uid)) return;
        await likeRating(rating.ratingId, option);
        if (option === "dislikes") setUseExtraDislike(true);
      },
      onSuccess: () => {
        if (match) queryClient.refetchQueries(["match", match.matchId]);
      },
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
    setUseExtraDislike(false);
    setUseExtraLike(false);
  }, [rating]);

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
      <div className="w-full flex items-start justify-between">
        <div className="flex flex-col items-start justify-start gap-1">
          <p className="text-xs font-semibold leading-[1.2]">{rating.author}</p>
          <p className="text-sm font-semibold leading-[1.2] line-clamp-2">
            {rating.title}
          </p>
        </div>
        <p className="text-xs text-neutral-600">
          {formatDateLabel(rating.createdAt)}
        </p>
      </div>
      <Stars className="mt-4" color="lime" number={rating.rating} size="xs" />
      <p
        ref={textRef}
        className={twMerge(
          "text-sm mt-2 transition-all",
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
      <div className="w-full flex items-center justify-between mt-4">
        <div className="flex items-center gap-1">
          <button
            className="mr-0.5 disabled:cursor-not-allowed disabled:opacity-30"
            type="button"
            disabled={!!user?.uid && rating.dislikes.includes(user.uid)}
            onClick={() => {
              if (!isAuthenticated || !user?.uid) {
                openLoginModal();
                return;
              }

              if (rating.likes.includes(user.uid)) {
                requestRatingLike("-likes");
                return;
              }

              requestRatingLike("likes");
            }}
          >
            {(!!user && rating.likes.includes(user?.uid)) || useExtraLike ? (
              <img
                className="w-4 h-4"
                src="/img/icons/thumbs_up_filled.svg"
                alt="ícone de curtida"
              />
            ) : (
              <img
                className="w-4 h-4"
                src="/img/icons/thumbs_up_outline.svg"
                alt="ícone de curtida"
              />
            )}
          </button>
          <p className="text-sm text-neutral-600 w-4">
            {isLikeLoading ? (
              <Loading size="xs" color="neutral" />
            ) : (
              rating.likes.length + (useExtraLike ? 1 : 0)
            )}
          </p>
        </div>
        <div className="flex items-center gap-1 ml-1">
          <button
            className="mr-0.5 disabled:cursor-not-allowed disabled:opacity-30"
            type="button"
            disabled={!!user?.uid && rating.likes.includes(user.uid)}
            onClick={() => {
              if (!isAuthenticated || !user?.uid) {
                openLoginModal();
                return;
              }

              if (rating.dislikes.includes(user.uid)) {
                requestRatingDislike("-dislikes");
                return;
              }

              requestRatingDislike("dislikes");
            }}
          >
            {(!!user && rating.dislikes.includes(user?.uid)) ||
            useExtraDislike ? (
              <img
                className="w-4 h-4"
                src="/img/icons/thumbs_down_filled.svg"
                alt="ícone de descurtida"
              />
            ) : (
              <img
                className="w-4 h-4"
                src="/img/icons/thumbs_down_outline.svg"
                alt="ícone de descurtida"
              />
            )}
          </button>
          <p className="text-sm text-neutral-600 w-4">
            {isDislikeLoading ? (
              <Loading size="xs" color="neutral" />
            ) : (
              rating.dislikes.length + (useExtraDislike ? 1 : 0)
            )}
          </p>
        </div>
        <Link
          href={`/avaliacoes/${match.matchId}/${rating.ratingId}`}
          className="flex items-center gap-1 ml-1"
          onClick={() => {
            queryClient.refetchQueries(["match", match.matchId]);
            queryClient.refetchQueries(["rating", rating.ratingId]);
          }}
        >
          <MessageSquareText size={16} />
          <p className="text-sm text-neutral-600">
            {rating.replies?.length || 0}
          </p>
        </Link>
        <span className="h-5 w-[1px] bg-neutral-700 mx-3" />
        <Link
          className="font-semibold text-sm text-neutral-400"
          href={`/avaliacoes/${match.matchId}/${rating.ratingId}`}
          onClick={() => {
            queryClient.refetchQueries(["match", match.matchId]);
            queryClient.refetchQueries(["rating", rating.ratingId]);
          }}
        >
          Responder
        </Link>
        <button
          className="p-1 rounded hover:bg-neutral-800 ml-auto"
          onClick={() => {
            setRatingToShare(rating);
            requestPreviewCreation();
          }}
          type="button"
        >
          <img
            className="w-4 h-4"
            src="/img/icons/share.svg"
            alt="ícone de compartilhar"
          />
        </button>
      </div>
    </div>
  );
};
