import { NextRequest, NextResponse } from 'next/server';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  //  const sessionToken = request.cookies.get('session');
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isPrivate = privateRoutes.some((route) => pathname.startsWith(route));
  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));

  // if (isPrivate && !sessionToken) {
  //   return NextResponse.redirect(new URL('/sign-in', request.url));
  // }

  // if (isPublic && sessionToken) {
  //   return NextResponse.redirect(new URL('/profile', request.url));
  // }
  if (isPrivate) {
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    if (!accessToken && refreshToken) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

        const res = await fetch(`${baseUrl}/api/auth/session`, {
          method: 'GET',
          headers: {
            Cookie: `refreshToken=${refreshToken}`,
          },
        });

        if (!res.ok) throw new Error('Session refresh failed');

        const data = await res.json().catch(() => null);

        const response = NextResponse.redirect(request.url);

        const setCookies = res.headers.get('set-cookie');
        if (setCookies) {
          response.headers.append('set-cookie', setCookies);
        }

        return response;
      } catch (error) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
    }
  }

  if (isPublic && accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}

// export const config = {
//   matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
