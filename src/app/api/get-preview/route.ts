import { NextRequest, NextResponse } from "next/server";
import playwright from "playwright-core";
import chromium from "@sparticuz/chromium";

export async function GET(request: NextRequest) {
  const homeTeam = request.nextUrl.searchParams.get("home_team");
  const awayTeam = request.nextUrl.searchParams.get("away_team");
  const ratingId = request.nextUrl.searchParams.get("rating_id");

  if (!homeTeam || !awayTeam) {
    return new NextResponse(
      JSON.stringify({
        name: "Please provide two teams to create the match preview",
      }),
      { status: 400 }
    );
  }

  try {
    const htmlTemplate = `
      <html>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="w-[1024px] h-[1024px] flex items-center justify-center bg-[url(/img/preview_bg.svg)]">
        <div class="w-[1024px] h-[1024px] flex items-center justify-center gap-[68px]">
          <img class="w-[182px] h-[182px] object-contain" src="/img/crests/${homeTeam}.png" />
          <p class="text-neutral-200 text-[84px]">X</p>
          <img class="w-[182px] h-[182px] object-contain" src="/img/crests/${awayTeam}.png" />
        </div>
      </body>
      </html>
    `;

    const browser = await playwright.chromium.launch({
      executablePath: await chromium.executablePath(),
      headless: true,
      args: chromium.args,
    });
    const page = await browser.newPage();
    const viewport = { width: 1024, height: 1024 };

    await page.setViewportSize(viewport);
    await page.setContent(htmlTemplate, {
      waitUntil: "domcontentloaded",
      timeout: 100000000,
    });

    const screenshotBuffer = await page.screenshot({ type: "png" });
    await browser.close();

    return new NextResponse(screenshotBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `inline; filename="image.png"`,
      },
    });
  } catch (error) {
    console.log(error);
    return new NextResponse(JSON.stringify({ error }), {
      status: 500,
    });
  }
}
