import { CustomFlowbiteTheme, Modal } from "flowbite-react";
import { useEffect } from "react";
import { useMutation } from "react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Loading } from "@/components/loading";
import { Stars } from "@/components/stars";
import { formatDateLabel } from "@/utils/date";
import { Input } from "@/components/input";
import { twMerge } from "tailwind-merge";
import { postRating } from "@/api";
import { useAuth } from "@/contexts/auth";

const ratingFormSchema = z.object({
  rating: z.number(),
  title: z.string().min(1, "Campo obrigatório"),
  comment: z.string(),
});

type RatingFormSchema = z.infer<typeof ratingFormSchema>;

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
      base: "ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-neutral-600 hover:text-neutral-200 hidden",
      icon: "h-5 w-5",
    },
  },
  footer: {
    base: "flex items-center space-x-2 rounded-b border-gray-600 p-6",
    popup: "border-t",
  },
};

const CrestComponent = ({ league, team }: { league: string; team: string }) => {
  return (
    <div className="w-full flex flex-col items-center px-3 gap-2">
      <img
        className="h-11 w-11 object-contain p-0.5"
        src={`/img/crests/${team}.png`}
        alt={`escudo do time da casa, ${team}`}
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/img/crest_fallback.png";
        }}
      />
      <p className="text-base text-neutral-200">{team}</p>
    </div>
  );
};

interface RatingModalProps {
  defaultValue: Partial<Rating> | undefined;
  isOpen: boolean;
  match: Match;
  onClose: () => void;
  onSubmitError: () => void;
  onSubmitSuccess: () => void;
}

export function RatingModal({
  defaultValue,
  isOpen,
  match,
  onClose,
  onSubmitError,
  onSubmitSuccess,
}: RatingModalProps) {
  const { isAuthenticated, openLoginModal, openConfirmationModal, user } =
    useAuth();
  const mutation = useMutation({
    mutationFn: async (data: {
      rating: number;
      title: string;
      comment: string;
    }) => {
      if (!user?.email) {
        openLoginModal();
        onClose();
        return;
      }

      await postRating({
        ...data,
        match_id: match.matchId,
      });
    },
    onError: onSubmitError,
    onSuccess: onSubmitSuccess,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<RatingFormSchema>({
    resolver: zodResolver(ratingFormSchema),
    defaultValues: {
      title: defaultValue?.title || "",
      comment: defaultValue?.comment || "",
      rating: defaultValue?.rating,
    },
  });

  useEffect(() => reset(), [isOpen, reset]);

  useEffect(() => {
    if (!isOpen) return;
    if (!isAuthenticated) {
      onClose();
      openLoginModal();
      return;
    }
    if (!user?.emailVerified) {
      onClose();
      openConfirmationModal(
        `${user?.displayName}, antes de avaliar uma partida, precisamos que confirme sua conta no e-mail ${user?.email}.`
      );
    }
  }, [isOpen]);

  return (
    <Modal
      show={isOpen && isAuthenticated && user?.emailVerified}
      size="lg"
      onClose={() => onClose()}
      popup
      theme={customTheme}
    >
      <Modal.Header />
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
        <Modal.Body className="">
          <div className="w-full flex flex-col items-center justify-start">
            <div className="w-full p-4 grid grid-cols-3">
              <CrestComponent league={match.league} team={match.homeTeam} />
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm text-neutral-500">
                  {formatDateLabel(match.date)}
                </p>
                <p className="text-3xl text-neutral-200 font-semibold">
                  {match?.homeScore} - {match?.awayScore}
                </p>
                <p className="text-xs text-neutral-200">Encerrado</p>
              </div>
              <CrestComponent league={match.league} team={match.awayTeam} />
            </div>
            <span className="w-full h-[1px] bg-neutral-800 my-4" />
            <Stars
              color="lime"
              number={watch("rating") || defaultValue?.rating || 0}
              onStarClick={(number) => setValue("rating", number)}
              size="lg"
            />
            <p
              className={twMerge(
                "text-xs mt-2",
                errors.rating ? "text-orange-600" : "text-neutral-700"
              )}
            >
              Toque em uma estrela para avaliar
            </p>
            <div className="w-full flex flex-col items-center justify-start gap-4 mt-4">
              <Input
                error={errors.title?.message}
                id="title"
                label="Título"
                maxLength={35}
                placeholder="Ex: Épico, vergonha, fantástico..."
                {...register("title")}
              />
              <Input
                className="max-h-[160px] min-h-[80px]"
                error={errors.comment?.message}
                id="comment"
                isTextArea
                label="Comentário (Opcional)"
                placeholder="Adicione um comentário"
                {...register("comment")}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="gap-2">
          <button
            className="ml-auto rounded-md transition-all bg-neutral-900 hover:bg-neutral-800 text-sm p-3 text-neutral-200"
            onClick={() => onClose()}
            type="button"
          >
            Cancelar
          </button>
          <button
            className="ml-auto rounded-md hover:brightness-75 transition-all bg-lime-500 text-sm p-3 text-neutral-900"
            type="submit"
          >
            {mutation.isLoading ? (
              <Loading color="neutral-dark" size="xs" />
            ) : (
              "Enviar"
            )}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
