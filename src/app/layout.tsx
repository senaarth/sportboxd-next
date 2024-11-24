import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Sportboxd",
  openGraph: {
    title: "Sportboxd: Avalie e Descubra os Melhores Jogos de Futebol",
    description:
      "Explore, avalie e compartilhe sua opinião sobre partidas de futebol. Dê o seu pitaco, veja as resenhas da galera e reviva os maiores momentos do esporte! É rápido, fácil e grátis.",
    images: "/img/webpreview.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <head>
        <link rel="icon" type="image/svg" href="/img/icons/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-inter flex flex-col items-star justify-start min-h-svh bg-neutral-950">
        {children}
      </body>
    </html>
  );
}
