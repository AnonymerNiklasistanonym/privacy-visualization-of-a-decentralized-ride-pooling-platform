// Middlewares

// Local imports
//import './middleware/middlewareLogging';
import {middleware as middlewareRouting} from './middleware/middlewareRouting';
// Type imports
import type {NextRequest} from 'next/server';

export function middleware(request: NextRequest) {
  return middlewareRouting(request);
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|img/|favicon.ico).*)',
};
