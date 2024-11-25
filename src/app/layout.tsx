"use client";

import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth";
import { QueryClient, QueryClientProvider } from "react-query";

import "@/app/globals.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 10,
      staleTime: 1000 * 60 * 2,
      refetchOnWindowFocus: true,
      retry: 2,
      refetchInterval: false,
    },
  },
});

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
        <title data-rh="true">Sportboxd</title>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2303783235779047"
          crossOrigin="anonymous"
        ></script>
        <meta
          data-rh="true"
          property="og:title"
          content="Sportboxd: Avalie e Descubra os Melhores Jogos de Futebol"
        />
        <meta
          data-rh="true"
          property="og:description"
          content="Explore, avalie e compartilhe sua opinião sobre partidas de futebol. Dê o seu pitaco, veja as resenhas da galera e reviva os maiores momentos do esporte! É rápido, fácil e grátis."
        />
        <meta
          data-rh="true"
          property="og:image"
          content="/img/webpreview.png"
        />
      </head>
      <body className="antialiased font-inter flex flex-col items-center justify-start min-h-svh bg-neutral-950">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
