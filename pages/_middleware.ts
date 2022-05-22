import { NextRequest, NextResponse } from 'next/server';
import { Buffer } from 'buffer';
import { basicAuthConfig } from '../config/config';

export function middleware(req: NextRequest) {
  const { enabled, user, pass } = basicAuthConfig;

  if (!enabled) {
    return NextResponse.next();
  }

  // basic 認証
  const basicAuth = req.headers.get('authorization');
  if (basicAuth) {
    const auth = basicAuth.split(' ')[1];
    const [userInput, passInput] = Buffer.from(auth, 'base64').toString().split(':');

    if (userInput === user && passInput === pass) {
      return NextResponse.next();
    }
  }

  return new Response('Auth required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}
