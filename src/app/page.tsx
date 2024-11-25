"use client";

import { useState } from "react";
import { useInfiniteQuery } from "react-query";
import { twMerge } from "tailwind-merge";

import { getMatches } from "@/api";
import { useAuth } from "@/contexts/auth";

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
    data: matchesData,
    error: error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery<{ matches: Match[]; totalCount: number }>(
    [
      "matches",
      selectedLeague.code,
      selectedDate?.toLocaleDateString("pt-BR"),
      ordering,
    ],
    async ({ pageParam = 0 }) => {
      const results = await getMatches(
        selectedDate,
        selectedDate,
        selectedLeague.code,
        pageParam,
        ordering
      );
      return results;
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        const totalPages = Math.ceil(
          lastPage.totalCount / lastPage.matches.length
        );
        const nextPage = allPages.length + 1;
        return nextPage <= totalPages ? nextPage : undefined;
      },
    }
  );

  return (
    <div className="w-full flex flex-col items-center justify-start px-4 py-5">
      <div className="w-full max-w-4xl flex items-center justify-between">
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
    </div>
  );
}
