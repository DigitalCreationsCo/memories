import createMiddleware from 'next-intl/middleware';
import { AllLocales, App } from './lib/App';
import { auth } from "@/auth"
import { NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
    locales: AllLocales,
    localePrefix: App.localePrefix,
    defaultLocale: App.defaultLocale,
});

const publicPages = [
    '/', 
    '/auth/signin', 
    '/auth/signup'
];

// Helper function to check if the path is public
function isPublicPath(pathname: string) {
    const publicPathnameRegex = RegExp(
        `^(/(${AllLocales.join('|')}))?(${publicPages
            .flatMap((p) => (p === '/' ? ['', '/'] : p))
            .join('|')})/?$`,
        'i'
    );
    return publicPathnameRegex.test(pathname);
}

// Compose the middlewares
export default async function middleware(request: any) {
    const pathname = request.nextUrl.pathname;

    // Special handling for API routes
    // if (pathname.startsWith('/api')) {
    //     // Check for API credential header
    //     // console.debug("request", request);
    //     const apiKey = request.headers.get('x-api-key');
    //     console.debug("apiKey", apiKey);
    //     // console.debug('headers', request.headers);
    //     // Verify the API key matches your expected value
    //     // Replace 'your-secret-api-key' with your actual secret key
        
    //     // if (!apiKey || apiKey !== process.env.API_KEY) {
    //     //     return new NextResponse(
    //     //         JSON.stringify({ error: 'Unauthorized' }),
    //     //         {
    //     //             status: 401,
    //     //             headers: { 'Content-Type': 'application/json' }
    //     //         }
    //     //     );
    //     // }
        
    //     return NextResponse.next();
    // }

    // Handle public pages with just intl middleware
    if (isPublicPath(pathname)) {
        return intlMiddleware(request);
    }

    // For protected pages, first run auth middleware
    const authResult = await auth(request) as any;

    // If auth failed and user is not on signin page, redirect to signin
    // if (!authResult?.auth && !isPublicPath(pathname)) {
    //     const signinUrl = new URL('/auth/signin', request.url);
    //     // Preserve the original URL as next-auth doesn't do this automatically
    //     signinUrl.searchParams.set('callbackUrl', request.url);
    //     return NextResponse.redirect(signinUrl);
    // }

    // After auth passes, apply intl middleware
    return intlMiddleware(request);
}

export const config = {
    // matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],

};