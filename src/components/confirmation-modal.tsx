import { CustomFlowbiteTheme, Modal } from "flowbite-react";
import { useMutation } from "react-query";
import { Loading } from "@/components/loading";

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

interface ConfirmationModalProps {
  confirmationMessage: string | null;
  onClose: () => void;
  onSubmit: () => Promise<void>;
}

export function ConfirmationModal({
  confirmationMessage,
  onClose,
  onSubmit,
}: ConfirmationModalProps) {
  const mutation = useMutation({
    mutationFn: async () => await onSubmit(),
  });

  return (
    <Modal
      show={!!confirmationMessage}
      size="lg"
      onClose={() => onClose()}
      popup
      theme={customTheme}
    >
      <Modal.Header>
        <h3 className="p-1.5 pl-4 text-base text-neutral-200">
          Confirme sua conta
        </h3>
        <p className="w-full pl-8 mt-4 text-xs text-neutral-200 text-center">
          {confirmationMessage}
        </p>
      </Modal.Header>
      <Modal.Body className="">
        <div className="w-full flex flex-col items-center justify-start gap-4"></div>
      </Modal.Body>
      <Modal.Footer className="gap-6 grid grid-cols-2 items-center">
        <button
          className="w-full rounded-md hover:brightness-75 transition-all text-sm p-2 text-neutral-200"
          type="button"
        >
          Cancelar
        </button>
        <button
          className="w-full rounded-md hover:brightness-75 transition-all bg-lime-500 text-sm p-2 text-neutral-900"
          type="button"
          onClick={() => mutation.mutate()}
        >
          {mutation.isLoading ? (
            <Loading color="neutral-dark" size="xs" />
          ) : (
            "Enviar e-mail"
          )}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
