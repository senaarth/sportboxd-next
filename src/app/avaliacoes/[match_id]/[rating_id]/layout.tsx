import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ match_id: string; rating_id: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const matchId = (await params).match_id;
  const ratingId = (await params).rating_id;
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `Avaliação | Sportboxd`,
    openGraph: {
      title: `Veja esta resenha no Sportboxd`,
      description: `Explore, avalie e compartilhe sua opinião. Veja as resenhas da galera e acompanhe estatísticas da partida! É rápido, fácil e grátis.`,
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
