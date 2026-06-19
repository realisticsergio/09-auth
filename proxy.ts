import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

async function refreshSession(refreshToken: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  return fetch(`${baseUrl}/api/auth/session`, {
    method: 'GET',
    headers: {
      Cookie: `refreshToken=${refreshToken}`,
    },
  });
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookiesStore = await cookies();

  const accessToken = cookiesStore.get('accessToken')?.value;
  const refreshToken = cookiesStore.get('refreshToken')?.value;

  const isPrivate = privateRoutes.some((r) => pathname.startsWith(r));

  const isPublic = publicRoutes.some((r) => pathname.startsWith(r));

  if (isPrivate) {
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    if (accessToken) {
      return NextResponse.next();
    }

    if (!accessToken && refreshToken) {
      try {
        const res = await refreshSession(refreshToken);

        if (!res.ok) {
          const redirect = NextResponse.redirect(new URL('/sign-in', request.url));

          redirect.cookies.delete('accessToken');
          redirect.cookies.delete('refreshToken');

          return redirect;
        }
        const response = NextResponse.redirect(request.url);
        //const response = NextResponse.next();

        const setCookie = res.headers.get('set-cookie');

        if (setCookie) {
          response.headers.set('set-cookie', setCookie);
        }

        return response;
      } catch {
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
    }
  }

  if (isPublic && accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
