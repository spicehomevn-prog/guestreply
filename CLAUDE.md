# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Trợ Lý Trả Lời Khách — Guest Response Assistant

A Next.js app that helps SpiceHome hosts draft AI-powered replies to guest messages. Uses Claude claude-haiku-4-5 as a JSON API for reply generation with bilingual (vi/en) support.

## Development Commands

Run from `tro-ly-tra-loi-khach/`:

```bash
npm run dev        # Dev server at localhost:3000
npm run build      # Production build
npm run lint       # ESLint check
node node_modules/typescript/lib/tsc.js --noEmit   # Type-check
```

**Windows note:** `npx` is broken in this environment. Use `node node_modules/...` directly.

Requires `.env.local` with `ANTHROPIC_API_KEY=sk-ant-...` (see `.env.local.example`).

## Architecture

**Single-page app** — all UI is one route (`/`), orchestrated by `App.tsx`.

### Screen flow
`welcome` (2.4s auto-advance) → `setup` (property/tone select) → `loading` (1.9s) → `chat`

### Key files

| File | Role |
|------|------|
| `components/App.tsx` | Central state machine — `AppState`, all handlers, timers, typewriter |
| `components/ChatWorkspace.tsx` | Chat layout: left rail (property + saved library) + center message list |
| `components/MessageBubble.tsx` | Guest (dark, right) / host (white, left) bubbles with Copy/Save/Edit/Regenerate |
| `lib/prompt.ts` | `buildPrompt()` — system prompt constructor; defines tone and language rules |
| `lib/types.ts` | All TypeScript interfaces: `Property`, `Message`, `SavedReply`, `AppState`, etc. |
| `lib/storage.ts` | localStorage persistence — keys: `sh_cs_properties`, `sh_cs_prop`, `sh_cs_tone`, `sh_cs_saved` |
| `lib/theme.ts` | Accent color (`#C4773B`), density modes (Compact/Normal/Loose), bubble shape presets |
| `app/api/reply/route.ts` | POST handler — calls Claude API and returns `ReplyResponse` JSON |

### API contract (`/api/reply`)

**Request:** `{ property: Property, tone: Tone, guestMessage: string }`

**Response:** `{ guest_language, guest_vi, reply, reply_language, reply_vi }`

- Vietnamese guest input → Vietnamese reply, empty `guest_vi`/`reply_vi`
- English/other input → English reply + Vietnamese translations in `guest_vi`/`reply_vi`

### State management

`App.tsx` holds all state in `AppState` via `useState`. No external state library. `setS()` is a partial-update helper (like `setState` in class components). The `typeOut()` function animates reply text character-by-character at ~1 char/ms.

## Design tokens

Colors match the main SpiceHome site:
- Accent: `#C4773B` (terracotta)
- Dark: `#1A1A18`
- Background: `#FAFAF8`

Responsive breakpoint: ≤760px → mobile layout (rail slides in as overlay).

## Prompt rules (critical)

- Claude is instructed to output **only valid JSON** — no markdown, no prose
- "Never invent wifi passwords, prices, addresses, or details not written in property context"
- Tone variants: `friendly` (≤1 emoji 🏡), `professional` (minimal emoji), `concise` (1–3 sentences, no emoji)
- Do not mention the colour red
