import { NextRequest, NextResponse } from "next/server";
import puppeteerCore from "puppeteer-core";
import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium";

import { alreadyCreatedPreview, uploadToS3 } from "@/utils/aws";

export const dynamic = "force-dynamic";

async function getBrowser() {
  if (process.env.VERCEL_ENV === "production") {
    const executablePath = await chromium.executablePath();

    const browser = await puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless !== "shell",
    });
    return browser;
  } else {
    const browser = await puppeteer.launch();
    return browser;
  }
}

const getHTMLTemplate = (
  homeTeam: string | null,
  awayTeam: string | null,
  league: string | null,
  ratingTitle: string | null,
  ratingAuthor: string | null,
  ratingComment: string | null,
  homeScore: string | null,
  awayScore: string | null
) => {
  if (ratingTitle && ratingAuthor && ratingComment) {
    return `
      <html>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="w-[768px] h-[768px] flex items-center justify-center bg-cover bg-[url(https://sportboxd.com/img/preview_bg.svg)]">
          <div class="w-full max-w-[80%] rounded-lg border border-neutral-700 bg-neutral-950 p-6 gap-4 flex flex-col">
            <div class="flex items-start justify-between">
                <div class="flex flex-col gap-3">
                  <p class="text-base leading-[0.875rem] text-neutral-200">${ratingAuthor}</p>
                  <p class="text-sm leading-[0.875rem] text-neutral-200 mb-1">${ratingTitle}</p>
                </div>
                <div class="flex items-center gap-1">
                  <img class="h-8 w-8 object-contain" src="https://sportboxd.com/img/${league}/${homeTeam}.png">
                  <p class="text-sm text-neutral-200">${homeScore} - ${awayScore}</p>
                  <img class="h-8 w-8 object-contain" src="https://sportboxd.com/img/${league}/${awayTeam}.png">
                </div>
            </div>
            <p class="text-lg text-neutral-200 font-light line-clamp-2">${ratingComment}</p>
          </div>
        </body>
      </html>
    `;
  }

  return `
    <html>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="w-[768px] h-[768px] flex items-center justify-center bg-cover bg-[url(https://sportboxd.com/img/preview_bg.svg)]">
        <div class="w-[768px] h-[768px] flex items-center justify-center gap-[68px]">
          <img class="w-[182px] h-[182px] object-contain" src="https://sportboxd.com/img/crests/${homeTeam}.png" />
          <p class="text-neutral-200 font-semibold text-[84px]">X</p>
          <img class="w-[182px] h-[182px] object-contain" src="https://sportboxd.com/img/crests/${awayTeam}.png" />
        </div>
      </body>
    </html>
  `;
};

const createPreview = async (
  imageKey: string,
  homeTeam: string | null,
  awayTeam: string | null,
  league: string | null,
  ratingTitle: string | null,
  ratingAuthor: string | null,
  ratingComment: string | null,
  homeScore: string | null,
  awayScore: string | null
) => {
  try {
    const htmlTemplate = getHTMLTemplate(
      homeTeam,
      awayTeam,
      league,
      ratingTitle,
      ratingAuthor,
      ratingComment,
      homeScore,
      awayScore
    );

    const browser = await getBrowser();
    const page = await browser.newPage();

    const viewport = { width: 768, height: 768 };
    await page.setViewport(viewport);
    await page.setContent(htmlTemplate, {
      waitUntil: "networkidle0",
    });

    const screenshotBuffer = await page.screenshot({ type: "png" });
    await browser.close();

    await uploadToS3(screenshotBuffer, imageKey);
  } catch (err) {
    console.error("Error creating preview:", err);
    throw err;
  }
};

export async function GET(request: NextRequest) {
  const matchId = request.nextUrl.searchParams.get("match_id");
  const homeTeam = request.nextUrl.searchParams.get("home_team");
  const awayTeam = request.nextUrl.searchParams.get("away_team");
  const league = request.nextUrl.searchParams.get("league");
  const ratingId = request.nextUrl.searchParams.get("rating_id");
  const ratingTitle = request.nextUrl.searchParams.get("rating_title");
  const ratingAuthor = request.nextUrl.searchParams.get("rating_author");
  const ratingComment = request.nextUrl.searchParams.get("rating_comment");
  const awayScore = request.nextUrl.searchParams.get("away_score");
  const homeScore = request.nextUrl.searchParams.get("home_score");

  if (!matchId || !homeTeam || !awayTeam) {
    return new NextResponse(
      JSON.stringify({
        name: "Please provide the matchId and two teams to create the match preview",
      }),
      { status: 400 }
    );
  }

  try {
    const previewImageKey = ratingId
      ? `preview_${matchId}_rating_${ratingId}.png`
      : `preview_${matchId}.png`;
    const createdPreview = await alreadyCreatedPreview(previewImageKey);

    if (!createdPreview) {
      await createPreview(
        previewImageKey,
        homeTeam,
        awayTeam,
        league,
        ratingTitle,
        ratingAuthor,
        ratingComment,
        homeScore,
        awayScore
      );
    }

    return new NextResponse(
      JSON.stringify({
        url: `https://yeon.s3.us-east-1.amazonaws.com/${previewImageKey}`,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(JSON.stringify({ error, url: null }), {
      status: 500,
    });
  }
}
