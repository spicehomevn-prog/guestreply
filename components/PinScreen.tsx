'use client';
import { useState, useRef, useEffect } from 'react';
import type { ThemeTokens } from '@/lib/theme';

export default function PinScreen({ theme, onSuccess }: { theme: ThemeTokens; onSuccess: (pin: string) => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { ac, acTint } = theme;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = () => {
    const correct = process.env.NEXT_PUBLIC_ACCESS_PIN || '';
    if (!correct || pin === correct) {
      onSuccess(pin);
    } else {
      setError(true);
      setPin('');
      setTimeout(() => setError(false), 2200);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit();
  };

  return (
    <div style={{ height: '100vh', minHeight: 600, background: '#1A1A18', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>
      <div style={{ textAlign: 'center', width: 300 }}>

        {/* Icon */}
        <div className="lfade1" style={{ width: 56, height: 56, borderRadius: 999, background: ac, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 28px', animation: 'breathe 2.8s ease-in-out infinite' }}>✦</div>

        {/* Title */}
        <div className="lfade1" style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: '#fff', lineHeight: 1.2, marginBottom: 8 }}>Trợ Lý Trả Lời Khách</div>
        <div className="lfade2" style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', marginBottom: 36, lineHeight: 1.5 }}>Nhập mã truy cập để tiếp tục</div>

        {/* PIN input */}
        <div className="lfade2" style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <input
            ref={inputRef}
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={e => { setPin(e.target.value); setError(false); }}
            onKeyDown={onKey}
            placeholder="••••••"
            maxLength={12}
            style={{
              width: 200, textAlign: 'center', letterSpacing: '0.25em',
              border: `1px solid ${error ? acTint : 'rgba(255,255,255,.18)'}`,
              background: error ? 'rgba(196,119,59,.08)' : 'rgba(255,255,255,.07)',
              color: '#fff', padding: '13px 16px', fontSize: 20,
              fontFamily: 'Inter, sans-serif', transition: 'border-color .2s, background .2s',
            }}
          />
          <div style={{ height: 18, fontSize: 12.5, color: ac, opacity: error ? 1 : 0, transition: 'opacity .25s' }}>
            Mã không đúng. Vui lòng thử lại.
          </div>
          <div
            onClick={submit}
            className="hovd"
            style={{ cursor: 'pointer', background: ac, color: '#fff', padding: '12px 36px', font: '500 12px Inter, sans-serif', letterSpacing: '.14em', textTransform: 'uppercase', transition: 'background .2s' }}
          >
            Truy cập
          </div>
        </div>

        <div className="lfade3" style={{ fontSize: 11, color: 'rgba(255,255,255,.22)', marginTop: 40 }}>Created by Hailey Tran</div>
      </div>
    </div>
  );
}
