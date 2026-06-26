function hx(h: string): [number, number, number] {
  h = h.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  return [
    parseInt(h.slice(0, 2), 16) || 0,
    parseInt(h.slice(2, 4), 16) || 0,
    parseInt(h.slice(4, 6), 16) || 0,
  ];
}

function rgba(h: string, a: number): string {
  const c = hx(h);
  return `rgba(${c[0]},${c[1]},${c[2]},${a})`;
}

function darken(h: string, f: number): string {
  const c = hx(h);
  const d = (x: number) => Math.round(x * (1 - f));
  return `rgb(${d(c[0])},${d(c[1])},${d(c[2])})`;
}

export type Density = 'Vừa phải' | 'Thoáng' | 'Gọn';
export type BubbleShape = 'Vuông' | 'Bo nhẹ' | 'Bo tròn';

const DMAP: Record<string, { px: number; py: number; font: string; gap: string; pad: string }> = {
  'Vừa phải': { px: 17, py: 13, font: '14px', gap: '16px', pad: '26px 24px' },
  'Thoáng': { px: 21, py: 17, font: '15px', gap: '21px', pad: '34px 30px' },
  'Gọn': { px: 14, py: 10, font: '13px', gap: '10px', pad: '18px 16px' },
};

const RM: Record<string, string> = {
  'Vuông': '0px',
  'Bo nhẹ': '13px',
  'Bo tròn': '22px',
};

export interface ThemeTokens {
  ac: string;
  acDark: string;
  acWash: string;
  acTint: string;
  DM: { px: number; py: number; font: string; gap: string; pad: string };
  rad: string;
}

export function deriveTheme(
  accent = '#C4773B',
  density: Density = 'Vừa phải',
  bubbleShape: BubbleShape = 'Vuông',
): ThemeTokens {
  const ac = accent;
  return {
    ac,
    acDark: darken(ac, 0.16),
    acWash: rgba(ac, 0.09),
    acTint: rgba(ac, 0.4),
    DM: DMAP[density] || DMAP['Vừa phải'],
    rad: RM[bubbleShape] || '0px',
  };
}
