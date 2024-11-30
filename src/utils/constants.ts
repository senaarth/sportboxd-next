const availableLeagues: League[] = [
  {
    code: "LIB",
    sport: "soccer",
    label: "Copa Libertadores",
    logo: "/img/leagues/liberta.png",
    isAvailable: true,
    isRecentlyAdded: true,
  },
  {
    code: "BSA",
    sport: "soccer",
    label: "Brasileirão - Série A",
    logo: "/img/leagues/brasileirao.png",
    isAvailable: true,
  },
  {
    code: "PL",
    sport: "soccer",
    label: "Premier League",
    logo: "/img/leagues/premier.png",
    isAvailable: true,
  },
  {
    code: "LL",
    sport: "soccer",
    label: "La Liga",
    logo: "/img/leagues/laliga.png",
    isAvailable: false,
  },
  {
    code: "BD",
    sport: "soccer",
    label: "Bundesliga",
    logo: "/img/leagues/bundesliga.png",
    isAvailable: false,
  },
];

const matchStatusLabelMap: Record<string, string> = {
  FINISHED: "Encerrado",
  IN_PLAY: "Ao vivo",
  PRE_GAME: "Pré-jogo",
};

export { availableLeagues, matchStatusLabelMap };
