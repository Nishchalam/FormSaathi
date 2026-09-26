# FormSaathi — Claude Code Project Instructions

## 1. PROJECT IDENTITY

Project name: **FormSaathi**
Tagline: *Your elder sister for becoming an adult.*

FormSaathi is a multilingual, voice-friendly guide for young Indians transitioning into adulthood. The application helps users understand and navigate important government and identity-related tasks such as:

- Driving Licence
- Voter ID
- Passport
- Aadhaar updates

The application explains:
- What the user needs to do
- Why they need to do it
- Which documents they need
- What the steps are
- Which official website or service they should use
- What to expect at each stage
- What to do if they get stuck

The application does **NOT** perform government transactions on behalf of the user. The user remains in control and performs the actual government application themselves.

---

## 2. CORE PRODUCT PRINCIPLE

FormSaathi exists because turning 18 comes with many administrative responsibilities that are rarely explained clearly.

The product should feel like:
> "An informed elder sister who has already gone through this and tells you what you need to know."

It should **NOT** feel like:
- A government website
- A government employee
- A lawyer
- A generic AI chatbot
- A form-filling bot
- An autonomous agent
- A bureaucratic instruction manual

---

## 3. CORE USER PROMISE

The user should be able to answer four questions after using FormSaathi:
1. What do I need to do?
2. What do I need before I start?
3. Where do I actually do it?
4. What should I do next?

---

## 4. TARGET USERS

Primary audience: Young Indians aged 18+ beginning to handle government and identity-related processes independently.

Do not assume the user is technically sophisticated.

---

## 5. MVP SERVICES

- **Driving Licence** — Learner's licence, full licence, Parivahan
- **Voter ID** — EPIC registration, voters.eci.gov.in
- **Passport** — Fresh/renewal, Passport Seva, passportindia.gov.in
- **Aadhaar Updates** — Address, name, phone, UIDAI, myaadhaar.uidai.gov.in

---

## 6. PRODUCT BOUNDARY

FormSaathi is a navigator and explainer.

```
USER → UNDERSTAND → PREPARE → OPEN OFFICIAL SERVICE → USER PERFORMS THE ACTION
→ RETURN TO FORMSAATHI IF NEEDED → UNDERSTAND THE NEXT STEP
```

Do not convert FormSaathi into an autonomous government-services agent.

---

## 7. WHAT FORMSAATHI MUST NOT DO

1. Pretend to be an official government service
2. Submit government applications on behalf of users
3. Invent government procedures, URLs, fees, or eligibility requirements
4. Store Aadhaar numbers, passport numbers, or other sensitive identifiers
5. Handle OTPs, government logins, or CAPTCHAs
6. Log API keys, passwords, or private audio
7. Present uncertain information as verified fact

---

## 8. SARVAM AI INTEGRATION

Use only capabilities supported by current official Sarvam documentation.

**Relevant APIs:**
- **Speech-to-Text:** Saaras v3, `/speech-to-text`, mode `codemix` for Tamil+English
- **Text-to-Speech:** Bulbul v3, `/text-to-speech`, 30+ Indian-language voices
- **Chat Completion:** `sarvam-105b-conversations`
- **Translation:** `sarvam-translate:v1` (long-form), `mayura:v1` (short text)

All Sarvam API calls must be server-side only. `SARVAM_API_KEY` must never appear in frontend code.

---

## 9. TECH STACK

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Data:** Static JSON in `data/services/`
- **Backend:** Next.js API routes (no separate backend)
- **Database:** None for MVP

---

## 10. LANGUAGE SUPPORT

MVP: English + Tamil. Architecture must support future addition of other Indian languages.

---

## 11. PERSONA

- Clear, patient, practical, non-judgmental
- Direct — not bureaucratic, not infantilizing
- "Elder sister" is a UX metaphor, not a literal persona claim

---

## 12. SECURITY

- `SARVAM_API_KEY` in `.env`, server-side only
- `.env` is gitignored; `.env.example` provided
- No sensitive user data logged

---

## 13. PRIVACY

- No Aadhaar numbers, passport numbers, OTPs, or government credentials collected
- Audio processed by Sarvam STT API only; not stored by FormSaathi
- No user accounts required for MVP

---

## 14. DEVELOPMENT PROCESS

Work incrementally. Do not generate the complete application in one step.

**Phases:**
1. Service data (4 JSON files)
2. Core UI (landing, service pages, document checklist, step guide, handoff)
3. Chat integration (text first)
4. Voice input (STT)
5. Voice output (TTS)
6. Tamil language support
7. Testing, mobile polish, error states
8. Demo script

**At every significant architectural decision, document:**
```
DECISION:
WHY:
ALTERNATIVES:
TRADE-OFF:
```

---

## 15. DEFINITION OF DONE

MVP is complete when a new 18+ user can:
1. Open FormSaathi on a phone
2. Select a government service
3. Understand the process in plain language
4. See what documents they need (with explanations)
5. Ask a question by voice and receive an audible answer
6. Navigate to the correct official website
7. Return and ask a follow-up question if confused

---

*See PRODUCT_SPEC.md and ARCHITECTURE.md for full details.*
