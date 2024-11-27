import axios, { InternalAxiosRequestConfig } from "axios";

import { getNextDay } from "@/utils/date";
import { getUserToken } from "@/lib/firebase";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL,
});

export async function authorization(
  config: InternalAxiosRequestConfig<any>
): Promise<InternalAxiosRequestConfig<any>> {
  if (typeof window === "undefined") return config;

  const token = await getUserToken();

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
}

api.interceptors.request.use(authorization);

async function getMatches(
  since: Date | undefined,
  until: Date | undefined,
  league: string | undefined,
  currentPage: number,
  orderBy: string,
  limit: number | undefined
) {
  return await api
    .get(`/matches/`, {
      params: {
        since: since?.toISOString(),
        until: until ? getNextDay(until).toISOString() : undefined,
        league,
        skip: (limit || 0) * currentPage,
        limit: limit || 0,
        order_by: orderBy,
      },
    })
    .then(({ data }) => {
      return {
        matches: data.matches.map((match: RemoteMatch) => {
          const ratingProportion = match.count_by_rating
            ? {
                "1": match.count_by_rating["1"] / match.ratings_num,
                "2": match.count_by_rating["2"] / match.ratings_num,
                "3": match.count_by_rating["3"] / match.ratings_num,
                "4": match.count_by_rating["4"] / match.ratings_num,
                "5": match.count_by_rating["5"] / match.ratings_num,
              }
            : {
                "1": 0,
                "2": 0,
                "3": 0,
                "4": 0,
                "5": 0,
              };
          const date = new Date(match.date);

          date.setHours(date.getHours() - 3);

          return {
            ...match,
            date,
            matchId: match._id,
            homeTeam: match.home_team,
            homeScore: match.home_score,
            awayTeam: match.away_team,
            awayScore: match.away_score,
            ratingsNum: match.ratings_num,
            avgRating: match.avg_rating ? match.avg_rating.toFixed(1) : 0,
            ratingProportion,
          };
        }),
        totalCount: data.total_count,
      };
    })
    .catch((error) => {
      console.log("error", error);
      // throw new Error("Erro ao buscar as matches");
      return { matches: [], totalCount: 0 };
    });
}

async function getMatchById(matchId: string) {
  // TODO remover
  const ratings = await getMatchRatings(matchId, null);

  return await api
    .get(`/matches/${matchId}`)
    .then(({ data: match }) => {
      const ratingProportion = match.count_by_rating
        ? {
            "1": match.count_by_rating["1"] / match.ratings_num,
            "2": match.count_by_rating["2"] / match.ratings_num,
            "3": match.count_by_rating["3"] / match.ratings_num,
            "4": match.count_by_rating["4"] / match.ratings_num,
            "5": match.count_by_rating["5"] / match.ratings_num,
          }
        : {
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 0,
          };
      const date = new Date(match.date);

      date.setHours(date.getHours() - 3);

      return {
        ...match,
        date,
        matchId: match._id,
        homeTeam: match.home_team,
        homeScore: match.home_score,
        awayTeam: match.away_team,
        awayScore: match.away_score,
        ratingsNum: match.ratings_num,
        avgRating: match.avg_rating ? match.avg_rating.toFixed(1) : 0,
        ratingProportion: ratingProportion,
        ratings:
          match.ratings?.map((rating: RemoteRating) => {
            const createdAt = new Date(rating.created_at);
            createdAt.setHours(createdAt.getHours() - 3);
            return {
              ...rating,
              ratingId: rating._id,
              matchId: rating.match_id,
              createdAt,
            };
          }) || ratings,
      };
    })
    .catch((err) => {
      console.log(err);
      // throw new Error("Erro ao buscar partida");
      return {
        matchId: "not-found",
        date: new Date(),
        homeTeam: "Time A",
        homeScore: 0,
        awayTeam: "Time B",
        awayScore: 0,
        ratingsNum: 0,
        avgRating: 0,
        ratings: [],
        ratingProportion: {
          "1": 0,
          "2": 0,
          "3": 0,
          "4": 0,
          "5": 0,
        },
      };
    });
}

async function getMatchRatings(matchId: string, ratingId: string | null) {
  const ratingIdParam = ratingId ? `?first_rating_id=${ratingId}` : "";

  return await api
    .get(`/ratings/${matchId}` + ratingIdParam)
    .then(({ data }) => {
      return data.map((rating: RemoteRating) => {
        const createdAt = new Date(rating.created_at);
        createdAt.setHours(createdAt.getHours() - 3);
        return {
          ...rating,
          ratingId: rating._id,
          matchId: rating.match_id,
          createdAt,
        };
      });
    })
    .catch(() => {
      // throw new Error("Erro ao buscar as matches");
      return [];
    });
}

async function postRating(data: {
  title: string;
  rating: number;
  comment: string;
  match_id: string;
}) {
  await api.post(`/ratings/`, data).catch(() => {
    throw new Error("Erro ao publicar avaliação");
  });
}

async function updateRatingLikes(ratingId: string, isLike: boolean) {
  await api.put(`/ratings/interaction/${ratingId}`, {
    is_reply: false,
    option: isLike ? "like" : "dislike",
  });
}

async function createMatchPreview({
  matchId,
  homeTeam,
  homeScore,
  awayTeam,
  awayScore,
  league,
}: Match) {
  await axios.get(
    `/api/get-preview?match_id=${matchId}&home_team=${homeTeam}&away_team=${awayTeam}&league=${league}&home_score=${homeScore}&away_score=${awayScore}`
  );
}

async function createRatingPreview(
  { matchId, homeTeam, homeScore, awayTeam, awayScore, league }: Match,
  { ratingId, title, author, comment }: Rating
) {
  await axios.get(
    `/api/get-preview?match_id=${matchId}&home_team=${homeTeam}&away_team=${awayTeam}&league=${league}&home_score=${homeScore}&away_score=${awayScore}&rating_title=${title}&rating_author=${author}&rating_comment=${comment}&rating_id=${ratingId}`
  );
}

export {
  createMatchPreview,
  createRatingPreview,
  getMatches,
  getMatchById,
  getMatchRatings,
  postRating,
  updateRatingLikes,
};
