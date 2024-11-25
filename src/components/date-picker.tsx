import { useEffect, useState } from "react";
import { Datepicker as FlowbiteDatepicker } from "flowbite-react";
import type { CustomFlowbiteTheme } from "flowbite-react";
import { formatDateLabel } from "@/utils/date";
import { twMerge } from "tailwind-merge";

const customTheme: CustomFlowbiteTheme["datepicker"] = {
  root: {
    base: "relative",
  },
  popup: {
    root: {
      base: "absolute top-10 z-50 block pt-2",
      inline: "relative top-0 z-auto",
      inner:
        "inline-block rounded-md bg-neutral-900 border border-neutral-800 p-1 shadow-lg",
    },
    header: {
      base: "",
      title: "px-2 py-3 text-center font-medium text-white",
      selectors: {
        base: "mb-2 flex justify-between",
        button: {
          base: "rounded-md bg-neutral-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-600",
          prev: "",
          next: "",
          view: "",
        },
      },
    },
    view: {
      base: "p-1",
    },
    footer: {
      base: "mt-2 flex space-x-2",
      button: {
        base: "w-full rounded-md px-5 py-2 text-center text-sm font-medium focus:ring-2 focus:ring-lime-400",
        today: "bg-lime-500 text-neutral-950 hover:ring-2 hover:ring-lime-500",
        clear:
          "border border-neutral-600 bg-neutral-800 text-white hover:ring-2 hover:ring-neutral-600",
      },
    },
  },
  views: {
    days: {
      header: {
        base: "mb-1 grid grid-cols-7",
        title: "h-6 text-center text-sm font-medium leading-6 text-neutral-600",
      },
      items: {
        base: "grid grid-cols-7 gap-1",
        item: {
          base: "aspect-square bg-neutral-700 block flex-1 cursor-pointer rounded-md border-0 text-center text-sm font-medium leading-9 text-white hover:bg-lime-700 hover:ring-2 hover:ring-lime-400",
          selected: "bg-lime-400 text-neutral-900 hover:bg-lime-400",
          disabled:
            "text-neutral-600 bg-neutral-800 hover:ring-0 hover:bg-neutral-900",
        },
      },
    },
    months: {
      items: {
        base: "w-64 grid grid-cols-4 gap-1",
        item: {
          base: "aspect-square block flex-1 cursor-pointer rounded-md border-0 text-center text-sm font-medium leading-9 text-white hover:bg-lime-700 hover:ring-2 hover:ring-lime-400",
          selected: "bg-lime-400 text-neutral-900 hover:bg-lime-400",
          disabled:
            "text-neutral-600 bg-neutral-800 hover:ring-0 hover:bg-neutral-900",
        },
      },
    },
    years: {
      items: {
        base: "w-64 grid grid-cols-4 gap-1",
        item: {
          base: "aspect-square block flex-1 cursor-pointer rounded-md border-0 text-center text-sm font-medium leading-9 text-white hover:bg-lime-700 hover:ring-2 hover:ring-lime-400",
          selected: "bg-lime-400 text-neutral-900 hover:bg-lime-400",
          disabled:
            "text-neutral-600 bg-neutral-800 hover:ring-0 hover:bg-neutral-900",
        },
      },
    },
    decades: {
      items: {
        base: "w-64 grid grid-cols-4 gap-1",
        item: {
          base: "aspect-square block flex-1 cursor-pointer rounded-md border-0 text-center text-sm font-medium leading-9 text-white hover:bg-lime-700 hover:ring-2 hover:ring-lime-400",
          selected: "bg-lime-400 text-neutral-900 hover:bg-lime-400",
          disabled:
            "text-neutral-600 bg-neutral-800 hover:ring-0 hover:bg-neutral-900",
        },
      },
    },
  },
};

interface DatePickerProps {
  defaultValue?: Date;
  onDatePick: (date?: Date) => void;
}

export function DatePicker({ defaultValue, onDatePick }: DatePickerProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedDate, selectDate] = useState<Date | undefined>(defaultValue);

  useEffect(() => selectDate(defaultValue), [defaultValue]);

  return (
    <div className="w-full flex flex-col">
      <div>
        <button
          className="w-full h-10 flex items-center justify-center gap-2 border border-neutral-800 bg-neutral-900 rounded-md hover:bg-neutral-800 hover:border-neutral-700"
          onClick={() => setIsExpanded(!isExpanded)}
          type="button"
        >
          <p className="text-neutral-200 text-sm">
            {selectedDate ? formatDateLabel(selectedDate) : "Selecionar Data"}
          </p>
          <img
            alt="Ícone de seta indicando que o botão expande a visualização"
            className={twMerge(
              "transition-all",
              isExpanded ? "" : "rotate-180"
            )}
            src="/img/icons/chevron_up.svg"
          />
        </button>
        <div
          className={twMerge(
            "w-full flex items-center justify-center transition-all",
            isExpanded ? "visible" : "hidden"
          )}
        >
          <FlowbiteDatepicker
            inline
            language="pt-BR"
            labelClearButton="Limpar"
            labelTodayButton="Hoje"
            maxDate={new Date()}
            onChange={(date) => {
              selectDate(date || undefined);
              onDatePick(date || undefined);
              if (!date) setIsExpanded(false);
            }}
            theme={customTheme}
            value={selectedDate}
          />
        </div>
      </div>
    </div>
  );
}
