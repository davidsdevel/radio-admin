import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
	const { nextUrl } = req;

	const isAuthenticated = !!req.auth;

	if (!isAuthenticated) {
		if (nextUrl.pathname !== '/login') {
			nextUrl.pathname = '/login';
			
			return NextResponse.redirect(nextUrl);
		}
	} else {
		if (nextUrl.pathname === '/login') {
			nextUrl.pathname = '/';
			
			return NextResponse.redirect(nextUrl);
		}
	}

	return NextResponse.next();
});

export const config = {
	matcher: [
		'/((?!api|_next/static|_next/image|favicon.ico).*)'
	]
};