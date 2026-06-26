'use client';
import type { ThemeTokens } from '@/lib/theme';
import type { Property } from '@/lib/types';

interface Props {
  theme: ThemeTokens;
  curProp: Property;
}

export default function LoadingScreen({ theme, curProp }: Props) {
  const { ac, acTint } = theme;
  return (
    <div style={{ height: '100vh', minHeight: 600, background: '#1A1A18', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center', maxWidth: 360 }}>

        {/* Monogram with rings */}
        <div className="lfade1" style={{ position: 'relative', width: 84, height: 84, margin: '0 auto 32px' }}>
          <span style={{ position: 'absolute', inset: 0, borderRadius: 999, border: `1px solid ${acTint}`, animation: 'ring 2.6s ease-out infinite' }} />
          <span style={{ position: 'absolute', inset: 0, borderRadius: 999, border: `1px solid ${acTint}`, animation: 'ring 2.6s ease-out 1.3s infinite' }} />
          <div style={{ position: 'absolute', inset: 0, borderRadius: 999, background: ac, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '600 26px Inter, sans-serif', animation: 'breathe 2.6s ease-in-out infinite' }}>
            {curProp.mono}
          </div>
        </div>

        {/* Eyebrow */}
        <div className="lfade2" style={{ font: '500 12px Inter, sans-serif', letterSpacing: '.2em', textTransform: 'uppercase', color: ac, marginBottom: 14 }}>
          Trợ lý trả lời khách
        </div>

        {/* Title */}
        <div className="lfade2" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 24, color: '#fff', lineHeight: 1.3, marginBottom: 8 }}>
          Đang mở cuộc trò chuyện
        </div>

        {/* Subtitle */}
        <div className="lfade3" style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', lineHeight: 1.55, marginBottom: 30 }}>
          Chuẩn bị thông tin cho {curProp.short}…
        </div>

        {/* Progress bar */}
        <div className="lfade3" style={{ position: 'relative', width: 180, height: 2, background: 'rgba(255,255,255,.12)', margin: '0 auto', overflow: 'hidden' }}>
          <span style={{ position: 'absolute', top: 0, width: '42%', height: '100%', background: ac, animation: 'flow 1.5s cubic-bezier(.45,0,.25,1) infinite' }} />
        </div>
      </div>
    </div>
  );
}
