import { twMerge } from "tailwind-merge";
import { Stars } from "@/components/stars";
import Link from "next/link";

interface MatchCardProps {
  matchId: string;
  homeTeam: string;
  homeScore: number;
  awayTeam: string;
  awayScore: number;
  avgRating: number;
  ratingsNum: number;
  date: Date;
  league: string;
  status: string;
}

export function MatchCard({
  matchId,
  homeTeam,
  homeScore,
  awayTeam,
  awayScore,
  avgRating,
  ratingsNum,
  league,
  status,
}: MatchCardProps) {
  return (
    <Link
      className="w-full rounded-md flex flex-col gap-4 p-4 border border-neutral-800 bg-neutral-900 hover:border-neutral-700 hover:bg-neutral-800  max-w-md:bg-[url(/img/match_card_bg.svg)] max-w-md:bg-cover max-w-md:bg-no-repeat"
      href={`/partidas/${matchId}`}
    >
      <div className="w-full flex flex-col gap-4">
        <p className="text-neutral-500 text-xs flex items-center gap-2">
          {status === "FINISHED" || matchId === "673a106c1b576d2329fee225" ? (
            "Encerrado"
          ) : (
            <>
              <span className="h-1 w-1 rounded-full bg-lime-500 animate-ping" />
              Ao vivo
            </>
          )}
        </p>
        <div className="w-full flex flex-row items-center justify-start gap-1.5">
          <img
            className="h-8 w-8 object-contain p-0.5"
            src={`/img/crests/${league}/${homeTeam}.png`}
            alt={`escudo do time da casa, ${homeTeam}`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/img/crest_fallback.png";
            }}
          />
          <p className="text-sm text-neutral-100">{homeTeam}</p>
          <p
            className={twMerge(
              "text-base ml-auto flex items-center gap-2",
              homeScore > awayScore ? "text-neutral-100" : "text-neutral-400"
            )}
          >
            {homeScore > awayScore && matchId !== "673a106c1b576d2329fee225" ? (
              <span
                className={twMerge(
                  "h-1 w-1 rounded-full",
                  status === "FINISHED" ? "bg-lime-500" : ""
                )}
              />
            ) : null}
            {homeScore}
          </p>
        </div>
        <div className="w-full flex flex-row items-center justify-start gap-1">
          <img
            className="h-8 w-8 object-contain p-0.5"
            src={`/img/crests/${league}/${awayTeam}.png`}
            alt={`escudo do time da casa, ${awayTeam}`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/img/crest_fallback.png";
            }}
          />
          <p className="text-sm text-neutral-100">{awayTeam}</p>
          <p
            className={twMerge(
              "text-base ml-auto flex items-center gap-2",
              awayScore > homeScore ? "text-neutral-100" : "text-neutral-400"
            )}
          >
            {awayScore > homeScore && matchId !== "673a106c1b576d2329fee225" ? (
              <span
                className={twMerge(
                  "h-1 w-1 rounded-full",
                  status === "FINISHED" ? "bg-lime-500" : ""
                )}
              />
            ) : null}
            {awayScore}
          </p>
        </div>
      </div>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Stars color="lime" number={avgRating} size="xs" />
          <p className="text-xs text-neutral-100 font-semibold">
            {avgRating}/5
          </p>
        </div>
        <p className="text-neutral-500 text-xs">{ratingsNum} avaliações</p>
      </div>
    </Link>
  );
}
