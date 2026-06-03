import { NextRequest, NextResponse } from "next/server";

const localeCookieName = "NEXT_LOCALE";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const savedLocale = request.cookies.get(localeCookieName)?.value;

  if (pathname === "/fr") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    const response = NextResponse.rewrite(url);
    response.cookies.set(localeCookieName, "fr", { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  if (pathname.startsWith("/fr/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/fr/, "");
    const response = NextResponse.rewrite(url);
    response.cookies.set(localeCookieName, "fr", { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  if (savedLocale === "fr") {
    const url = request.nextUrl.clone();
    url.pathname = `/fr${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|admin|_next|.*\\..*).*)"],
};
