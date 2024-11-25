import { twMerge } from "tailwind-merge";

interface LeagueChipProps {
  isSelected: boolean;
  label: string;
  onClick: () => void;
  sport: "soccer";
}

export function LeagueChip({
  isSelected,
  label,
  onClick,
  sport,
}: LeagueChipProps) {
  return (
    <button
      className={twMerge(
        "flex flex-row items-center px-2 py-1 gap-1 rounded-full transition-all",
        isSelected
          ? "bg-neutral-900 border border-neutral-800 opacity-1"
          : "bg-transparent border border-transparent opacity-50 cursor-pointer hover:opacity-90 hover:bg-neutral-900"
      )}
      onClick={onClick}
      type="button"
    >
      <img
        alt={`Ícone representando o esporte da liga, ${sport}`}
        className="w-5 h-5 p-[2px]"
        src={`icons/sports_${sport}.svg`}
      />
      <p className="text-neutral-100 text-sm">{label}</p>
    </button>
  );
}
