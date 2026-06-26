'use client';
import type { ThemeTokens } from '@/lib/theme';

export default function WelcomeScreen({ theme }: { theme: ThemeTokens }) {
  const { ac, acTint } = theme;
  return (
    <div style={{ height: '100vh', minHeight: 600, background: '#1A1A18', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>

        {/* Icon with rings */}
        <div className="lfade1" style={{ position: 'relative', width: 88, height: 88, margin: '0 auto 34px' }}>
          <span style={{ position: 'absolute', inset: 0, borderRadius: 999, border: `1px solid ${acTint}`, animation: 'ring 2.8s ease-out infinite' }} />
          <span style={{ position: 'absolute', inset: 0, borderRadius: 999, border: `1px solid ${acTint}`, animation: 'ring 2.8s ease-out 1.4s infinite' }} />
          <div style={{ position: 'absolute', inset: 0, borderRadius: 999, background: ac, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, animation: 'breathe 2.8s ease-in-out infinite' }}>✦</div>
        </div>

        {/* Eyebrow */}
        <div className="lfade2" style={{ font: '500 12px Inter, sans-serif', letterSpacing: '.22em', textTransform: 'uppercase', color: ac, marginBottom: 16 }}>
          Created by Hailey Tran
        </div>

        {/* Subtitle */}
        <div className="lfade2" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 17, color: 'rgba(255,255,255,.7)', lineHeight: 1.3, marginBottom: 6 }}>
          Welcome to
        </div>

        {/* Title */}
        <div className="lfade2" style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: '#fff', lineHeight: 1.2, marginBottom: 14 }}>
          Trợ Lý Trả Lời Khách
        </div>

        {/* Tagline */}
        <div className="lfade3" style={{ fontSize: 13.5, color: 'rgba(255,255,255,.55)', lineHeight: 1.6, marginBottom: 32 }}>
          Người trợ lý đắc lực giúp bạn trả lời khách nhanh và đúng thông tin từng nhà.
        </div>

        {/* Progress bar */}
        <div className="lfade3" style={{ position: 'relative', width: 200, height: 2, background: 'rgba(255,255,255,.12)', margin: '0 auto', overflow: 'hidden' }}>
          <span style={{ position: 'absolute', top: 0, width: '42%', height: '100%', background: ac, animation: 'flow 1.6s cubic-bezier(.45,0,.25,1) infinite' }} />
        </div>
      </div>
    </div>
  );
}
