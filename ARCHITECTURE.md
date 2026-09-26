# FormSaathi — Architecture

---

## 1. Overview

FormSaathi is a Next.js application. There is no separate backend. All server-side logic, including Sarvam API calls, runs as Next.js API routes.

**Key constraint:** The MVP requires no database. All government service information is stored as static JSON in the repository. A database would be added only if persistent user sessions or community contributions become a requirement.

```
DECISION: No database for MVP
WHY: Service information is static structured data. A database adds operational complexity with no user-facing benefit at MVP scale.
ALTERNATIVES: SQLite, Supabase, PostgreSQL
TRADE-OFF: Adding sessions or user history later will require adding a database; this is a known future cost.
```

---

## 2. Technology Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | Next.js 14 (App Router) | SSR, API routes, TypeScript, React — single deployment unit |
| Language | TypeScript | Type safety for service data schemas and API contracts |
| Styling | Tailwind CSS | Mobile-first, utility-first, no CSS file sprawl |
| Sarvam SDK | `sarvamai` (official Python SDK is available; use official JS/TS client or REST directly) | Official client |
| Storage | Static JSON files | No database needed for MVP service data |
| Deployment | Vercel (recommended) or any Node.js host | Native Next.js support |

```
DECISION: Next.js App Router (not Pages Router)
WHY: App Router is the current Next.js default and better suited for server components and route handlers.
ALTERNATIVES: Pages Router (older, still supported)
TRADE-OFF: App Router has a slightly steeper learning curve but aligns with Next.js's current direction.
```

---

## 3. Project Structure

```
formsaathi/
│
├── app/
│   ├── layout.tsx                    # Root layout, language context
│   ├── page.tsx                      # Landing page — service selection
│   ├── services/
│   │   └── [serviceId]/
│   │       └── page.tsx              # Service page (DL, Voter ID, Passport, Aadhaar)
│   └── api/
│       ├── chat/
│       │   └── route.ts              # POST: Sarvam chat completion (server-side)
│       ├── stt/
│       │   └── route.ts              # POST: Sarvam speech-to-text (server-side)
│       └── tts/
│           └── route.ts              # POST: Sarvam text-to-speech (server-side)
│
├── components/
│   ├── ServiceCard.tsx               # Landing page service tile
│   ├── ServicePage/
│   │   ├── ServiceHeader.tsx
│   │   ├── AtAGlance.tsx
│   │   ├── DocumentChecklist.tsx
│   │   ├── StepByStep.tsx
│   │   ├── OfficialHandoff.tsx
│   │   ├── FAQ.tsx
│   │   └── AskFormSaathi.tsx         # Voice/text input + response display
│   ├── VoiceInput.tsx                # Microphone button, recording state
│   ├── AudioPlayer.tsx               # TTS audio playback
│   └── LanguageSelector.tsx
│
├── lib/
│   ├── sarvam/
│   │   ├── stt.ts                    # STT API wrapper
│   │   ├── tts.ts                    # TTS API wrapper
│   │   └── chat.ts                   # Chat completion wrapper
│   ├── services/
│   │   └── loader.ts                 # Load and validate service JSON
│   └── types.ts                      # Shared TypeScript types
│
├── data/
│   └── services/
│       ├── driving-licence.json
│       ├── voter-id.json
│       ├── passport.json
│       └── aadhaar-update.json
│
├── public/
│   └── icons/
│
├── tests/
│   ├── services/                     # Validate service JSON schema
│   └── api/                          # Route handler tests
│
├── CLAUDE.md
├── PRODUCT_SPEC.md
├── ARCHITECTURE.md
├── DEMO_SCRIPT.md
├── .env.example
├── .env                              # gitignored
├── .gitignore
├── package.json
└── tsconfig.json
```

---

## 4. Service Data Model

Each government service is a single JSON file. The application reads these at build time (static) or request time.

```typescript
interface ServiceDocument {
  id: string;
  name: string;
  name_ta: string;                      // Tamil name
  description: string;
  description_ta: string;
  eligibility: EligibilityItem[];
  steps: Step[];
  documents: DocumentItem[];
  fees: FeeItem[];
  official_urls: OfficialURL[];
  common_questions: FAQ[];
  important_notes: string[];
  last_verified: string;                 // ISO date YYYY-MM-DD
  official_source_names: string[];
}

interface DocumentItem {
  id: string;
  name: string;
  name_ta: string;
  why_needed: string;
  acceptable_proofs: string[];
  caveats: string[];
  how_to_obtain?: string;
}

interface Step {
  number: number;
  title: string;
  title_ta: string;
  description: string;
  description_ta: string;
  action_url?: string;
  is_government_action: boolean;        // true = user must go to official site
}

interface FAQ {
  question: string;
  question_ta: string;
  answer: string;
  answer_ta: string;
}

interface OfficialURL {
  label: string;
  url: string;
  description: string;
}
```

```
DECISION: Static JSON for service data (not database, not CMS)
WHY: Government service information changes infrequently. Static files are version-controlled, reviewable, and require no runtime infrastructure.
ALTERNATIVES: Headless CMS, database table
TRADE-OFF: Updates require a code deployment. Acceptable for MVP where information is manually verified.
```

---

## 5. Sarvam API Integration

All Sarvam API calls originate from Next.js API routes. The frontend never touches the Sarvam API key.

### 5.1 Speech-to-Text Route

```
POST /api/stt
Content-Type: multipart/form-data

Body: audio file (WAV, MP3, OGG, etc.)
      language: "ta-IN" | "en-IN" | "auto"

Response: { transcript: string, detected_language: string }
```

**Internal:** Calls Sarvam `/speech-to-text` with model `saaras:v3`, mode `codemix` for Tamil context (handles Tamil+English mixing).

**Error handling:** If STT fails, return 503 with a message that tells the frontend to fall back to text input.

### 5.2 Text-to-Speech Route

```
POST /api/tts
Content-Type: application/json

Body: { text: string, language: "ta-IN" | "en-IN" }

Response: audio/mpeg stream
```

**Internal:** Calls Sarvam `/text-to-speech` (Bulbul v3) with an appropriate voice for the selected language.

**Error handling:** If TTS fails, return 503. Frontend shows text response; no audio is played.

### 5.3 Chat Route

```
POST /api/chat
Content-Type: application/json

Body: {
  message: string,
  serviceId: string,
  language: "en-IN" | "ta-IN",
  history: { role: "user" | "assistant", content: string }[]
}

Response: { reply: string }
```

**Internal:**
1. Load service JSON for `serviceId`
2. Build system prompt: elder-sister persona + service facts injected as structured context + explicit instructions not to invent government data
3. Call `sarvam-105b-conversations`
4. Return reply

**Prompt structure:**
```
You are FormSaathi, a helpful guide for young Indians navigating government processes.
You speak like an informed elder sister — clear, patient, practical, non-judgmental.

You are answering questions about: [service name]

Here is the verified information for this service:
[service JSON injected here]

Rules:
- Only use facts from the service information above.
- If you don't know, say: "I don't have verified information for that. Check the official source."
- Do not invent URLs, fees, document requirements, or eligibility rules.
- Respond in [language].
- Keep responses short and practical.
```

```
DECISION: Inject service JSON into LLM context at request time
WHY: Prevents hallucination of government facts. LLM explains and simplifies; it does not generate policy.
ALTERNATIVES: Fine-tuning, RAG with vector store
TRADE-OFF: Context window cost per request. Acceptable for MVP given service JSON files are small (~3–8KB each).
```

---

## 6. Frontend Architecture

### 6.1 Language Context

A React context (`LanguageContext`) stores the user's selected language (`"en-IN"` | `"ta-IN"`). This is read by:
- Service page components (to display Tamil or English content)
- API calls (to set `language` parameter)
- TTS calls (to select the right voice)

Language preference is persisted to `localStorage` for return visits.

### 6.2 Service Page State

The `AskFormSaathi` component manages:

```
IDLE → RECORDING → TRANSCRIBING → THINKING → RESPONDING → PLAYING_AUDIO → IDLE
                                                         ↘ TEXT_ONLY (TTS failed)
```

- **RECORDING:** Microphone open, audio captured via Web Audio API
- **TRANSCRIBING:** Audio sent to `/api/stt`
- **THINKING:** Transcript (or typed text) sent to `/api/chat`
- **RESPONDING:** Response text displayed
- **PLAYING_AUDIO:** Response sent to `/api/tts`, audio played
- **TEXT_ONLY:** TTS failed; text shown, no audio

### 6.3 Progressive Disclosure

Service pages do not dump all information at once:

```
Overview (always visible)
    ↓
"See what you'll need" → Document checklist expands
    ↓
"See how it works" → Step-by-step expands
    ↓
"Open official website" → Handoff screen
```

Users can skip directly to any section.

---

## 7. Security

| Concern | Mitigation |
|---------|------------|
| API key exposure | `SARVAM_API_KEY` in `.env`, read server-side only, never sent to browser |
| Sensitive user data logging | No user input is logged; audio is not stored |
| Injected government URL fabrication | All official URLs come from static JSON, not LLM output |
| LLM hallucination of government facts | Service JSON injected into prompt; LLM instructed to refuse unknown facts |
| Stack trace exposure | Error responses to frontend contain only user-facing messages |

---

## 8. Error Handling

| Failure | Behaviour |
|---------|-----------|
| STT API fails | Show text input; display: "Voice recognition isn't working right now. Type your question instead." |
| TTS API fails | Show text response; no audio; display: "Audio playback isn't available right now. Here's the answer as text." |
| Chat API fails | Show retry button; preserve user's question; display: "Something went wrong. Try again in a moment." |
| Network offline | Preserve user input; show connectivity message |
| Service JSON not found | Show: "Service information isn't available. Go directly to the official source." + official URL |
| Unknown language input | Respond in English; explain: "I currently support English and Tamil." |

---

## 9. Data Flow Diagram

```
User speaks
    │
    ▼
[Browser: Web Audio API]
    │ audio blob
    ▼
[/api/stt route]
    │ audio → Sarvam /speech-to-text (saaras:v3)
    │ ← transcript
    ▼
[/api/chat route]
    │ transcript + service JSON → Sarvam sarvam-105b-conversations
    │ ← reply text
    ▼
[/api/tts route]
    │ reply text → Sarvam /text-to-speech (bulbul:v3)
    │ ← audio stream
    ▼
[Browser: AudioPlayer]
    │
    ▼
User hears response
```

Text input bypasses the STT step and goes directly to `/api/chat`.

---

## 10. Routing

| Route | Purpose |
|-------|---------|
| `/` | Landing page: language selection + service selection |
| `/services/driving-licence` | Driving Licence guide |
| `/services/voter-id` | Voter ID guide |
| `/services/passport` | Passport guide |
| `/services/aadhaar-update` | Aadhaar Update guide |
| `/api/stt` | Server: speech-to-text proxy |
| `/api/tts` | Server: text-to-speech proxy |
| `/api/chat` | Server: chat completion proxy |

---

## 11. Environment Variables

```
# .env.example
SARVAM_API_KEY=          # Required. Get from dashboard.sarvam.ai
```

No other environment variables are required for MVP.

---

## 12. Testing

| Layer | Approach |
|-------|---------|
| Service JSON | Schema validation tests — ensure all required fields present, URLs are non-empty strings, last_verified is a valid date |
| API routes | Unit tests for error handling paths (Sarvam API failure, missing fields) |
| Component | Key user flows: service selection, document checklist, voice input states |
| E2E | Demo path: landing → Tamil → Driving Licence → ask question → handoff |

---

## 13. Deployment

**Recommended:** Vercel

- Environment variable `SARVAM_API_KEY` set in Vercel project settings
- No database to provision
- Static service JSON bundled with the build

Alternatively: any Node.js host capable of running Next.js.

---

## 14. Implementation Phases

| Phase | Deliverable |
|-------|-------------|
| 1 | Service JSON data for all 4 services (verified information) |
| 2 | Core UI: landing, service pages, document checklist, step-by-step, official handoff |
| 3 | Chat integration: `/api/chat` route + `AskFormSaathi` component (text input first) |
| 4 | Voice input: `/api/stt` + microphone capture |
| 5 | Voice output: `/api/tts` + audio playback |
| 6 | Tamil language: translations in service JSON + language switching |
| 7 | Testing, mobile polish, error states, accessibility |
| 8 | Demo script |

---

*Last updated: 2026-09-26*
