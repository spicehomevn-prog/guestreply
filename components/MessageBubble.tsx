'use client';
import type { Message } from '@/lib/types';
import type { ThemeTokens } from '@/lib/theme';

interface Props {
  m: Message;
  theme: ThemeTokens;
  copiedId: string | null;
  savedFlashId: string | null;
  onCopy: (text: string, id: string) => void;
  onSave: (m: Message) => void;
  onEdit: (id: string) => void;
  onUpdateText: (id: string, val: string) => void;
  onFinishEdit: (id: string) => void;
  onRegen: (id: string) => void;
}

export default function MessageBubble({ m, theme, copiedId, savedFlashId, onCopy, onSave, onEdit, onUpdateText, onFinishEdit, onRegen }: Props) {
  const { ac, acWash, acTint, acDark, DM, rad } = theme;

  const bubGuestStyle: React.CSSProperties = {
    background: '#1A1A18', color: '#fff',
    padding: `${DM.py}px ${DM.px}px`,
    fontSize: DM.font, lineHeight: 1.55,
    borderRadius: rad, overflow: 'hidden',
  };
  const bubHostStyle: React.CSSProperties = {
    display: 'inline-block', maxWidth: 560,
    background: '#fff', border: '1px solid #E8E4DC',
    padding: `${DM.py}px ${DM.px}px`,
    fontSize: DM.font, lineHeight: 1.65,
    color: '#2C2C2A', borderRadius: rad, overflow: 'hidden',
  };
  const gBandStyle: React.CSSProperties = {
    margin: `${DM.py}px -${DM.px}px -${DM.py}px`,
    padding: `${DM.py}px ${DM.px}px`,
    background: 'rgba(255,255,255,.06)',
    borderTop: '1px solid rgba(255,255,255,.14)',
    textAlign: 'left',
  };
  const hBandStyle: React.CSSProperties = {
    margin: `${DM.py}px -${DM.px}px -${DM.py}px`,
    padding: `${DM.py}px ${DM.px}px`,
    background: acWash,
    borderTop: `1px solid ${acTint}`,
  };

  // Darken accent by 45% for translation text color
  function darken45(hex: string) {
    const h = hex.replace('#', '');
    const c = [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
    const d = (x: number) => Math.round(x * (1 - 0.45));
    return `rgb(${d(c[0])},${d(c[1])},${d(c[2])})`;
  }
  const hTextColor = darken45(ac);

  if (m.role === 'guest') {
    return (
      <div className="msg" style={{ alignSelf: 'flex-end', maxWidth: '82%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <div className="bubble bubbleGuest" style={bubGuestStyle}>
          <div style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
          {m.vi && (
            <div style={gBandStyle}>
              <span style={{ display: 'block', font: '500 10px Inter, sans-serif', letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)', marginBottom: 5 }}>Bản dịch · Khách hỏi</span>
              <span style={{ display: 'block', fontSize: 13, lineHeight: 1.5, color: 'rgba(255,255,255,.72)', whiteSpace: 'pre-wrap' }}>{m.vi}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Host bubble
  const thinking = m.typing && !m.displayText;
  const editing = !!m.editing;
  const showCard = !thinking && !editing;
  const showActions = showCard && !m.typing;
  const displayText = m.typing ? m.displayText : m.text;

  return (
    <div className="msg" style={{ alignSelf: 'flex-start', maxWidth: '88%', width: '100%' }}>
      {thinking && (
        <div style={{ display: 'inline-flex', gap: 5, padding: '14px 16px', background: '#fff', border: '1px solid #E8E4DC', alignItems: 'center' }}>
          <span className="tdot" /><span className="tdot" /><span className="tdot" />
        </div>
      )}
      {editing && (
        <div style={{ display: 'inline-block', width: '100%', maxWidth: 560 }}>
          <textarea
            value={m.text}
            onChange={e => onUpdateText(m.id, e.target.value)}
            style={{ width: '100%', minHeight: 120, border: `1px solid ${ac}`, background: '#fff', padding: '13px 15px', fontSize: 14, lineHeight: 1.6, color: '#2C2C2A', resize: 'vertical', fontFamily: 'Inter, sans-serif' }}
          />
          <div onClick={() => onFinishEdit(m.id)} style={{ cursor: 'pointer', display: 'inline-block', background: ac, color: '#fff', padding: '8px 16px', marginTop: 8, font: '500 11.5px Inter, sans-serif', letterSpacing: '.08em', textTransform: 'uppercase' }}>Xong</div>
        </div>
      )}
      {showCard && (
        <>
          <div className="bubble bubbleHost" style={bubHostStyle}>
            <div style={{ whiteSpace: 'pre-wrap' }}>{displayText}</div>
            {!m.typing && m.vi && (
              <div style={hBandStyle}>
                <span style={{ display: 'block', font: '500 10px Inter, sans-serif', letterSpacing: '.12em', textTransform: 'uppercase', color: acDark, marginBottom: 5 }}>Bản dịch tiếng Việt · Để bạn kiểm tra</span>
                <span style={{ display: 'block', fontSize: 13, lineHeight: 1.55, color: hTextColor, whiteSpace: 'pre-wrap' }}>{m.vi}</span>
              </div>
            )}
          </div>
          {showActions && (
            <div style={{ display: 'flex', gap: 7, marginTop: 9, flexWrap: 'wrap' }}>
              <div onClick={() => onCopy(m.text, m.id)} className="hov" style={{ cursor: 'pointer', border: '1px solid #E8E4DC', background: '#fff', padding: '7px 12px', font: '500 12px Inter, sans-serif', color: ac, transition: 'all .15s' }}>
                {copiedId === m.id ? '✓ Đã chép' : '⧉ Sao chép'}
              </div>
              <div onClick={() => onSave(m)} className="hov" style={{ cursor: 'pointer', border: '1px solid #E8E4DC', background: '#fff', padding: '7px 12px', font: '500 12px Inter, sans-serif', color: '#2C2C2A', transition: 'all .15s' }}>
                {savedFlashId === m.id ? '✓ Đã lưu' : '⇧ Lưu'}
              </div>
              <div onClick={() => onEdit(m.id)} className="hov" style={{ cursor: 'pointer', border: '1px solid #E8E4DC', background: '#fff', padding: '7px 12px', font: '500 12px Inter, sans-serif', color: '#2C2C2A', transition: 'all .15s' }}>✎ Sửa</div>
              <div onClick={() => onRegen(m.id)} className="hov" style={{ cursor: 'pointer', border: '1px solid #E8E4DC', background: '#fff', padding: '7px 12px', font: '500 12px Inter, sans-serif', color: '#7A7A72', transition: 'all .15s' }}>↻ Tạo lại</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
