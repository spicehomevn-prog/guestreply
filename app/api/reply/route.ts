import Anthropic from '@anthropic-ai/sdk';
import { buildPrompt } from '@/lib/prompt';
import { parseReply } from '@/lib/parseReply';
import type { Property, Tone } from '@/lib/types';

export async function POST(request: Request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not set');
      return Response.json({ error: 'API key not configured' }, { status: 500 });
    }

    const body = await request.json() as {
      property: Property;
      tone: Tone;
      guestMessage: string;
    };

    const { property, tone, guestMessage } = body;

    if (!property || !guestMessage) {
      return Response.json({ error: 'Missing property or guestMessage' }, { status: 400 });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const prompt = buildPrompt(property, property.context || '', tone, guestMessage);

    const resp = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = resp.content[0]?.type === 'text' ? resp.content[0].text : '';
    const data = parseReply(raw);

    return Response.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Reply API error:', message);
    return Response.json({ error: message }, { status: 500 });
  }
}
