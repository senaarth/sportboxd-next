import { CustomFlowbiteTheme, Modal } from "flowbite-react";
import { useMemo } from "react";
import { Stars } from "@/components/stars";

const customTheme: CustomFlowbiteTheme["modal"] = {
  root: {
    base: "fixed inset-x-0 top-0 z-50 h-screen overflow-y-auto overflow-x-hidden md:inset-0 md:h-full",
    show: {
      on: "flex bg-neutral-950 bg-opacity-80",
      off: "hidden",
    },
    sizes: {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      "3xl": "max-w-3xl",
      "4xl": "max-w-4xl",
      "5xl": "max-w-5xl",
      "6xl": "max-w-6xl",
      "7xl": "max-w-7xl",
    },
    positions: {
      "top-left": "items-start justify-start",
      "top-center": "items-start justify-center",
      "top-right": "items-start justify-end",
      "center-left": "items-center justify-start",
      center: "items-center justify-center",
      "center-right": "items-center justify-end",
      "bottom-right": "items-end justify-end",
      "bottom-center": "items-end justify-center",
      "bottom-left": "items-end justify-start",
    },
  },
  content: {
    base: "relative h-full w-full p-4 md:h-auto",
    inner: "relative flex flex-col rounded-lg bg-neutral-900 shadow",
  },
  body: {
    base: "flex-1 overflow-auto p-6",
    popup: "pt-0",
  },
  header: {
    base: "flex items-start justify-between rounded-t border-b p-5 border-gray-600",
    popup: "border-b-0 p-2",
    title: "text-xl font-medium text-gray-900 text-neutral-200",
    close: {
      base: "ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-neutral-600 hover:text-neutral-200",
      icon: "h-5 w-5",
    },
  },
  footer: {
    base: "flex items-center space-x-2 border-gray-600 p-6 pt-0",
    popup: "border-t",
  },
};

interface ShareRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  rating: Rating;
  match: Match;
}

export function ShareRatingModal({
  isOpen,
  onClose,
  rating,
  match,
}: ShareRatingModalProps) {
  const shareUrl = useMemo(
    () =>
      `sportboxd.com/partidas/${match.matchId}?rating_id=${rating.ratingId}`,
    [rating, match]
  );

  return (
    <Modal
      show={isOpen}
      size="lg"
      onClose={() => onClose()}
      popup
      theme={customTheme}
    >
      <Modal.Header>
        <h3 className="p-1.5 pl-4 text-base text-neutral-200">
          Compartilhar avaliação
        </h3>
      </Modal.Header>
      <Modal.Body className="">
        <div className="w-full flex flex-col items-center justify-start gap-4">
          <div className="w-full rounded-lg border border-neutral-700 bg-neutral-950 p-4 gap-4 flex flex-col">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-0.5">
                <p className="text-[0.625rem] text-neutral-200 leading-[0.75rem]">
                  {rating.author}
                </p>
                <p className="text-sm text-neutral-200 leading-[0.875rem] font-semibold mb-1">
                  {rating.title}
                </p>
                <Stars color="lime" size="xs" number={rating.rating} />
              </div>
              <div className="flex items-center gap-1">
                <img
                  className="h-6 w-6 object-contain"
                  src={`/crests/${match.league}/${match.homeTeam}.png`}
                  alt={`escudo do time da casa, ${match.homeTeam}`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/crest_fallback.png";
                  }}
                />
                <p className="text-[0.625rem] text-neutral-200">
                  {match.homeScore} - {match.awayScore}
                </p>
                <img
                  className="h-6 w-6 object-contain"
                  src={`/crests/${match.league}/${match.awayTeam}.png`}
                  alt={`escudo do time da casa, ${match.awayTeam}`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/crest_fallback.png";
                  }}
                />
              </div>
            </div>
            <p className="text-base text-neutral-200 font-light">
              {rating.comment}
            </p>
          </div>
          <div className="w-full flex flex-col gap-2 items-start">
            <p className="text-sm font-semibold text-neutral-200">
              Compartilhar
            </p>
            <div className="w-full rounded-lg bg-neutral-800 border border-neutral-700 p-3.5 flex items-center justify-between gap-1">
              <a
                href={`https://twitter.com/intent/tweet?text=Veja%20esta%20review%20de%20${match.homeTeam}%20e%20${match.awayTeam}&url=https://${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="h-6 w-6"
                  src="/icons/twitter.svg"
                  alt="ícone twitter"
                />
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=https://${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="h-6 w-6"
                  src="/icons/facebook.svg"
                  alt="ícone facebook"
                />
              </a>
              <a
                href={`https://t.me/share/url?text=Veja%20esta%20review%20de%20${match.homeTeam}%20e%20${match.awayTeam}&url=https://${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="h-6 w-6"
                  src="/icons/telegram.svg"
                  alt="ícone telegram"
                />
              </a>
              <a
                href={`https://wa.me/?text=Veja%20esta%20review%20de%20${match.homeTeam}%20e%20${match.awayTeam}%20https://${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="h-6 w-6"
                  src="/icons/whatsapp.svg"
                  alt="ícone whatsapp"
                />
              </a>
            </div>
          </div>
          <div className="w-full flex flex-col gap-2 items-start">
            <p className="text-sm font-semibold text-neutral-200">
              Link da avaliação
            </p>
            <button
              className="w-full rounded-lg bg-neutral-800 border border-neutral-700 p-3.5 flex flex-col items-start gap-1"
              onClick={() => {
                navigator.share({
                  url: `https://${shareUrl}`,
                  text: `Veja esta review de ${match.homeTeam} e ${match.awayTeam}`,
                });
              }}
              type="button"
            >
              <p className="text-[0.625rem] text-neutral-600">
                Copie o link abaixo
              </p>
              <div
                className="w-full grid gap-2 items-center"
                style={{ gridTemplateColumns: "auto 1.25rem" }}
              >
                <p className="text-xs text-blue-500 text-start max-w-full truncate">
                  {shareUrl}
                </p>
                <img
                  className="w-5 h-5"
                  src="/icons/copy.svg"
                  alt="ícone de copiar"
                />
              </div>
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
