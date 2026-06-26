export interface Property {
  id: string;
  name: string;
  short: string;
  mono: string;
  address: string;
  context: string;
}

export interface Message {
  id: string;
  role: 'guest' | 'host';
  text: string;
  vi: string;
  typing: boolean;
  displayText: string;
  editing: boolean;
}

export interface SavedReply {
  id: string;
  propId: string;
  title: string;
  text: string;
}

export type Screen = 'pin' | 'welcome' | 'setup' | 'loading' | 'chat';
export type Tone = 'friendly' | 'professional' | 'concise';

export interface ReplyResponse {
  guest_language: string;
  guest_vi: string;
  reply: string;
  reply_language: string;
  reply_vi: string;
}

export interface AppState {
  screen: Screen;
  propId: string | null;
  tone: Tone;
  properties: Property[];
  messages: Message[];
  saved: SavedReply[];
  draft: string;
  generating: boolean;
  showInfo: boolean;
  showAdd: boolean;
  addName: string;
  addAddress: string;
  addContext: string;
  confirmDeleteId: string | null;
  copiedId: string | null;
  savedFlashId: string | null;
  railOpen: boolean;
  infoSaved: boolean;
}
