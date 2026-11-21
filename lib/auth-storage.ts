import type { SupportedStorage } from '@supabase/supabase-js';
import {
  combineChunks, createChunks, isChunkLike, parseCookieHeader,
  serializeCookieHeader, stringFromBase64URL, stringToBase64URL,
} from '@supabase/ssr';

// Keep the existing implicit-link and password flows, using the same cookie
// encoding as createServerClient so the server can verify each session.
export function createCookieSessionStorage(legacy: SupportedStorage): SupportedStorage {
  const cookies = () => new Map(parseCookieHeader(document.cookie).map(({ name, value }) => [name, value]));
  const write = (key: string, value: string | null) => {
    const chunks = value === null ? [] : createChunks(key, `base64-${stringToBase64URL(value)}`);
    const options = { path: '/', sameSite: 'lax' as const, secure: location.protocol === 'https:' };
    for (const name of cookies().keys()) {
      if (isChunkLike(name, key) && !chunks.some((chunk) => chunk.name === name)) {
        document.cookie = serializeCookieHeader(name, '', { ...options, maxAge: 0 });
      }
    }
    for (const chunk of chunks) {
      document.cookie = serializeCookieHeader(chunk.name, chunk.value, { ...options, maxAge: 400 * 24 * 60 * 60 });
    }
  };
  return {
    async getItem(key) {
      const current = cookies();
      const value = await combineChunks(key, (name) => current.get(name));
      if (value) return value.startsWith('base64-') ? stringFromBase64URL(value.slice(7)) : value;
      const previous = await legacy.getItem(key);
      if (previous) {
        write(key, previous);
        await legacy.removeItem(key);
      }
      return previous;
    },
    async setItem(key, value) {
      write(key, value);
      await legacy.removeItem(key);
    },
    async removeItem(key) {
      write(key, null);
      await legacy.removeItem(key);
    },
  };
}
