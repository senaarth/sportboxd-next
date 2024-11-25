import type { Metadata, ResolvingMetadata } from "next";

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

  return {
    title: `${match.homeTeam} e ${match.awayTeam} | Sportboxd`,
    openGraph: {
      title: `Explore, avalie e compartilhe sua opinião sobre a partida entre ${match.homeTeam} e ${match.awayTeam}.`,
      images: [
        `/api/get-preview?home_team=${match.homeTeam}&away_team=${match.awayTeam}` +
          "",
        // `${ratingId && ratingId !== "undefined" ? `&rating_id=${ratingId}` : ""}`,
        ...previousImages,
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
