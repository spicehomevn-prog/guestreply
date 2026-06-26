'use client';
import { useEffect, useRef } from 'react';
import type { AppState, Message, SavedReply, Tone } from '@/lib/types';
import type { ThemeTokens } from '@/lib/theme';
import type { Property } from '@/lib/types';
import MessageBubble from './MessageBubble';
import SavedLibrary from './SavedLibrary';

interface Props {
  s: AppState;
  theme: ThemeTokens;
  curProp: Property;
  scrollRef: React.RefObject<HTMLDivElement>;
  onChangeProp: () => void;
  onToggleInfo: () => void;
  onToggleRail: () => void;
  onCloseRail: () => void;
  onToneChange: (t: Tone) => void;
  onNewConv: () => void;
  onDraftChange: (v: string) => void;
  onKey: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  onCopyMsg: (text: string, id: string) => void;
  onSaveMsg: (m: Message) => void;
  onEditMsg: (id: string) => void;
  onUpdateMsgText: (id: string, val: string) => void;
  onFinishEdit: (id: string) => void;
  onRegen: (id: string) => void;
  onInsertSaved: (item: SavedReply) => void;
  onCopySaved: (text: string, id: string) => void;
  onDeleteSaved: (id: string) => void;
  onNameChange: (v: string) => void;
  onAddressChange: (v: string) => void;
  onContextChange: (v: string) => void;
  onSaveInfo: () => void;
}

export default function ChatWorkspace(props: Props) {
  const { s, theme, curProp, scrollRef } = props;
  const { ac, acWash, acTint, acDark, DM } = theme;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow draft textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 140) + 'px';
  }, [s.draft]);

  const savedFiltered = s.saved.filter(x => x.propId === s.propId);
  const sendBg = s.generating ? '#C9B6A2' : ac;

  return (
    <div className="fullh" style={{ minHeight: 560, display: 'flex', position: 'relative', fontFamily: 'Inter, sans-serif', background: '#FAFAF8' }}>
      {/* Scrim */}
      <div className={`railscrim${s.railOpen ? ' open' : ''}`} onClick={props.onCloseRail} />

      {/* ── LEFT RAIL ── */}
      <div className={`rail${s.railOpen ? ' open' : ''}`} style={{ width: 300, flex: 'none', background: '#1A1A18', display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Property header */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
          <div style={{ font: '500 12px Inter, sans-serif', letterSpacing: '.15em', textTransform: 'uppercase', color: ac, marginBottom: 12 }}>Nhà hiện tại</div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11 }}>
            <div style={{ width: 34, height: 34, borderRadius: 999, background: ac, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '600 13px Inter, sans-serif', flex: 'none' }}>{curProp.mono}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ color: '#fff', fontSize: 13.5, fontWeight: 600, lineHeight: 1.3 }}>{curProp.name}</div>
              <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 11.5, marginTop: 2 }}>{curProp.address}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <div onClick={props.onChangeProp} className="hovd" style={{ cursor: 'pointer', flex: 1, textAlign: 'center', border: '1px solid rgba(255,255,255,.18)', color: '#fff', padding: 8, font: '500 11.5px Inter, sans-serif', transition: 'background .15s' }}>Đổi nhà</div>
            <div onClick={props.onToggleInfo} className="hovd" style={{ cursor: 'pointer', flex: 1, textAlign: 'center', border: '1px solid rgba(255,255,255,.18)', color: '#fff', padding: 8, font: '500 11.5px Inter, sans-serif', transition: 'background .15s' }}>Thông tin nhà</div>
          </div>
        </div>

        {/* Saved library */}
        <SavedLibrary
          items={savedFiltered}
          theme={theme}
          copiedId={s.copiedId}
          count={savedFiltered.length}
          onInsert={props.onInsertSaved}
          onCopy={props.onCopySaved}
          onDelete={props.onDeleteSaved}
        />
      </div>

      {/* ── CENTER ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0 }}>
        {/* Header */}
        <div className="chathead" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 24px', borderBottom: '1px solid #E8E4DC', background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <div className="menubtn hov" onClick={props.onToggleRail} style={{ cursor: 'pointer', width: 38, height: 38, border: '1px solid #E8E4DC', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', fontSize: 17, color: '#2C2C2A', transition: 'all .15s' }}>☰</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <img src="/logo/mark.svg" alt="SpiceHome" style={{ width: 26, height: 26 }} />
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: '#1A1A18' }}>Cuộc trò chuyện</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <span className="tonelabel" style={{ fontSize: 12, color: '#7A7A72' }}>Giọng:</span>
            <select
              value={s.tone}
              onChange={e => props.onToneChange(e.target.value as Tone)}
              style={{ border: '1px solid #E8E4DC', background: '#fff', color: ac, font: '500 12px Inter, sans-serif', padding: '7px 10px', cursor: 'pointer' }}
            >
              <option value="friendly">Thân thiện như bạn</option>
              <option value="professional">Lịch sự &amp; chuyên nghiệp</option>
              <option value="concise">Ngắn gọn &amp; hiệu quả</option>
            </select>
            <div onClick={props.onNewConv} className="hov" style={{ cursor: 'pointer', border: '1px solid #E8E4DC', color: '#2C2C2A', padding: '7px 12px', font: '500 12px Inter, sans-serif', transition: 'all .15s' }}>Tạo mới</div>
          </div>
        </div>

        {/* Message list */}
        <div
          ref={scrollRef}
          className="scroll chatscroll"
          style={{ flex: 1, overflowY: 'auto', padding: DM.pad, background: '#FAFAF8', display: 'flex', flexDirection: 'column', gap: DM.gap }}
        >
          {s.messages.length === 0 ? (
            <div style={{ margin: 'auto', textAlign: 'center', maxWidth: 380, padding: '40px 0' }}>
              <div style={{ width: 52, height: 52, borderRadius: 999, background: acWash, border: `1px solid ${acTint}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', fontSize: 22 }}>✦</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: '#1A1A18', marginBottom: 8 }}>Dán tin nhắn của khách để bắt đầu</div>
              <div style={{ fontSize: 13.5, color: '#7A7A72', lineHeight: 1.6 }}>Khách viết tiếng Việt → trả lời tiếng Việt. Khách viết tiếng Anh hoặc ngôn ngữ khác → trả lời tiếng Anh, kèm bản dịch tiếng Việt để bạn kiểm tra. Dựa trên thông tin của {curProp.short}.</div>
            </div>
          ) : (
            s.messages.map(m => (
              <MessageBubble
                key={m.id}
                m={m}
                theme={theme}
                copiedId={s.copiedId}
                savedFlashId={s.savedFlashId}
                onCopy={props.onCopyMsg}
                onSave={props.onSaveMsg}
                onEdit={props.onEditMsg}
                onUpdateText={props.onUpdateMsgText}
                onFinishEdit={props.onFinishEdit}
                onRegen={props.onRegen}
              />
            ))
          )}
        </div>

        {/* Composer */}
        <div className="chatinput" style={{ padding: '16px 24px', borderTop: '1px solid #E8E4DC', background: '#fff' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
            <textarea
              ref={textareaRef}
              value={s.draft}
              onChange={e => props.onDraftChange(e.target.value)}
              onKeyDown={props.onKey}
              placeholder="Dán tin nhắn của khách… (Enter để gửi, Shift+Enter xuống dòng)"
              rows={1}
              style={{ flex: 1, minHeight: 46, maxHeight: 140, border: '1px solid #E8E4DC', background: '#FAFAF8', padding: '12px 14px', fontSize: 14, lineHeight: 1.5, color: '#2C2C2A', resize: 'none', overflow: 'auto', fontFamily: 'Inter, sans-serif' }}
            />
            <div onClick={props.onSend} className="hovd" style={{ cursor: 'pointer', background: sendBg, color: '#fff', padding: '13px 22px', font: '500 12px Inter, sans-serif', letterSpacing: '.1em', textTransform: 'uppercase', whiteSpace: 'nowrap', transition: 'background .2s', flexShrink: 0 }}>
              {s.generating ? 'Đang soạn…' : 'Tạo trả lời'}
            </div>
          </div>
        </div>
      </div>

      {/* ── INFO MODAL ── */}
      {s.showInfo && (
        <div onClick={props.onToggleInfo} className="infomodal" style={{ position: 'fixed', inset: 0, background: 'rgba(26,26,24,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, zIndex: 50 }}>
          <div onClick={e => e.stopPropagation()} style={{ width: 620, maxWidth: '100%', maxHeight: '86vh', background: '#fff', border: '1px solid #E8E4DC', display: 'flex', flexDirection: 'column', boxShadow: '0 30px 70px -20px rgba(26,26,24,.4)' }}>
            {/* Modal header */}
            <div style={{ padding: '22px 26px', borderBottom: '1px solid #E8E4DC', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ font: '500 12px Inter, sans-serif', letterSpacing: '.15em', textTransform: 'uppercase', color: ac }}>Thông tin nhà</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: '#1A1A18', marginTop: 6 }}>{curProp.name}</div>
                <div style={{ fontSize: 12.5, color: '#7A7A72', marginTop: 3 }}>Trợ lý chỉ dùng những thông tin dưới đây để trả lời. Hãy cập nhật WiFi, giá, chi tiết thật.</div>
              </div>
              <div onClick={props.onToggleInfo} style={{ cursor: 'pointer', fontSize: 20, color: '#7A7A72', padding: '2px 6px' }}>×</div>
            </div>

            {/* Modal body */}
            <div style={{ padding: '22px 26px', overflowY: 'auto', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginBottom: 18 }}>
                <div>
                  <label style={{ display: 'block', font: '500 11px Inter, sans-serif', letterSpacing: '.1em', textTransform: 'uppercase', color: '#7A7A72', marginBottom: 6 }}>Tên nhà</label>
                  <input
                    value={curProp.name}
                    onChange={e => props.onNameChange(e.target.value)}
                    style={{ width: '100%', border: '1px solid #E8E4DC', background: '#FAFAF8', padding: '11px 13px', fontSize: 14, color: '#2C2C2A', fontFamily: 'Inter, sans-serif' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', font: '500 11px Inter, sans-serif', letterSpacing: '.1em', textTransform: 'uppercase', color: '#7A7A72', marginBottom: 6 }}>Địa chỉ</label>
                  <input
                    value={curProp.address}
                    onChange={e => props.onAddressChange(e.target.value)}
                    style={{ width: '100%', border: '1px solid #E8E4DC', background: '#FAFAF8', padding: '11px 13px', fontSize: 14, color: '#2C2C2A', fontFamily: 'Inter, sans-serif' }}
                  />
                </div>
              </div>
              <label style={{ display: 'block', font: '500 11px Inter, sans-serif', letterSpacing: '.1em', textTransform: 'uppercase', color: '#7A7A72', marginBottom: 6 }}>Thông tin chi tiết · trợ lý dùng để trả lời</label>
              <textarea
                value={curProp.context}
                onChange={e => props.onContextChange(e.target.value)}
                className="scroll infobox"
                style={{ width: '100%', minHeight: 280, border: '1px solid #E8E4DC', background: '#FAFAF8', padding: 15, fontSize: 13.5, lineHeight: 1.7, color: '#2C2C2A', resize: 'vertical', fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            {/* Modal footer */}
            <div style={{ padding: '16px 26px', borderTop: '1px solid #E8E4DC', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <div onClick={props.onToggleInfo} className="hov" style={{ cursor: 'pointer', border: '1px solid #E8E4DC', padding: '11px 18px', font: '500 12px Inter, sans-serif', color: '#2C2C2A', transition: 'all .15s' }}>Đóng</div>
              <div onClick={props.onSaveInfo} className="hovd" style={{ cursor: 'pointer', background: ac, color: '#fff', padding: '11px 20px', font: '500 12px Inter, sans-serif', letterSpacing: '.08em', textTransform: 'uppercase', transition: 'background .2s' }}>
                {s.infoSaved ? '✓ Đã lưu' : 'Lưu thông tin'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
