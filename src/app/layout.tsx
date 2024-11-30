"use client";

import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth";
import { QueryClient, QueryClientProvider } from "react-query";

import "@/app/globals.css";
import Script from "next/script";

export const queryClient = new QueryClient({
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
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2303783235779047"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* <!-- Hotjar Tracking Code for Site 5218288 (nome ausente) --> */}
        <Script
          id="hotjar-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:5218288,hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `,
          }}
        />
        <meta name="google-adsense-account" content="ca-pub-2303783235779047" />
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
