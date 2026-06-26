import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Trợ Lý Trả Lời Khách';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1A1A18',
          position: 'relative',
        }}
      >
        {/* Top accent bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 7, background: '#C4773B', display: 'flex' }} />

        {/* Background texture dots */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', opacity: 0.04 }}>
          <div style={{ width: '100%', height: '100%', backgroundImage: 'radial-gradient(circle, #C4773B 1px, transparent 1px)', backgroundSize: '40px 40px', display: 'flex' }} />
        </div>

        {/* Center content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 100px' }}>

          {/* Icon circle */}
          <div style={{
            width: 90, height: 90, borderRadius: 999,
            background: '#C4773B',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 42, color: '#fff',
            marginBottom: 40,
            boxShadow: '0 0 0 16px rgba(196,119,59,0.12)',
          }}>
            ✦
          </div>

          {/* Eyebrow */}
          <div style={{
            fontSize: 18, letterSpacing: '0.28em', textTransform: 'uppercase',
            color: '#C4773B', marginBottom: 20, display: 'flex',
          }}>
            SpiceHome · Công cụ hỗ trợ host
          </div>

          {/* Main title */}
          <div style={{
            fontSize: 72, fontWeight: 700, color: '#FFFFFF',
            textAlign: 'center', lineHeight: 1.15, marginBottom: 24,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>
            Trợ Lý Trả Lời Khách
          </div>

          {/* Divider */}
          <div style={{ width: 64, height: 2, background: '#C4773B', marginBottom: 28, display: 'flex' }} />

          {/* Tagline */}
          <div style={{
            fontSize: 26, color: 'rgba(255,255,255,0.60)',
            textAlign: 'center', lineHeight: 1.55, display: 'flex',
          }}>
            Soạn câu trả lời cho khách nhanh · đúng thông tin · đa ngôn ngữ
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 64, background: 'rgba(196,119,59,0.10)',
          borderTop: '1px solid rgba(196,119,59,0.20)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em', display: 'flex' }}>
            Created by Hailey Tran · 0355 608 623
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
