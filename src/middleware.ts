import { defineMiddleware } from 'astro:middleware';
import { jwtVerify, createRemoteJWKSet, type JWTPayload } from 'jose';

const OUTSETA_SUBDOMAIN = 'levy';
const JWKS = createRemoteJWKSet(
  new URL(`https://${OUTSETA_SUBDOMAIN}.outseta.com/.well-known/jwks`),
);

const PROTECTED_PREFIXES = ['/dashboard'];

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/'),
  );
}

async function verifyOutsetaToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWKS);
    return payload;
  } catch {
    return null;
  }
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  if (!isProtected(pathname)) return next();

  const token = context.cookies.get('outseta_token')?.value;
  if (!token) {
    return context.redirect(`/login?redirect=${encodeURIComponent(pathname)}`, 302);
  }

  const payload = await verifyOutsetaToken(token);
  if (!payload) {
    return context.redirect(`/login?redirect=${encodeURIComponent(pathname)}`, 302);
  }

  context.locals.outsetaUser = payload;
  return next();
});
