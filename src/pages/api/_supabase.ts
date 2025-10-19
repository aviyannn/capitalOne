import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerClient } from '@supabase/ssr';
import { serialize } from 'cookie';

function appendSetCookie(res: NextApiResponse, cookieStr: string) {
  const prev = res.getHeader('Set-Cookie');
  if (!prev) res.setHeader('Set-Cookie', cookieStr);
  else if (Array.isArray(prev)) res.setHeader('Set-Cookie', [...prev, cookieStr]);
  else res.setHeader('Set-Cookie', [prev as string, cookieStr]);
}

export function createSupabaseApiClient(req: NextApiRequest, res: NextApiResponse) {
  const isProd = process.env.NODE_ENV === 'production';

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => req.cookies[name],
        set: (name: string, value: string, options: any) => {
          const cookieStr = serialize(name, value, {
            ...options, httpOnly: true, sameSite: 'lax', path: '/', secure: isProd,
          });
          appendSetCookie(res, cookieStr);
        },
        remove: (name: string, options: any) => {
          const cookieStr = serialize(name, '', {
            ...options, httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0, secure: isProd,
          });
          appendSetCookie(res, cookieStr);
        },
      },
    }
  );
}
