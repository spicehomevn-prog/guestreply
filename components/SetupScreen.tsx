'use client';
import type { AppState, Tone } from '@/lib/types';
import type { ThemeTokens } from '@/lib/theme';

const TONES = [
  { id: 'friendly' as Tone, label: 'Thân thiện như bạn địa phương', desc: 'Ấm áp, gần gũi, xưng mình – bạn' },
  { id: 'professional' as Tone, label: 'Lịch sự & chuyên nghiệp', desc: 'Chỉn chu, rõ ràng, vẫn ấm áp' },
  { id: 'concise' as Tone, label: 'Ngắn gọn & hiệu quả', desc: '1–3 câu, đi thẳng vào vấn đề' },
];

interface Props {
  s: AppState;
  theme: ThemeTokens;
  onSelectProp: (id: string) => void;
  onSelectTone: (t: Tone) => void;
  onStart: () => void;
  onOpenAdd: () => void;
  onCancelAdd: () => void;
  onAddName: (v: string) => void;
  onAddAddress: (v: string) => void;
  onAddContext: (v: string) => void;
  onAddProperty: () => void;
  onAskDelete: (id: string) => void;
  onCancelDelete: () => void;
  onConfirmDelete: (id: string) => void;
}

export default function SetupScreen({ s, theme, onSelectProp, onSelectTone, onStart, onOpenAdd, onCancelAdd, onAddName, onAddAddress, onAddContext, onAddProperty, onAskDelete, onCancelDelete, onConfirmDelete }: Props) {
  const { ac, acWash } = theme;
  const startBg = s.propId ? ac : '#D8C9BB';

  return (
    <div style={{ height: '100vh', minHeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, overflow: 'auto', fontFamily: 'Inter, sans-serif', background: '#FAFAF8' }}>
      <div className="setupcard" style={{ width: 520, maxWidth: '100%', background: '#fff', border: '1px solid #E8E4DC' }}>

        {/* Header */}
        <div style={{ background: '#1A1A18', padding: '32px 36px' }}>
          <div style={{ font: '500 12px Inter, sans-serif', letterSpacing: '.15em', textTransform: 'uppercase', color: ac }}>Trợ lý trả lời khách</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, color: '#fff', marginTop: 12, lineHeight: 1.15 }}>Bắt đầu cuộc trò chuyện</div>
          <div style={{ color: 'rgba(255,255,255,.6)', fontSize: 14, marginTop: 8, lineHeight: 1.55 }}>Chọn nhà và giọng văn. Trợ lý sẽ tự nhận diện ngôn ngữ của khách và soạn câu trả lời phù hợp.</div>
        </div>

        <div style={{ padding: '30px 36px' }}>
          {/* Property section label */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ font: '500 12px Inter, sans-serif', letterSpacing: '.15em', textTransform: 'uppercase', color: '#7A7A72' }}>Chọn nhà</div>
            {!s.showAdd && (
              <div onClick={onOpenAdd} style={{ cursor: 'pointer', font: '500 12px Inter, sans-serif', color: ac, transition: 'color .15s' }}>＋ Thêm nhà</div>
            )}
          </div>

          {/* Property list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {s.properties.map(p => {
              const sel = p.id === s.propId;
              const confirming = s.confirmDeleteId === p.id;
              return (
                <div key={p.id} style={{ border: `1px solid ${sel ? ac : '#E8E4DC'}`, background: sel ? acWash : '#fff', transition: 'all .15s' }}>
                  {confirming ? (
                    <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ fontSize: 13, color: '#2C2C2A', minWidth: 0, lineHeight: 1.4 }}>Xóa <b>{p.name}</b>? Thông tin sẽ mất.</div>
                      <div style={{ display: 'flex', gap: 7, flex: 'none' }}>
                        <div onClick={() => onConfirmDelete(p.id)} style={{ cursor: 'pointer', background: '#1A1A18', color: '#fff', padding: '7px 13px', font: '500 11px Inter, sans-serif' }}>Xóa</div>
                        <div onClick={onCancelDelete} className="hov" style={{ cursor: 'pointer', border: '1px solid #E8E4DC', padding: '7px 13px', font: '500 11px Inter, sans-serif', color: '#2C2C2A', transition: 'all .15s' }}>Hủy</div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 13, alignItems: 'flex-start', padding: '14px 16px' }}>
                      <div onClick={() => onSelectProp(p.id)} style={{ cursor: 'pointer', width: 18, height: 18, borderRadius: 999, border: sel ? `5px solid ${ac}` : '1.5px solid #C9C4BA', flex: 'none', marginTop: 1 }} />
                      <div onClick={() => onSelectProp(p.id)} style={{ cursor: 'pointer', flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: '#2C2C2A' }}>{p.name}</div>
                        <div style={{ fontSize: 12.5, color: '#7A7A72', marginTop: 2 }}>{p.address || '(chưa có địa chỉ)'}</div>
                      </div>
                      <div onClick={() => onAskDelete(p.id)} title="Xóa nhà" style={{ cursor: 'pointer', flex: 'none', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B5AFA4', fontSize: 17, lineHeight: 1, transition: 'color .15s' }}>×</div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Empty state */}
            {!s.properties.length && !s.showAdd && (
              <div style={{ border: '1px dashed #CFC9BE', background: '#FAFAF8', padding: '18px 16px', textAlign: 'center', fontSize: 13, color: '#7A7A72', lineHeight: 1.5 }}>
                Chưa có nhà nào. Bấm <span style={{ color: ac }}>＋ Thêm nhà</span> để tạo nhà đầu tiên.
              </div>
            )}

            {/* Add form */}
            {s.showAdd && (
              <div style={{ border: '1px solid #E8E4DC', background: '#FAFAF8', padding: '15px 16px', display: 'flex', flexDirection: 'column', gap: 9 }}>
                <div style={{ font: '500 11px Inter, sans-serif', letterSpacing: '.1em', textTransform: 'uppercase', color: '#7A7A72' }}>Nhà mới</div>
                <input
                  value={s.addName}
                  onChange={e => onAddName(e.target.value)}
                  placeholder="Tên nhà (vd: SpiceHome Cơ sở 3)"
                  style={{ border: '1px solid #E8E4DC', background: '#fff', padding: '11px 13px', fontSize: 13.5, color: '#2C2C2A', fontFamily: 'Inter, sans-serif' }}
                />
                <input
                  value={s.addAddress}
                  onChange={e => onAddAddress(e.target.value)}
                  placeholder="Địa chỉ"
                  style={{ border: '1px solid #E8E4DC', background: '#fff', padding: '11px 13px', fontSize: 13.5, color: '#2C2C2A', fontFamily: 'Inter, sans-serif' }}
                />
                <div style={{ font: '500 11px Inter, sans-serif', letterSpacing: '.1em', textTransform: 'uppercase', color: '#7A7A72', marginTop: 4 }}>Thông tin nhà · Điền vào những phần trong ngoặc ( )</div>
                <textarea
                  value={s.addContext}
                  onChange={e => onAddContext(e.target.value)}
                  className="scroll"
                  style={{ width: '100%', minHeight: 190, border: '1px solid #E8E4DC', background: '#fff', padding: '12px 13px', fontSize: 13, lineHeight: 1.65, color: '#2C2C2A', resize: 'vertical', fontFamily: 'Inter, sans-serif' }}
                />
                <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
                  <div onClick={onAddProperty} className="hovd" style={{ cursor: 'pointer', background: ac, color: '#fff', padding: '10px 18px', font: '500 11.5px Inter, sans-serif', letterSpacing: '.08em', textTransform: 'uppercase', transition: 'background .2s' }}>Thêm nhà</div>
                  <div onClick={onCancelAdd} className="hov" style={{ cursor: 'pointer', border: '1px solid #E8E4DC', padding: '10px 18px', font: '500 11.5px Inter, sans-serif', color: '#2C2C2A', transition: 'all .15s' }}>Hủy</div>
                </div>
                <div style={{ fontSize: 11.5, color: '#9C9384', lineHeight: 1.5, marginTop: 2 }}>Cứ thêm trước, mỗi phần trong ngoặc có thể sửa lại bất cứ lúc nào ở "Thông tin nhà".</div>
              </div>
            )}
          </div>

          {/* Tone */}
          <div style={{ font: '500 12px Inter, sans-serif', letterSpacing: '.15em', textTransform: 'uppercase', color: '#7A7A72', margin: '26px 0 14px' }}>Giọng văn</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {TONES.map(t => {
              const sel = t.id === s.tone;
              const { acDark } = theme;
              return (
                <div key={t.id} onClick={() => onSelectTone(t.id)} className="hov" style={{ cursor: 'pointer', border: `1px solid ${sel ? ac : '#E8E4DC'}`, background: sel ? acWash : '#fff', padding: '12px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all .15s' }}>
                  <div style={{ minWidth: 0, paddingRight: 10 }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5, lineHeight: 1.4, color: sel ? acDark : '#2C2C2A' }}>{t.label}</div>
                    <div style={{ fontSize: 12, lineHeight: 1.4, color: '#7A7A72', marginTop: 3 }}>{t.desc}</div>
                  </div>
                  <div style={{ fontSize: 14, flex: 'none', color: sel ? acDark : '#2C2C2A' }}>{sel ? '✓' : ''}</div>
                </div>
              );
            })}
          </div>

          {/* Start CTA */}
          <div onClick={onStart} className="hovd" style={{ cursor: 'pointer', background: startBg, color: '#fff', textAlign: 'center', padding: 15, marginTop: 28, font: '500 12px Inter, sans-serif', letterSpacing: '.15em', textTransform: 'uppercase', transition: 'background .2s' }}>
            Bắt đầu trả lời
          </div>

          {/* Footer */}
          <div style={{ textAlign: 'center', fontSize: 11.5, color: '#9C9384', lineHeight: 1.6, marginTop: 20, paddingTop: 18, borderTop: '1px solid #ECE8E0', fontStyle: 'italic' }}>
            Tạo bởi Hailey Tran ·{' '}
            <a href="tel:0355608623" style={{ color: ac, textDecoration: 'none' }}>0355 608 623</a>
            {' '}để được hỗ trợ
          </div>
        </div>
      </div>
    </div>
  );
}
