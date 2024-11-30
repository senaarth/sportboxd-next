import type { Metadata, ResolvingMetadata } from "next";
import { headers } from "next/headers";

import { getMatchById } from "@/api";

type Props = {
  params: Promise<{ id: string; rating_id: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const matchId = (await params).id;
  const ratingId = (await params).rating_id;
  const match = await getMatchById(matchId);
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `Avaliação de ${match.homeTeam} e ${match.awayTeam} | Sportboxd`,
    openGraph: {
      title: `Veja esta resenha sobre ${match.homeTeam} e ${match.awayTeam} no Sportboxd`,
      description: `Explore, avalie e compartilhe sua opinião sobre ${match.homeTeam} e ${match.awayTeam}. Veja as resenhas da galera e acompanhe estatísticas da partida! É rápido, fácil e grátis.`,
      images: [
        ...previousImages,
        `https://yeon.s3.us-east-1.amazonaws.com/preview_${matchId}_rating_${ratingId}.png`,
      ],
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
