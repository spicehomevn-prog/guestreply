import Anthropic from '@anthropic-ai/sdk';
import { buildPrompt } from '@/lib/prompt';
import { parseReply } from '@/lib/parseReply';
import type { Property, Tone } from '@/lib/types';

const client = new Anthropic();

export async function POST(request: Request) {
  const requiredPin = process.env.ACCESS_PIN || '';
  if (requiredPin && request.headers.get('x-pin') !== requiredPin) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json() as {
      property: Property;
      tone: Tone;
      guestMessage: string;
    };

    const { property, tone, guestMessage } = body;

    if (!property || !guestMessage) {
      return Response.json({ error: 'Missing property or guestMessage' }, { status: 400 });
    }

    const prompt = buildPrompt(property, property.context || '', tone, guestMessage);

    const resp = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = resp.content[0]?.type === 'text' ? resp.content[0].text : '';
    const data = parseReply(raw);

    return Response.json(data);
  } catch (err) {
    console.error('Reply API error:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
