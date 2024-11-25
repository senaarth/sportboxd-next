import type { Metadata, ResolvingMetadata } from "next";
import axios from "axios";

import { getMatchById } from "@/api";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const matchId = (await params).id;
  // const ratingId = (await params).rating_id;

  const match = await getMatchById(matchId);
  const previousImages = (await parent).openGraph?.images || [];
  const previewImgUrl = await axios
    .get(
      `https://sportboxd-next.vercel.app/api/get-preview?home_team=${match.homeTeam}&away_team=${match.awayTeam}&league=${match.league}&match_id=${match.matchId}`
    )
    .then(({ data }) => {
      return data.url;
    })
    .catch(() => {
      return null;
    });

  return {
    title: `${match.homeTeam} e ${match.awayTeam} | Sportboxd`,
    openGraph: {
      title: `Acompanhe ${match.homeTeam} e ${match.awayTeam} no Sportboxd`,
      description: `Explore, avalie e compartilhe sua opinião sobre ${match.homeTeam} e ${match.awayTeam}. Veja as resenhas da galera e acompanhe estatísticas da partida! É rápido, fácil e grátis.`,
      images: previewImgUrl
        ? [previewImgUrl, ...previousImages]
        : ["/img/webpreview.png", ...previousImages],
    },
  };
}

export default function MatchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
