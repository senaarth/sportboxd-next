"use client";

import { useEffect, useState } from "react";
import { ShareRatingModal } from "@/components/share-rating-modal";
import { useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import {
  getMatchById,
  getRatingById,
  likeRating,
  postRatingReply,
} from "@/api";
import { useMutation, useQuery } from "react-query";
import { LoadingScreen } from "@/components/loading-screen";
import { formatDateLabel } from "@/utils/date";
import { Stars } from "@/components/stars";
import { useAuth } from "@/contexts/auth";
import { Loading } from "@/components/loading";
import { Input } from "@/components/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const commentFormSchema = z.object({
  comment: z.string().min(1, "Campo obrigatório"),
});

type CommentFormSchema = z.infer<typeof commentFormSchema>;

export default function RatingPage() {
  const params = useParams<{ match_id: string; rating_id: string }>();
  const matchId = params.match_id;
  const id = params.rating_id;
  const { user, isAuthenticated, openLoginModal } = useAuth();
  const [isShareModalOpen, setShareModalOpen] = useState<boolean>(false);
  const [likes, setLikes] = useState<string[]>([]);
  const [replies, setReplies] = useState<RatingReply[]>([]);
  const {
    data: rating,
    error,
    isLoading,
  } = useQuery<Rating>(["rating", id], async () => {
    if (!id) return {};
    return await getRatingById(id);
  });
  const {
    data: match,
    error: matchError,
    isLoading: isMatchLoading,
  } = useQuery<Match>(["match", matchId], async () => {
    if (!id) return {};
    return await getMatchById(matchId);
  });
  const { mutate: requestRatingLike, isLoading: isLikeLoading } = useMutation({
    mutationFn: async (option: string) => {
      if (!rating) return;
      await likeRating(rating.ratingId, option);

      if (option === "likes") addUserIdToLikes();
      else removeUserIdFromLikes();
    },
  });
  const { mutate: submitForm, isLoading: isSubmittingComment } = useMutation({
    mutationFn: async (data: { comment: string }) => {
      if (!isAuthenticated) {
        openLoginModal();
        return;
      }
      if (!match || !rating || !user) return;
      await postRatingReply(match?.matchId, data.comment, rating?.ratingId);
      if (!user.displayName) return;
      setReplies([
        {
          author: user.displayName,
          created_at: new Date().toDateString(),
          comment: data.comment,
          _id: `${user.displayName}-${data.comment}`,
        },
        ...replies,
      ]);
    },
  });
  const {
    handleSubmit,
    register,
    reset: resetForm,
  } = useForm<CommentFormSchema>({
    resolver: zodResolver(commentFormSchema),
  });

  const addUserIdToLikes = () => {
    if (user?.uid && !likes.includes(user.uid)) setLikes([...likes, user.uid]);
  };

  const removeUserIdFromLikes = () => {
    if (user?.uid && likes.includes(user.uid))
      setLikes(likes.filter((id) => id !== user.uid));
  };

  useEffect(() => {
    if (rating?.likes) setLikes(rating.likes);
    if (rating?.replies) setReplies(rating.replies);
  }, [rating]);

  if (
    isLoading ||
    error ||
    !rating ||
    !Object.keys(rating)?.length ||
    !match ||
    matchError ||
    isMatchLoading
  )
    return <LoadingScreen />;

  return (
    <div className="w-full min-h-svh bg-neutral-950">
      <div className="w-full flex items-center justify-center px-4 py-6 bg-neutral-900 bg-[url(/img/rating_page_bg.svg)] bg-no-repeat bg-cover">
        <div className="w-full max-w-4xl flex flex-col items-start justify-start gap-4">
          <div className="w-full flex items-center justify-between">
            <Link
              className="flex items-center justify-center gap-2 text-base text-neutral-200 hover:brightness-75 transition-all"
              href={`/partidas/${matchId}`}
            >
              Voltar
            </Link>
            <button
              className="p-1.5 rounded hover:bg-neutral-800 ml-auto"
              onClick={() => {
                setShareModalOpen(true);
              }}
              type="button"
            >
              <img
                className="w-5 h-5"
                src="/img/icons/share.svg"
                alt="ícone de compartilhar"
              />
            </button>
          </div>
          <div className="w-full flex flex-col gap-2">
            <div className="flex flex-row items-start justify-start gap-2">
              <div className="h-10 w-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center my-auto">
                <p className="text-neutral-200 text-base font-semibold">
                  {rating.author[0].toUpperCase()}
                </p>
              </div>
              <div className="flex flex-col gap-1 items-start mr-auto">
                <p className="text-base text-neutral-200 font-semibold">
                  {rating.author}
                </p>
                <p className="text-sm text-neutral-500">
                  {formatDateLabel(rating.createdAt)}
                </p>
              </div>
              <Stars size="sm" color="lime" number={rating.rating} />
            </div>
            <p className="text-base text-neutral-200 font-semibold mt-2">
              {rating.title}
            </p>
            <p className="text-base text-neutral-200">{rating.comment}</p>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center gap-4 mx-auto p-4 pb-12">
        <div className="w-full max-w-4xl flex items-center justify-start gap-2">
          <div className="flex items-center gap-1">
            <button
              className="mr-0.5"
              type="button"
              onClick={() => {
                if (!isAuthenticated || !user?.uid) {
                  openLoginModal();
                  return;
                }

                if (likes.includes(user.uid)) {
                  requestRatingLike("-likes");
                  return;
                }

                requestRatingLike("likes");
              }}
            >
              {!!user && likes.includes(user?.uid) ? (
                <img
                  className="w-5 h-5"
                  src="/img/icons/thumbs_up_filled.svg"
                  alt="ícone de curtida"
                />
              ) : (
                <img
                  className="w-5 h-5 rotate-180"
                  src="/img/icons/thumbs_down_outline.svg"
                  alt="ícone de curtida"
                />
              )}
            </button>
            <p className="text-sm text-neutral-600">
              {isLikeLoading ? (
                <Loading size="xs" color="neutral" />
              ) : (
                likes.length
              )}
            </p>
          </div>
          <p className="ml-auto text-base text-neutral-400 font-semibold">
            {replies.length} comentários
          </p>
        </div>
        <form
          onSubmit={handleSubmit((data) => {
            submitForm(data);
            resetForm();
          })}
          className="w-full max-w-4xl flex flex-col items-end"
        >
          <Input
            {...register("comment")}
            isTextArea
            placeholder="Adicione um comentário"
            className="min-h-28 bg-neutral-900 border-neutral-800"
          />
          <button
            className="text-sm rounded-md border bg-neutral-800 border-neutral-700 p-1 mr-4 -mt-12 mb-7 z-10"
            type="submit"
          >
            {isSubmittingComment ? (
              <Loading size="xs" color="neutral" />
            ) : (
              "Enviar"
            )}
          </button>
        </form>
        <span className="w-full max-w-4xl h-[1px] bg-neutral-800" />
        <p className="w-full max-w-4xl text-lg text-neutral-400">Comentários</p>
        <div className="w-full max-w-4xl flex flex-col gap-2">
          {replies.map((reply) => {
            return (
              <div
                key={reply._id}
                className="w-full bg-neutral-900 border-neutral-800 p-4 flex flex-col gap-2 rounded-md border"
              >
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-neutral-200 font-semibold leading-[1.1]">
                    {reply.author}
                  </p>
                  <p className="text-xs text-neutral-400 leading-[1.1]">
                    {formatDateLabel(new Date(reply.created_at))}
                  </p>
                </div>
                <p className="mt-2 text-base text-neutral-200">
                  {reply.comment}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      {rating ? (
        <ShareRatingModal
          isOpen={isShareModalOpen}
          onClose={() => setShareModalOpen(false)}
          rating={rating}
          match={match}
        />
      ) : null}
    </div>
  );
}
