"use client";

import { useState } from "react";
import { useQuery } from "react-query";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { getMatches } from "@/api";
import { useAuth } from "@/contexts/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { availableLeagues } from "@/utils/constants";
import { Loading } from "@/components/loading";
import { MatchesList } from "@/components/matches-by-date-list";
import { ArrowRight, ChevronDown } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { getPreviousMonth, getPreviousWeek } from "@/utils/date";

function SelectDateButton({
  label,
  onSelect,
  isSelected,
  onRemoveSelection,
}: {
  label: string;
  onSelect: () => void;
  isSelected: boolean;
  onRemoveSelection: () => void;
}) {
  return (
    <button
      className={twMerge(
        "h-10 px-3 rounded-md text-neutral-200 text-sm",
        isSelected
          ? "bg-neutral-700 border-neutral-600"
          : "bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700"
      )}
      onClick={isSelected ? onRemoveSelection : onSelect}
      type="button"
    >
      {label}
    </button>
  );
}

function LeagueSection({
  league,
  fromDate,
  toDate,
  ordering,
  startExpanded,
}: {
  league: League;
  fromDate?: Date;
  toDate?: Date;
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
      fromDate?.toLocaleDateString("pt-BR"),
      toDate?.toLocaleDateString("pt-BR"),
      ordering,
    ],
    async ({ pageParam = 0 }) => {
      const results = await getMatches(
        fromDate,
        toDate,
        league.code,
        pageParam,
        ordering,
        fromDate || toDate ? undefined : 5
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
          <div className="w-full flex items-center justify-start gap-y-2 gap-x-3 py-1 max-sm:flex-wrap">
            <Skeleton className="w-[7.5rem] h-[1.25rem]" />
            <Skeleton className="w-[7.5rem] h-[1.25rem]" />
          </div>
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
  const localOrdering = localStorage.getItem("sportboxd:selected_ordering");
  const localFromDate = localStorage.getItem("sportboxd:selected_from_date");
  const localToDate = localStorage.getItem("sportboxd:selected_to_date");
  const { isAuthenticated, handleLogout, openLoginModal } = useAuth();
  const [fromDate, selectFromDate] = useState<Date | undefined>(
    localFromDate && !isNaN(new Date(localFromDate).getTime())
      ? new Date(localFromDate)
      : undefined
  );
  const [toDate, selectToDate] = useState<Date | undefined>(
    localToDate && !isNaN(new Date(localToDate).getTime())
      ? new Date(localToDate)
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
      await getMatches(fromDate, toDate, undefined, 0, "-ratings_num", 5)
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
                  "min-w-[143px] rounded-lg bg-neutral-900 border border-neutral-800 p-3 flex flex-col gap-2 hover:bg-neutral-800 hover:border-neutral-600",
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
      <div className="w-full max-w-4xl flex flex-col items-start gap-2 px-4 pt-2 pb-6">
        <Select
          value={ordering}
          onValueChange={(value) => {
            if (value !== ordering) setOrdering(value);
            localStorage.setItem("sportboxd:selected_ordering", value);
          }}
        >
          <SelectTrigger className="w-full gap-2 h-10 bg-neutral-900 border border-neutral-800 focus:ring-0 hover:bg-neutral-800 hover:border-neutral-700">
            <SelectValue placeholder="Ordernar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="-date">Mais recentes</SelectItem>
            <SelectItem value="date">Mais antigos</SelectItem>
            <SelectItem value="-ratings_num">Mais relevantes</SelectItem>
            <SelectItem value="-avg_rating">Melhor avaliados</SelectItem>
            <SelectItem value="avg_rating">Pior avaliados</SelectItem>
          </SelectContent>
        </Select>
        <div className="w-full flex gap-2">
          <SelectDateButton
            label="Hoje"
            onSelect={() => selectFromDate(new Date())}
            onRemoveSelection={() => selectFromDate(undefined)}
            isSelected={fromDate?.getDate() === new Date().getDate()}
          />
          <SelectDateButton
            label="Última semana"
            onSelect={() => selectFromDate(getPreviousWeek(new Date()))}
            onRemoveSelection={() => selectFromDate(undefined)}
            isSelected={
              fromDate?.getDate() === getPreviousWeek(new Date()).getDate()
            }
          />
          <SelectDateButton
            label="Último mês"
            onSelect={() => selectFromDate(getPreviousMonth(new Date()))}
            onRemoveSelection={() => selectFromDate(undefined)}
            isSelected={
              fromDate?.getDate() === getPreviousMonth(new Date()).getDate()
            }
          />
        </div>
      </div>
      {availableLeagues.map((league, index) => {
        return (
          <LeagueSection
            key={`${league.code}-home-section`}
            league={league}
            fromDate={fromDate}
            toDate={toDate}
            ordering={ordering}
            startExpanded={index < 2}
          />
        );
      })}
    </div>
  );
}
