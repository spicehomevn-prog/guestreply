import type { Property, SavedReply, Tone } from './types';

const KEYS = {
  properties: 'sh_cs_properties',
  prop: 'sh_cs_prop',
  tone: 'sh_cs_tone',
  saved: 'sh_cs_saved',
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, val: unknown) {
  try {
    localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val));
  } catch {
    // ignore
  }
}

export function loadAll() {
  const properties = safeGet<Property[]>(KEYS.properties, []);
  const tone = (localStorage.getItem(KEYS.tone) as Tone) || 'friendly';
  const saved = safeGet<SavedReply[]>(KEYS.saved, []);
  let propId = localStorage.getItem(KEYS.prop) || null;
  if (!Array.isArray(properties) || !properties.length) propId = null;
  if (propId && !properties.find(p => p.id === propId)) propId = properties[0]?.id ?? null;
  return { properties: Array.isArray(properties) ? properties : [], tone, saved, propId };
}

export function persistProperties(props: Property[]) {
  safeSet(KEYS.properties, props);
}

export function persistPropId(id: string | null) {
  safeSet(KEYS.prop, id ?? '');
}

export function persistTone(tone: Tone) {
  safeSet(KEYS.tone, tone);
}

export function persistSaved(saved: SavedReply[]) {
  safeSet(KEYS.saved, saved);
}
