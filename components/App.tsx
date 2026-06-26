'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import type { AppState, Property, Message, SavedReply, Tone } from '@/lib/types';
import { loadAll, persistProperties, persistPropId, persistTone, persistSaved } from '@/lib/storage';
import { deriveTheme } from '@/lib/theme';
import WelcomeScreen from './WelcomeScreen';
import PinScreen from './PinScreen';
import SetupScreen from './SetupScreen';
import LoadingScreen from './LoadingScreen';
import ChatWorkspace from './ChatWorkspace';

const REQUIRED_PIN = process.env.NEXT_PUBLIC_ACCESS_PIN || '';

const NEW_TEMPLATE = `Khu vực: (gần chợ, quán ăn, điểm tham quan…)
Nhận phòng: (vd: từ 14:00) – Trả phòng: (vd: trước 12:00)
WiFi: tên mạng (điền) – mật khẩu (điền)
Xe cộ: (chỗ để xe máy / ô tô)
Di chuyển: (cách sân bay / trung tâm bao xa)
Phòng: (loại giường, điều hòa, máy nước nóng…)
Quy định: (giờ yên lặng, hút thuốc, giấy tờ tùy thân…)
Liên hệ host: (số điện thoại)`;

function makeMono(name: string): string {
  const words = (name || '').trim().split(/\s+/).filter(Boolean);
  if (!words.length) return '•';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

const INITIAL: AppState = {
  screen: REQUIRED_PIN ? 'pin' : 'welcome',
  propId: null,
  tone: 'friendly',
  properties: [],
  messages: [],
  saved: [],
  draft: '',
  generating: false,
  showInfo: false,
  showAdd: false,
  addName: '',
  addAddress: '',
  addContext: NEW_TEMPLATE,
  confirmDeleteId: null,
  copiedId: null,
  savedFlashId: null,
  railOpen: false,
  infoSaved: false,
};

export default function App() {
  const [s, setS] = useState<AppState>(INITIAL);
  const typerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const introRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const startWelcomeTimer = () => {
    if (introRef.current) clearTimeout(introRef.current);
    introRef.current = setTimeout(() => {
      setS(prev => prev.screen === 'welcome' ? { ...prev, screen: 'setup' } : prev);
    }, 2400);
  };

  // Load from localStorage on mount + start welcome timer (or show PIN gate)
  useEffect(() => {
    const stored = loadAll();
    if (REQUIRED_PIN) {
      const sessionPin = sessionStorage.getItem('sh_pin') || '';
      if (sessionPin === REQUIRED_PIN) {
        setS(prev => ({ ...prev, ...stored, screen: 'welcome' }));
        startWelcomeTimer();
      } else {
        setS(prev => ({ ...prev, ...stored, screen: 'pin' }));
      }
    } else {
      setS(prev => ({ ...prev, ...stored }));
      startWelcomeTimer();
    }
    return () => {
      if (introRef.current) clearTimeout(introRef.current);
      if (typerRef.current) clearTimeout(typerRef.current);
      if (startRef.current) clearTimeout(startRef.current);
      if (copyRef.current) clearTimeout(copyRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll message list on new messages
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [s.messages]);

  const validatePin = (pin: string) => {
    sessionStorage.setItem('sh_pin', pin);
    setS(prev => ({ ...prev, screen: 'welcome' }));
    startWelcomeTimer();
  };

  const theme = deriveTheme('#C4773B', 'Vừa phải', 'Bo tròn');

  // ── typeOut ──
  const typeOut = useCallback((id: string, full: string) => {
    if (typerRef.current) clearTimeout(typerRef.current);
    const step = (i: number) => {
      const next = Math.min(full.length, i + Math.max(2, Math.round(full.length / 90)));
      const slice = full.slice(0, next);
      setS(prev => ({
        ...prev,
        messages: prev.messages.map(m => m.id === id ? { ...m, displayText: slice } : m),
      }));
      if (next < full.length) {
        typerRef.current = setTimeout(() => step(next), 16);
      } else {
        setS(prev => ({
          ...prev,
          generating: false,
          messages: prev.messages.map(m =>
            m.id === id ? { ...m, text: full, displayText: full, typing: false } : m
          ),
        }));
      }
    };
    step(0);
  }, []);

  // ── generate (call API) ──
  const generate = useCallback(async (gid: string, guestText: string) => {
    setS(prev => {
      const prop = prev.properties.find(p => p.id === prev.propId);
      if (!prop) return prev;
      const hid = 'h' + Date.now();
      return {
        ...prev,
        generating: true,
        messages: [...prev.messages, { id: hid, role: 'host' as const, text: '', displayText: '', typing: true, vi: '', editing: false }],
      };
    });

    // Capture state snapshot for the API call
    setS(prev => {
      const prop = prev.properties.find(p => p.id === prev.propId);
      const hid = prev.messages.filter(m => m.role === 'host' && m.typing).slice(-1)[0]?.id
        || prev.messages[prev.messages.length - 1]?.id;

      if (!prop || !hid) return prev;

      // Async call — fire and handle
      (async () => {
        try {
          const pin = sessionStorage.getItem('sh_pin') || '';
          const res = await fetch('/api/reply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...(pin ? { 'x-pin': pin } : {}) },
            body: JSON.stringify({ property: prop, tone: prev.tone, guestMessage: guestText }),
          });
          const data = await res.json() as { reply?: string; guest_vi?: string; reply_vi?: string };
          const guestVi = (data.guest_vi || '').trim();
          const replyVi = (data.reply_vi || '').trim();
          const replyText = (data.reply || '').trim() || 'Mình chưa nhận được nội dung. Bạn thử bấm "Tạo lại" nhé.';
          setS(p => ({
            ...p,
            messages: p.messages.map(m => {
              if (m.id === gid) return { ...m, vi: guestVi };
              if (m.id === hid) return { ...m, vi: replyVi };
              return m;
            }),
          }));
          typeOut(hid, replyText);
        } catch {
          setS(p => ({
            ...p,
            generating: false,
            messages: p.messages.map(m =>
              m.id === hid
                ? { ...m, typing: false, displayText: 'x', text: 'Xin lỗi, hiện mình chưa tạo được câu trả lời (có thể do giới hạn lượt). Bạn thử bấm "Tạo lại" sau giây lát nhé.' }
                : m
            ),
          }));
        }
      })();

      return prev; // no-op state update; side-effect handled above
    });
  }, [typeOut]);

  // ── send ──
  const send = useCallback(() => {
    setS(prev => {
      const text = (prev.draft || '').trim();
      if (!text || prev.generating) return prev;
      const gid = 'g' + Date.now();
      const newMessages: Message[] = [...prev.messages, { id: gid, role: 'guest', text, vi: '', typing: false, displayText: text, editing: false }];
      // Kick off generate after state settles
      setTimeout(() => generate(gid, text), 0);
      return { ...prev, messages: newMessages, draft: '' };
    });
  }, [generate]);

  // ── property CRUD ──
  const selectProp = (id: string) => {
    setS(prev => ({ ...prev, propId: id }));
    persistPropId(id);
  };
  const selectTone = (t: Tone) => {
    setS(prev => ({ ...prev, tone: t }));
    persistTone(t);
  };
  const start = () => {
    setS(prev => {
      if (!prev.propId) return prev;
      if (startRef.current) clearTimeout(startRef.current);
      startRef.current = setTimeout(() => setS(p => ({ ...p, screen: 'chat' })), 1900);
      return { ...prev, screen: 'loading' };
    });
  };
  const changeProp = () => setS(prev => ({ ...prev, screen: 'setup', railOpen: false }));
  const newConv = () => setS(prev => ({ ...prev, messages: [] }));
  const toggleRail = () => setS(prev => ({ ...prev, railOpen: !prev.railOpen }));
  const closeRail = () => setS(prev => ({ ...prev, railOpen: false }));
  const toggleInfo = () => setS(prev => ({ ...prev, showInfo: !prev.showInfo, infoSaved: false, railOpen: false }));

  const updateProp = (id: string, patch: Partial<Property>) => {
    setS(prev => {
      const properties = prev.properties.map(p => p.id === id ? { ...p, ...patch } : p);
      return { ...prev, properties };
    });
  };
  const saveInfo = () => {
    setS(prev => {
      persistProperties(prev.properties);
      return { ...prev, infoSaved: true };
    });
    setTimeout(() => setS(p => ({ ...p, infoSaved: false })), 1400);
  };

  const openAdd = () => setS(prev => ({ ...prev, showAdd: true, addName: '', addAddress: '', addContext: NEW_TEMPLATE }));
  const cancelAdd = () => setS(prev => ({ ...prev, showAdd: false, addName: '', addAddress: '', addContext: '' }));

  const addProperty = () => {
    setS(prev => {
      const name = (prev.addName || '').trim();
      if (!name) return prev;
      const addr = (prev.addAddress || '').trim();
      const body = (prev.addContext || NEW_TEMPLATE).trim();
      const id = 'p' + Date.now();
      const context = `Tên nhà: ${name}\nĐịa chỉ: ${addr || '(điền địa chỉ đầy đủ)'}\n\n${body}`;
      const prop: Property = { id, name, short: name, mono: makeMono(name), address: addr, context };
      const properties = [...prev.properties, prop];
      persistProperties(properties);
      persistPropId(id);
      return { ...prev, properties, propId: id, showAdd: false, addName: '', addAddress: '', addContext: '' };
    });
  };

  const askDelete = (id: string) => setS(prev => ({ ...prev, confirmDeleteId: id }));
  const cancelDelete = () => setS(prev => ({ ...prev, confirmDeleteId: null }));
  const deleteProperty = (id: string) => {
    setS(prev => {
      const properties = prev.properties.filter(p => p.id !== id);
      persistProperties(properties);
      let propId = prev.propId;
      if (propId === id) {
        propId = properties[0]?.id ?? null;
        persistPropId(propId);
      }
      return { ...prev, properties, propId, confirmDeleteId: null };
    });
  };

  // ── message actions ──
  const regenerate = (hid: string) => {
    setS(prev => {
      const idx = prev.messages.findIndex(m => m.id === hid);
      if (idx < 1) return prev;
      const guest = prev.messages[idx - 1];
      if (!guest || guest.role !== 'guest') return prev;
      const messages = prev.messages.filter(m => m.id !== hid);
      setTimeout(() => generate(guest.id, guest.text), 0);
      return { ...prev, messages };
    });
  };

  const copyText = (text: string, id: string) => {
    try { navigator.clipboard.writeText(text); } catch { /* ok */ }
    setS(prev => ({ ...prev, copiedId: id }));
    if (copyRef.current) clearTimeout(copyRef.current);
    copyRef.current = setTimeout(() => setS(p => ({ ...p, copiedId: null })), 1400);
  };

  const saveMsg = (msg: Message) => {
    setS(prev => {
      const idx = prev.messages.findIndex(m => m.id === msg.id);
      const guest = idx > 0 ? prev.messages[idx - 1] : null;
      const t = guest ? guest.text : msg.text;
      const title = t.length > 48 ? t.slice(0, 48) + '…' : t;
      const item: SavedReply = { id: 'sv' + Date.now(), propId: prev.propId || '', title, text: msg.text };
      const saved = [item, ...prev.saved];
      persistSaved(saved);
      setTimeout(() => setS(p => ({ ...p, savedFlashId: null })), 1500);
      return { ...prev, saved, savedFlashId: msg.id };
    });
  };

  const insertSaved = (item: SavedReply) => {
    setS(prev => {
      const hid = 'h' + Date.now();
      return {
        ...prev,
        railOpen: false,
        messages: [...prev.messages, { id: hid, role: 'host', text: item.text, displayText: item.text, typing: false, vi: '', editing: false }],
      };
    });
  };

  const deleteSaved = (id: string) => {
    setS(prev => {
      const saved = prev.saved.filter(x => x.id !== id);
      persistSaved(saved);
      return { ...prev, saved };
    });
  };

  const editMsg = (id: string) => setS(prev => ({ ...prev, messages: prev.messages.map(m => m.id === id ? { ...m, editing: true } : m) }));
  const updateMsgText = (id: string, val: string) => setS(prev => ({ ...prev, messages: prev.messages.map(m => m.id === id ? { ...m, text: val, displayText: val } : m) }));
  const finishEdit = (id: string) => setS(prev => ({ ...prev, messages: prev.messages.map(m => m.id === id ? { ...m, editing: false } : m) }));

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const curProp = s.properties.find(p => p.id === s.propId) || { name: '–', short: '–', mono: '•', address: '', context: '', id: '', short2: '' } as unknown as Property;

  const commonProps = { s, theme, curProp };

  if (s.screen === 'pin') return <PinScreen theme={theme} onSuccess={validatePin} />;
  if (s.screen === 'welcome') return <WelcomeScreen theme={theme} />;
  if (s.screen === 'loading') return <LoadingScreen theme={theme} curProp={curProp} />;
  if (s.screen === 'setup') return (
    <SetupScreen
      s={s}
      theme={theme}
      onSelectProp={selectProp}
      onSelectTone={selectTone}
      onStart={start}
      onOpenAdd={openAdd}
      onCancelAdd={cancelAdd}
      onAddName={n => setS(prev => ({ ...prev, addName: n }))}
      onAddAddress={a => setS(prev => ({ ...prev, addAddress: a }))}
      onAddContext={c => setS(prev => ({ ...prev, addContext: c }))}
      onAddProperty={addProperty}
      onAskDelete={askDelete}
      onCancelDelete={cancelDelete}
      onConfirmDelete={deleteProperty}
    />
  );

  return (
    <ChatWorkspace
      s={s}
      theme={theme}
      curProp={curProp}
      scrollRef={scrollRef}
      onChangeProp={changeProp}
      onToggleInfo={toggleInfo}
      onToggleRail={toggleRail}
      onCloseRail={closeRail}
      onToneChange={selectTone}
      onNewConv={newConv}
      onDraftChange={d => setS(prev => ({ ...prev, draft: d }))}
      onKey={onKey}
      onSend={send}
      onCopyMsg={(text, id) => copyText(text, id)}
      onSaveMsg={saveMsg}
      onEditMsg={editMsg}
      onUpdateMsgText={updateMsgText}
      onFinishEdit={finishEdit}
      onRegen={regenerate}
      onInsertSaved={insertSaved}
      onCopySaved={(text, id) => copyText(text, id)}
      onDeleteSaved={deleteSaved}
      onNameChange={v => updateProp(s.propId || '', { name: v, short: v })}
      onAddressChange={v => updateProp(s.propId || '', { address: v })}
      onContextChange={v => updateProp(s.propId || '', { context: v })}
      onSaveInfo={saveInfo}
    />
  );
}
