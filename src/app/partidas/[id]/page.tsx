"use client";

import { useQuery } from "react-query";
import { formatDateLabel } from "@/utils/date";
import { Stars } from "@/components/stars";
import { RatingModal } from "@/components/rating-modal";
import { useMemo, useState } from "react";
import { getMatchById } from "@/api";
import { LoadingScreen } from "@/components/loading-screen";
import { ShareRatingModal } from "@/components/share-rating-modal";
import { twMerge } from "tailwind-merge";
import { RatingCard } from "@/components/rating-card";
import { useSearchParams, useRouter } from "next/navigation";

const RatingProportionComponent = ({
  rating,
  proportion,
}: {
  rating: number;
  proportion: number;
}) => {
  return (
    <div className="flex items-center gap-1">
      <div className="w-14 h-[3px] bg-neutral-800 flex items-center justify-start rounded overflow-hidden">
        <span
          className="h-1 bg-neutral-600"
          style={{ width: `${proportion * 100}%` }}
        />
      </div>
      <Stars color="neutral" number={rating} size="2xs" />
    </div>
  );
};

const CrestComponent = ({ league, team }: { league: string; team: string }) => {
  return (
    <div className="w-full flex flex-col items-center px-3 gap-2">
      <img
        className="h-11"
        src={`/img/crests/${league}/${team}.png`}
        alt={`escudo do time da casa, ${team}`}
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/img/crest_fallback.png";
        }}
      />
      <p className="text-base text-neutral-200">{team}</p>
    </div>
  );
};

export default function MatchPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id;
  const [isRatingModalOpen, setRatingModalOpen] = useState<boolean>(false);
  const [ratingToShare, setRatingToShare] = useState<Rating | null>(null);
  const [ratingValue, setRatingValue] = useState<number>(0);
  const ratingId = searchParams.get("rating_id");
  const {
    data: match,
    error,
    isLoading,
    refetch: refetchMatch,
  } = useQuery<Match>(["match", id], async () => {
    if (!id) return {};
    return await getMatchById(id);
  });
  const sharedRating = useMemo(
    () => match?.ratings.find((rating) => rating.ratingId === ratingId),
    [ratingId]
  );

  if (isLoading || error || !match) return <LoadingScreen />;

  return (
    <div className="w-full min-h-svh bg-neutral-950">
      <div className="w-full flex items-center justify-center px-4 py-6 bg-neutral-900">
        <div className="w-full max-w-4xl flex flex-col items-start justify-start gap-4">
          <button
            className="flex items-center justify-center gap-2 text-base text-neutral-200 hover:brightness-75 transition-all"
            onClick={() => router.push("/")}
            type="button"
          >
            <img
              className="w-5 h-5 p-[2px] -rotate-90"
              src="/img/icons/chevron_up.svg"
              alt="ícone de seta para a esquerda"
            />
            Voltar
          </button>
          <div className="w-full p-4 grid grid-cols-3">
            <CrestComponent league={match.league} team={match.homeTeam} />
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-neutral-500 text-center">
                {formatDateLabel(match.date)}
              </p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-3xl text-neutral-200 font-semibold flex items-center gap-2">
                  <span
                    className={twMerge(
                      "w-1 h-1 rounded-full",
                      match.homeScore > match.awayScore &&
                        match.status === "FINISHED"
                        ? "bg-lime-500"
                        : "bg-transparent"
                    )}
                  />
                  {match.homeScore}
                </p>
                <p className="text-3xl text-neutral-200 font-semibold">-</p>
                <p className="text-3xl text-neutral-200 font-semibold flex items-center gap-2">
                  {match.awayScore}
                  <span
                    className={twMerge(
                      "w-1 h-1 rounded-full",
                      match.awayScore > match.homeScore &&
                        match.status === "FINISHED"
                        ? "bg-lime-500"
                        : "bg-transparent"
                    )}
                  />
                </p>
              </div>
              <p className="text-xs text-neutral-200 flex items-center gap-2 ">
                {match.status === "FINISHED" ||
                match.matchId === "673a106c1b576d2329fee225" ? (
                  "Encerrado"
                ) : (
                  <>
                    Em andamento
                    <span
                      className={twMerge(
                        "w-1 h-1 rounded-full bg-lime-400",
                        "animate-ping"
                      )}
                    />
                  </>
                )}
              </p>
            </div>
            <CrestComponent league={match.league} team={match.awayTeam} />
          </div>
        </div>
      </div>
      <div className="w-full max-w-4xl flex flex-col items-center justify-start p-4 mx-auto">
        <div className="w-full flex items-center justify-between py-2">
          <p className="text-sm text-neutral-200">Toque para avaliar</p>
          <Stars
            color="lime"
            number={0}
            onStarClick={(value) => {
              setRatingValue(value);
              setRatingModalOpen(true);
            }}
            size="lg"
          />
        </div>
        <span className="w-full h-[1px] bg-neutral-800 my-4" />
        <div className="w-full flex items-center justify-start py-2">
          <div className="flex flex-col items-start text-neutral-200 p-2 gap-1">
            <p className="text-sm">Avaliações</p>
            <p className="text-4xl font-semibold">{match.avgRating}/5</p>
          </div>
          <div className="ml-auto flex flex-col items-end justify-start gap-1">
            <RatingProportionComponent
              rating={5}
              proportion={match.ratingProportion[5]}
            />
            <RatingProportionComponent
              rating={4}
              proportion={match.ratingProportion[4]}
            />
            <RatingProportionComponent
              rating={3}
              proportion={match.ratingProportion[3]}
            />
            <RatingProportionComponent
              rating={2}
              proportion={match.ratingProportion[2]}
            />
            <RatingProportionComponent
              rating={1}
              proportion={match.ratingProportion[1]}
            />
            <p className="text-neutral-500 text-xs mt-1">
              {match.ratingsNum} avaliações
            </p>
          </div>
        </div>
        <div className="w-full flex flex-col items-center justify-start gap-2 mt-4">
          {match.ratings.length ? (
            <>
              {sharedRating ? (
                <>
                  <p className="h-6 px-2 py-0.5 bg-lime-500 rounded-md text-xs mr-auto leading-5 text-neutral-950">
                    Compartilhado com você
                  </p>
                  <RatingCard
                    rating={sharedRating}
                    setRatingToShare={setRatingToShare}
                  />
                  <span className="w-full h-[1px] bg-neutral-800 my-4" />
                </>
              ) : null}
              {match.ratings.map((rating) =>
                rating.ratingId !== sharedRating?.ratingId ? (
                  <RatingCard
                    key={rating.ratingId}
                    rating={rating}
                    setRatingToShare={setRatingToShare}
                  />
                ) : null
              )}
            </>
          ) : (
            <p className="text-sm text-neutral-200 text-center mt-5">
              Parace que não há avaliações para essa partida, que tal{" "}
              <button
                className="font-medium text-lime-500"
                onClick={() => setRatingModalOpen(true)}
                type="button"
              >
                fazer a primeira?
              </button>
            </p>
          )}
        </div>
      </div>
      {isRatingModalOpen ? (
        <RatingModal
          defaultValue={ratingValue}
          isOpen={isRatingModalOpen}
          match={match}
          onClose={() => setRatingModalOpen(false)}
          onSubmitError={() => {}}
          onSubmitSuccess={() => {
            setRatingModalOpen(false);
            refetchMatch();
          }}
        />
      ) : null}
      {ratingToShare ? (
        <ShareRatingModal
          isOpen={!!ratingToShare}
          onClose={() => setRatingToShare(null)}
          rating={ratingToShare}
          match={match}
        />
      ) : null}
    </div>
  );
}
