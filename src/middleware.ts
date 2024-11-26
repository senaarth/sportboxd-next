import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  request.headers.set("x-pathname", pathname);
  request.headers.set("x-search-params", searchParams.toString());

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  return response;
}

export const config = {
  matcher: ["/matches/:id*"],
};
