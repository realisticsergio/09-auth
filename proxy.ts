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

        const setCookies: string[] = res.headers.getSetCookie();

        if (setCookies && setCookies.length > 0) {
          setCookies.forEach((cookieString: string) => {
            // Парсимо рядок куки
            const parts: string[] = cookieString.split(';');
            const nameValue = parts[0];

            if (nameValue) {
              const equalIndex = nameValue.indexOf('=');

              if (equalIndex !== -1) {
                const name = nameValue.substring(0, equalIndex).trim();
                const value = nameValue.substring(equalIndex + 1).trim();

                // Оголошуємо типізований об'єкт для опцій куки
                const options: Record<string, string | number | boolean> = {};

                parts.slice(1).forEach((part: string) => {
                  const pair = part.split('=');
                  const optName = pair[0]?.trim().toLowerCase();
                  const optVal = pair[1]?.trim();

                  if (optName === 'path') options.path = optVal;
                  if (optName === 'max-age' && optVal) options.maxAge = parseInt(optVal, 10);
                  if (optName === 'domain') options.domain = optVal;
                  if (optName === 'httponly') options.httpOnly = true;
                  if (optName === 'secure') options.secure = true;
                  if (optName === 'samesite') options.sameSite = optVal;
                });

                // Встановлюємо куку через офіційне API мідлвари
                response.cookies.set(name, value, options);
              }
            }
          });
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
