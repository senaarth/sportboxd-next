"use client";

import { useState } from "react";
import { useInfiniteQuery, useQuery } from "react-query";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { getMatches } from "@/api";
import { useAuth } from "@/contexts/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { availableLeagues } from "@/utils/constants";
import { Loading } from "@/components/loading";
import { MatchesList } from "@/components/matches-by-date-list";
import { ArrowRight, ChevronDown, ChevronRight, ChevronUp } from "lucide-react";

function LeagueSection({
  league,
  selectedDate,
  ordering,
  startExpanded,
}: {
  league: League;
  selectedDate?: Date;
  ordering: string;
  startExpanded: boolean;
}) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState<boolean>(startExpanded);
  const [showAllMatches, setShowAllMatches] = useState<boolean>(false);
  const {
    data: matchesData,
    error: error,
    isLoading,
  } = useQuery<{ matches: Match[]; totalCount: number }>(
    [
      "matches",
      league.code,
      selectedDate?.toLocaleDateString("pt-BR"),
      ordering,
    ],
    async ({ pageParam = 0 }) => {
      const results = await getMatches(
        selectedDate,
        selectedDate,
        league.code,
        pageParam,
        ordering,
        5
      );
      return results;
    },
    {
      enabled: league.isAvailable,
    }
  );

  const footerButtonsContainer = () => (
    <div className="w-full flex items-center justify-start gap-y-2 gap-x-3 py-2 max-sm:flex-wrap">
      <button
        className="text-sm hover:underline min-w-[7.5rem] text-start flex items-center gap-1"
        onClick={() => setShowAllMatches(!showAllMatches)}
        type="button"
      >
        {showAllMatches ? "Mostrar menos" : "Mostrar mais"}
        <ChevronDown
          size={16}
          className={twMerge(
            "transition-all",
            showAllMatches ? "rotate-180" : ""
          )}
        />
      </button>
      <button
        className="text-sm hover:underline w-full text-start flex items-center gap-1"
        onClick={() => router.push(`/leagues/${league.code}`)}
        type="button"
      >
        Ver página da liga
        <ArrowRight size={16} />
      </button>
    </div>
  );

  return (
    <div className="w-full max-w-4xl flex flex-col px-4 mb-6 gap-2">
      <button
        type="button"
        onClick={() => {
          if (!isLoading) setIsExpanded(!isExpanded);
        }}
        className="w-full flex items-center justify-between"
      >
        <p className="text-neutral-200 text-base font-bold flex items-center gap-2">
          <img
            className="w-8 h-8 rounded-full p-1 border border-neutral-600"
            src={league.logo}
            alt={`logo ${league.label}`}
          />
          {league.label}
        </p>
        {isLoading ? (
          <Loading size="xs" color="neutral" />
        ) : (
          <ChevronDown
            className={twMerge(
              "transition-all",
              isExpanded ? "rotate-180" : ""
            )}
            size={20}
          />
        )}
      </button>
      {league.isAvailable && isExpanded && !isLoading ? (
        <div className="w-full max-w-4xl flex flex-col items-center justify-start gap-2">
          {!matchesData?.matches || matchesData.matches.length === 0 ? (
            <p className="text-sm text-neutral-200 mt-5 text-center max-w-96">
              Parece que não encontramos partidas nas datas/ligas selecionadas,
              que tal mudar os filtros?
            </p>
          ) : (
            <>
              <MatchesList
                key={`matches-league-${league.code}`}
                matches={matchesData.matches.slice(0, 2)}
                groupByDate={false}
              />
              {showAllMatches ? (
                <MatchesList
                  key={`matches-league-${league.code}`}
                  matches={matchesData.matches.slice(2)}
                  groupByDate={false}
                />
              ) : null}
              {footerButtonsContainer()}
            </>
          )}
        </div>
      ) : league.isAvailable && isExpanded && isLoading ? (
        <div className="w-full max-w-4xl flex flex-col items-center justify-start gap-2">
          <Skeleton className="w-full h-[178px] rounded-lg" />
          <Skeleton className="w-full h-[178px] rounded-lg" />
        </div>
      ) : !league.isAvailable && isExpanded ? (
        <p className="text-sm text-neutral-200 mt-5 text-center w-full">
          Disponível em breve
        </p>
      ) : null}
    </div>
  );
}

export default function Home() {
  const localLeague = localStorage.getItem("sportboxd:selected_league");
  const localOrdering = localStorage.getItem("sportboxd:selected_ordering");
  const localDate = localStorage.getItem("sportboxd:selected_date");
  const { isAuthenticated, handleLogout, openLoginModal } = useAuth();
  const [selectedLeague, selectLeague] = useState<League>(
    localLeague ? JSON.parse(localLeague) : availableLeagues[0]
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
        <div className="w-full max-w-full overflow-auto flex items-center justify-start gap-2">
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
                href={`/matches/${match.matchId}`}
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
      {availableLeagues.map((league, index) => {
        return (
          <LeagueSection
            key={`${league.code}-home-section`}
            league={league}
            selectedDate={selectedDate}
            ordering={ordering}
            startExpanded={index < 2}
          />
        );
      })}
    </div>
  );
}
