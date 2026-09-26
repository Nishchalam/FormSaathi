# FormSaathi — Product Specification

> **Your elder sister for becoming an adult.**
> FormSaathi is a multilingual, voice-friendly guide for young Indians navigating government identity processes.

---

## 1. Problem

Turning 18 in India unlocks a set of administrative responsibilities — Driving Licence, Voter ID, Passport, Aadhaar updates — that most young adults have no context for. Government websites are dense, bureaucratic, and assume prior knowledge. Family members may not know the current process. The result is that first-time applicants waste time, make mistakes, or avoid the process entirely.

**FormSaathi closes the gap between "I have no idea how to do this" and "I know exactly what I need to do, and I can do it myself."**

---

## 2. Users

**Primary:** Indians aged 18–25 handling a government process for the first time.

**Typical scenarios:**
- First-time voter registering before an election
- Student applying for a driving licence after passing Class 12
- Young adult living away from family needing a passport
- User updating Aadhaar address after moving cities

**Assumptions about users:**
- May have little or no experience with government websites
- May not know bureaucratic terminology (RTO, gazette, affidavit, Tatkal)
- May be unsure which documents are required or acceptable
- May have difficulty distinguishing official from unofficial websites
- May prefer to interact in Tamil, Hindi, or code-mixed language rather than formal English
- Primary device is almost certainly a phone

---

## 3. Core User Promise

After using FormSaathi, a user must be able to answer:

1. **What do I need to do?**
2. **What do I need before I start?**
3. **Where do I actually do it?**
4. **What should I do next?**

---

## 4. User Journey

```
Open FormSaathi
      ↓
Select language (English / Tamil)
      ↓
Select service
      ↓
Read overview in plain language
      ↓
Review document checklist
      ↓
Read step-by-step process
      ↓
Ask a question (voice or text)
      ↓
Open official government website
      ↓
Complete the actual application on the government site
      ↓
Return to FormSaathi if stuck
      ↓
Ask about next steps
```

FormSaathi is the guide beside the user — not the government portal in disguise.

---

## 5. MVP Scope

### 5.1 Driving Licence
- Learner's licence and full driving licence process
- Eligibility (age, documents)
- Required documents (age proof, address proof, photo, existing licence for DL upgrade)
- Process steps: apply online via Parivahan, book slot, learner's test, wait period, driving test
- Official portal: parivahan.gov.in
- Common questions: What is RTO? Do I need to visit in person? What if my test fails?

### 5.2 Voter ID (EPIC)
- Eligibility: Indian citizen, 18+, residency
- Registration via National Voters' Service Portal (voters.eci.gov.in)
- Documents: age proof, address proof, photo
- Process: Form 6 online, verification, card delivery
- Common questions: What if I am a student living away from home? Can I register at college address?

### 5.3 Passport
- Fresh passport vs renewal
- Application via Passport Seva (passportindia.gov.in)
- Document requirements: Aadhaar, address proof, birth certificate/Class 10 certificate
- Appointment booking, police verification, dispatch
- Tatkal option
- Common questions: What is police verification? How long does it take? Do I need an address proof matching my current address?

### 5.4 Aadhaar Updates
- Updateable fields: name, address, phone, email, photo, date of birth (limited)
- Online updates via myAadhaar portal (myaadhaar.uidai.gov.in)
- Offline updates requiring Aadhaar Enrolment Centre visit
- Required supporting documents per field
- Common questions: Can I update my address if I rent? Do I need to visit a centre?

---

## 6. Non-Goals (MVP)

- Submitting government applications on behalf of users
- Government login or OTP automation
- CAPTCHA solving
- Payment processing
- Legal advice
- Universal government services database
- Complex user accounts
- Social or community features
- Gamification

---

## 7. Sarvam AI Integration

FormSaathi uses Sarvam where Indian-language and voice interaction genuinely improve accessibility.

### 7.1 Speech-to-Text — Saaras v3
- **Endpoint:** `POST /speech-to-text`
- **Model:** `saaras:v3`
- **Mode:** `transcribe` (spoken language output), `codemix` (code-mixed Tamil+English)
- **Use:** Convert user voice questions into text for processing
- **Fallback:** Text input always available; STT failure is non-fatal

### 7.2 Text-to-Speech — Bulbul v3
- **Endpoint:** `POST /text-to-speech` (REST) or streaming
- **Use:** Read FormSaathi responses aloud in Tamil or English
- **Voices:** Select appropriate Indian-language voice per user's language
- **Fallback:** Display text response if TTS fails; user can replay

### 7.3 Chat Completion — Sarvam-105B
- **Model:** `sarvam-105b-conversations`
- **Use:** Answer user questions in context of the selected service, using verified structured service data as context
- **Constraint:** LLM explains and simplifies structured facts; it does not generate government policy
- **Prompt design:** System prompt includes the service JSON, the elder-sister persona, and explicit prohibition on hallucinating facts

### 7.4 Translation — Sarvam-Translate / Mayura
- **Model:** `sarvam-translate:v1` (long-form), `mayura:v1` (short text, transliteration)
- **Use:** Translate UI labels, document explanations, and service summaries into Tamil
- **Note:** Where possible, maintain Tamil translations in static service data rather than translating at runtime

---

## 8. Language Support (MVP)

| Language | UI | Voice Input | Voice Output | Chat |
|----------|-----|------------|-------------|------|
| English  | ✓   | ✓          | ✓           | ✓    |
| Tamil    | ✓   | ✓          | ✓           | ✓    |

Code-mixed input (Tamil + English) is supported via Saaras v3's `codemix` mode.

Architecture supports future addition of Hindi, Telugu, Kannada, Malayalam, and all other languages supported by Sarvam APIs.

---

## 9. Persona

FormSaathi's voice is:

| Prefer | Avoid |
|--------|-------|
| "Keep these documents ready before you start. It'll save you a trip later." | "The applicant is required to furnish the aforementioned documents." |
| "This field is asking for the address where you currently live." | "Enter your present residential address." |
| Clear, patient, practical | Formal, bureaucratic, condescending |
| Direct | Over-emotional, infantilizing |

The elder sister metaphor is a UX principle, not a literal persona claim.

---

## 10. Service Page Structure

Each service page contains:

1. **Header** — What this service is and who it's for
2. **At a glance** — Prerequisites, stages, appointment needed?
3. **What you'll need** — Document checklist with plain-language explanations per document
4. **How it works** — Step-by-step process in simple language
5. **Official website** — Explicit handoff with a clear "You are now leaving FormSaathi" notice
6. **Common questions** — FAQ section for recurring confusion points
7. **Ask FormSaathi** — Voice or text question input within the service context

---

## 11. Official Website Handoff

When the user is ready to proceed:

> You're ready to continue. This next step happens on the official government website. You'll complete the actual application there — we'll explain what to expect, but the steps are yours to take.
>
> **[Open Official Website]**

The user must never be unclear that they are leaving FormSaathi.

---

## 12. Information Freshness

Each service has a `last_verified` date. This is visible to the user where procedural information is presented:

> *This information was last verified on [date]. Government procedures can change — check the official source if anything looks different.*

FormSaathi never silently presents outdated information as current fact.

---

## 13. Privacy

**Collected:** Language preference, selected service (session only)

**Not collected:**
- Aadhaar number
- Passport number
- Date of birth
- Government credentials
- OTPs
- Voice audio (audio processed by Sarvam API, not stored by FormSaathi)

Audio sent to Sarvam STT API is not stored in FormSaathi's own database. Users are not required to create accounts for MVP.

---

## 14. Security

- `SARVAM_API_KEY` lives server-side only, never in frontend code
- All Sarvam API calls are made from Next.js API routes (server)
- `.env` is gitignored; `.env.example` provided
- No sensitive user data is logged

---

## 15. Accessibility

- Voice interaction as first-class mode
- Text always available as fallback
- Large readable text, strong contrast
- Mobile-first layout
- Short explanations, progressive disclosure
- No wall-of-text information dumps

---

## 16. Success Criteria

The MVP succeeds when a new 18+ user can:

1. Open FormSaathi on a phone
2. Understand what it does without reading documentation
3. Select a government service
4. Understand the purpose and process in plain language
5. See exactly what documents they need (with explanations)
6. Ask a question by voice and receive an audible answer
7. Navigate to the correct official website
8. Understand what happens after leaving FormSaathi
9. Return and ask a follow-up question if confused

**Core measure:** "I didn't know how to do this before, but now I know what I need, where to go, and what to do next."

---

## 17. Out of Scope (Explicitly)

FormSaathi does NOT:
- Pretend to be an official government service
- Submit applications on behalf of users
- Handle government OTPs or logins
- Invent eligibility requirements, fees, or URLs
- Store Aadhaar numbers, passport numbers, or identity documents
- Bypass government verification mechanisms

---

*Last updated: 2026-09-26*
