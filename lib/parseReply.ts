import type { ReplyResponse } from './types';

export function parseReply(raw: string): ReplyResponse {
  const empty: ReplyResponse = { guest_language: 'vi', guest_vi: '', reply: '', reply_language: 'vi', reply_vi: '' };
  if (!raw) return empty;

  const ok = (o: unknown): o is ReplyResponse =>
    !!o && typeof o === 'object' && typeof (o as Record<string, unknown>).reply === 'string';

  let txt = String(raw).trim().replace(/^```(json)?/i, '').replace(/```$/, '').trim();

  try {
    const o = JSON.parse(txt);
    if (ok(o)) return o;
  } catch {
    // fall through
  }

  const m = txt.match(/\{[\s\S]*\}/);
  if (m) {
    try {
      const o = JSON.parse(m[0]);
      if (ok(o)) return o;
    } catch {
      // fall through
    }
  }

  return { ...empty, reply: txt };
}
