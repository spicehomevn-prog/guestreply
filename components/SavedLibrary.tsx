'use client';
import type { SavedReply } from '@/lib/types';
import type { ThemeTokens } from '@/lib/theme';

interface Props {
  items: SavedReply[];
  theme: ThemeTokens;
  copiedId: string | null;
  count: number;
  onInsert: (item: SavedReply) => void;
  onCopy: (text: string, id: string) => void;
  onDelete: (id: string) => void;
}

export default function SavedLibrary({ items, theme, copiedId, count, onInsert, onCopy, onDelete }: Props) {
  const { ac } = theme;
  return (
    <>
      <div style={{ padding: '18px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ font: '500 12px Inter, sans-serif', letterSpacing: '.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)' }}>Thư viện đã lưu</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)' }}>{count}</div>
      </div>
      <div className="scroll" style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 20px', display: 'flex', flexDirection: 'column', gap: 9 }}>
        {items.length === 0 ? (
          <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 12, lineHeight: 1.6, padding: '8px 0' }}>
            Chưa có câu trả lời nào được lưu cho nhà này. Bấm <span style={{ color: ac }}>⇧ Lưu</span> dưới mỗi câu trả lời để dùng lại sau.
          </div>
        ) : items.map(it => (
          <div key={it.id} className="savedcard" style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.08)', padding: '11px 12px' }}>
            <div style={{ color: '#fff', fontSize: 12, fontWeight: 600, lineHeight: 1.35, marginBottom: 4 }}>{it.title}</div>
            <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 11.5, lineHeight: 1.45 }}>
              {it.text.length > 64 ? it.text.slice(0, 64) + '…' : it.text}
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 9 }}>
              <div onClick={() => onInsert(it)} className="hovd" style={{ cursor: 'pointer', border: '1px solid rgba(255,255,255,.16)', color: ac, padding: '5px 9px', font: '500 11px Inter, sans-serif', transition: 'background .15s' }}>⧉ Chèn</div>
              <div onClick={() => onCopy(it.text, it.id)} className="hovd" style={{ cursor: 'pointer', border: '1px solid rgba(255,255,255,.16)', color: '#fff', padding: '5px 9px', font: '500 11px Inter, sans-serif', transition: 'background .15s' }}>
                {copiedId === it.id ? '✓ Đã chép' : '⧉ Chép'}
              </div>
              <div onClick={() => onDelete(it.id)} className="hovd" style={{ cursor: 'pointer', marginLeft: 'auto', color: 'rgba(255,255,255,.4)', padding: '5px 7px', font: '500 11px Inter, sans-serif', transition: 'background .15s' }}>Xóa</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
