import { Loading } from "@/components/loading";

export function LoadingScreen() {
  return (
    <div className="w-full h-svh flex flex-col gap-2 items-center justify-center">
      <img
        alt="Logo sportboxd, imagem com nome do site escrito"
        className="h-5"
        src="/img/sportboxd.svg"
      />
      <Loading size="xs" color="lime" />
    </div>
  );
}
