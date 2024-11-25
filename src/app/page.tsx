"use client";

import { useState } from "react";
import { useInfiniteQuery, useQuery } from "react-query";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { getMatches } from "@/api";
import { useAuth } from "@/contexts/auth";
import { Skeleton } from "@/components/ui/skeleton";

const AVAILABLE_LEAGUES: League[] = [
  {
    code: "BSA",
    sport: "soccer",
    label: "Brasileirão - Série A",
  },
  {
    code: "PL",
    sport: "soccer",
    label: "Premier League",
  },
];

export default function Home() {
  const router = useRouter();
  const localLeague = localStorage.getItem("sportboxd:selected_league");
  const localOrdering = localStorage.getItem("sportboxd:selected_ordering");
  const localDate = localStorage.getItem("sportboxd:selected_date");
  const { isAuthenticated, handleLogout, openLoginModal } = useAuth();
  const [selectedLeague, selectLeague] = useState<League>(
    localLeague ? JSON.parse(localLeague) : AVAILABLE_LEAGUES[0]
  );
  const [selectedDate, selectDate] = useState<Date | undefined>(
    localDate && !isNaN(new Date(localDate).getTime())
      ? new Date(localDate)
      : undefined
  );
  const [ordering, setOrdering] = useState<string>(
    localOrdering === "-date" ||
      localOrdering === "date" ||
      localOrdering === "-ratings_num" ||
      localOrdering === "-avg_rating" ||
      localOrdering === "avg_rating"
      ? localOrdering
      : "-date"
  );
  const {
    data: mostCommentedData,
    error: errorMostCommented,
    isLoading: isLoadingMostCommented,
  } = useQuery<{ matches: Match[]; totalCount: number }>(
    ["most-commented-matches"],
    async () =>
      await getMatches(undefined, undefined, undefined, 0, "-ratings_num", 5)
  );

  return (
    <div className="w-full flex flex-col items-center justify-start py-5">
      <div className="w-full max-w-4xl flex items-center justify-between mb-2 px-4">
        <img
          alt="Logo sportboxd, imagem com nome do site escrito"
          className="h-7"
          src="/img/sportboxd.svg"
        />
        <button
          className={twMerge(
            "text-sm px-2 py-1",
            isAuthenticated ? "text-neutral-200" : "text-lime-500"
          )}
          onClick={isAuthenticated ? handleLogout : openLoginModal}
          type="button"
        >
          {isAuthenticated ? "Sair" : "Entrar"}
        </button>
      </div>
      <div className="w-full max-w-4xl flex flex-col items-start justify-start gap-2 py-4">
        <p className="text-neutral-200 font-semibold text-sm ml-4">
          Mais comentados
        </p>
        <div className="w-full max-w-full overflow-auto scroll-m-0 flex items-center justify-start gap-2">
          {isLoadingMostCommented || errorMostCommented ? (
            <>
              <Skeleton className="min-w-[143px] w-[143px] h-[62px] rounded-lg ml-4" />
              <Skeleton className="min-w-[143px] w-[143px] h-[62px] rounded-lg" />
              <Skeleton className="min-w-[143px] w-[143px] h-[62px] rounded-lg" />
              <Skeleton className="min-w-[143px] w-[143px] h-[62px] rounded-lg" />
              <Skeleton className="min-w-[143px] w-[143px] h-[62px] rounded-lg mr-4" />
            </>
          ) : (
            mostCommentedData?.matches.map((match, index) => (
              <Link
                key={`most-commented-${match.matchId}`}
                className={twMerge(
                  "min-w-[143px] rounded-lg bg-neutral-800 border border-neutral-600 p-3 flex flex-col gap-2 hover:bg-neutral-700",
                  index === 0 ? "ml-4" : "",
                  index === mostCommentedData?.matches.length - 1 ? "mr-4" : 0
                )}
                href={`/partidas/${match.matchId}`}
              >
                <div className="flex items-center justify-start gap-2">
                  <img
                    className="w-4 h-4 object-contain"
                    src={`/img/crests/${match.league}/${match.homeTeam}.png`}
                    alt={`escudo do time da casa, ${match.homeTeam}`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/img/crest_fallback.png";
                    }}
                  />
                  <p className="text-neutral-200 text-xs text-start line-clamp-1">
                    {match.homeTeam}
                  </p>
                  <p
                    className={twMerge(
                      "text-xs",
                      match.homeScore > match.awayScore
                        ? "text-neutral-200"
                        : "text-neutral-500"
                    )}
                  >
                    {match.homeScore}
                  </p>
                </div>
                <div className="flex items-center justify-start gap-2">
                  <img
                    className="w-4 h-4 object-contain"
                    src={`/img/crests/${match.league}/${match.awayTeam}.png`}
                    alt={`escudo do time visitante, ${match.awayTeam}`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/img/crest_fallback.png";
                    }}
                  />
                  <p className="text-neutral-200 text-xs text-start line-clamp-1">
                    {match.awayTeam}
                  </p>
                  <p
                    className={twMerge(
                      "text-xs",
                      match.awayScore > match.homeScore
                        ? "text-neutral-200"
                        : "text-neutral-500"
                    )}
                  >
                    {match.awayScore}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
