import { CustomFlowbiteTheme, Modal } from "flowbite-react";
import { useEffect } from "react";
import { useMutation } from "react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/input";
import { Loading } from "@/components/loading";

const signUpFormSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Campo obrigatório"),
  username: z.string().min(1, "Campo obrigatório"),
  password: z.string().min(1, "Campo obrigatório"),
});

type SignUpFormSchema = z.infer<typeof signUpFormSchema>;

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
    base: "flex items-center border-gray-600 p-6 pt-0",
    popup: "border-t",
  },
};

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  openLoginModal: () => void;
  onSubmitWithGoogle: () => Promise<void>;
}

export function SignUpModal({
  isOpen,
  onClose,
  onSubmit,
  onSubmitWithGoogle,
  openLoginModal,
}: SignUpModalProps) {
  const mutation = useMutation({
    mutationFn: async (data: {
      username: string;
      email: string;
      password: string;
    }) => await onSubmit(data.username, data.email, data.password),
  });
  const {
    handleSubmit,
    reset,
    formState: { errors },
    register,
  } = useForm<SignUpFormSchema>({
    resolver: zodResolver(signUpFormSchema),
  });

  useEffect(() => reset(), [isOpen, reset]);

  return (
    <Modal
      show={isOpen}
      size="lg"
      onClose={() => onClose()}
      popup
      theme={customTheme}
    >
      <Modal.Header>
        <h3 className="p-1.5 pl-4 text-base text-neutral-200">Criar conta</h3>
      </Modal.Header>
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
        <Modal.Body className="">
          <div className="w-full flex flex-col items-center justify-start gap-4">
            <div className="w-full flex flex-col items-center justify-start gap-4">
              <Input
                error={errors.email?.message}
                id="email"
                label="Email"
                placeholder="Email"
                {...register("email")}
              />
              <Input
                error={errors.username?.message}
                id="username"
                label="Nome de usuário"
                maxLength={20}
                placeholder="Ex.: nomedeusuario"
                {...register("username")}
              />
              <Input
                error={errors.password?.message}
                id="password"
                label="Senha"
                placeholder="Senha"
                type="password"
                {...register("password")}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="gap-2 flex flex-col items-center">
          <button
            className="w-full rounded-md hover:brightness-75 transition-all bg-lime-500 text-sm p-1.5 text-neutral-900"
            type="submit"
          >
            {mutation.isLoading ? (
              <Loading color="neutral-dark" size="xs" />
            ) : (
              "Criar conta"
            )}
          </button>
          <button
            className="w-full rounded-md flex items-center justify-center gap-2 hover:bg-neutral-300 transition-all bg-neutral-200 text-sm p-1.5 text-neutral-900"
            onClick={() => onSubmitWithGoogle()}
            type="button"
          >
            <img
              className="w-4 h-4 object-contain"
              src="/img/icons/google.svg"
              alt="ícone do google"
            />
            Criar conta com Google
          </button>
          <p className="text-xs mt-2 text-neutral-200">
            Já tem uma conta?{" "}
            <button
              className="text-lime-500 ml-2"
              onClick={() => {
                onClose();
                openLoginModal();
              }}
              type="button"
            >
              Entre
            </button>
          </p>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
