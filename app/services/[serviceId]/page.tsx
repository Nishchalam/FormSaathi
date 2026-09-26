"use client";

import Link from "next/link";
import { notFound, useParams, useSearchParams } from "next/navigation";
import { useState } from "react";

type Lang = "en" | "ta" | "hi" | "te";

interface ServiceData {
  icon: string;
  gradient: string;
  titles: Record<Lang, string>;
  taglines: Record<Lang, string>;
  who: string;
  stages: string[];
  appointment: boolean;
  documents: { name: string; why: string }[];
  steps: { title: string; desc: string; isGovt?: boolean }[];
  officialUrl: string;
  officialName: string;
  faqs: { q: string; a: string }[];
  lastVerified: string;
}

const services: Record<string, ServiceData> = {
  "driving-licence": {
    icon: "🚗",
    gradient: "from-orange-400 to-red-500",
    titles: {
      en: "Driving Licence",
      ta: "ஓட்டுநர் உரிமம்",
      hi: "ड्राइविंग लाइसेंस",
      te: "డ్రైవింగ్ లైసెన్స్",
    },
    taglines: {
      en: "Getting your first driving licence? Here's what you'll need and what happens at each stage.",
      ta: "முதல் முறையாக ஓட்டுநர் உரிமம் பெறுகிறீர்களா? ஒவ்வொரு கட்டத்திலும் என்ன நடக்கும் என்பதை இங்கே பாருங்கள்.",
      hi: "पहली बार ड्राइविंग लाइसेंस बना रहे हैं? हर कदम पर क्या होगा — यहाँ समझें।",
      te: "మొదటిసారి డ్రైవింగ్ లైసెన్స్ తీసుకుంటున్నారా? ప్రతి దశలో ఏమి జరుగుతుందో ఇక్కడ చూడండి.",
    },
    who: "Indian citizens aged 16+ (learner's) or 18+ (full licence)",
    stages: ["Apply online", "Learner's test", "Wait 30 days", "Driving test", "Licence issued"],
    appointment: true,
    documents: [
      { name: "Age proof", why: "The RTO needs to verify you meet the minimum age requirement. Class 10 certificate, birth certificate, Aadhaar, or passport are accepted." },
      { name: "Address proof", why: "Required to confirm your residential address. Aadhaar, voter ID, or utility bill works." },
      { name: "Passport-size photos", why: "For the licence card and the application form." },
      { name: "Medical certificate (Form 1A)", why: "Confirms you are medically fit to drive. A registered doctor can issue this." },
    ],
    steps: [
      { title: "Create account on Parivahan", desc: "Go to parivahan.gov.in → register with your mobile number.", isGovt: true },
      { title: "Fill Learner's Licence application", desc: "Select your state and RTO, fill personal details and upload documents." },
      { title: "Pay the fee and book slot", desc: "Pay online (₹200–400 depending on vehicle type). Choose a date at your local RTO.", isGovt: true },
      { title: "Appear for the learner's test", desc: "A short computer-based test on traffic rules at the RTO. You need 57%+ to pass." },
      { title: "Wait 30 days", desc: "After your learner's licence is issued, you must wait 30 days before applying for the full DL. Use this time to practice." },
      { title: "Apply and test for full DL", desc: "Apply online again, book a slot, and appear for the practical driving test at the RTO." },
    ],
    officialUrl: "https://parivahan.gov.in/parivahan/",
    officialName: "Parivahan Sewa",
    faqs: [
      { q: "What is RTO?", a: "Regional Transport Office — the government office that handles vehicle registration and driving licences in your area." },
      { q: "Do I need to visit in person?", a: "Yes, for the tests. The application can be done online, but both tests (learner's and driving) must be done at the RTO." },
      { q: "What if I fail the test?", a: "You can reappear after 7 days. There is no limit on attempts, but each attempt may have a fee." },
    ],
    lastVerified: "2026-09-26",
  },
  "voter-id": {
    icon: "🗳️",
    gradient: "from-blue-400 to-indigo-500",
    titles: {
      en: "Voter ID (EPIC)",
      ta: "வாக்காளர் அட்டை",
      hi: "वोटर आईडी",
      te: "ఓటర్ గుర్తింపు కార్డు",
    },
    taglines: {
      en: "Registering to vote for the first time? Here's how it works.",
      ta: "முதல் முறையாக வாக்காளராக பதிவு செய்கிறீர்களா? இப்படி செய்யுங்கள்.",
      hi: "पहली बार वोटर के रूप में रजिस्ट्रेशन कर रहे हैं? यहाँ पूरी जानकारी है।",
      te: "మొదటిసారి ఓటరుగా నమోదు చేసుకుంటున్నారా? ఇలా చేయండి.",
    },
    who: "Indian citizens aged 18+ with a permanent address",
    stages: ["Fill Form 6 online", "Submit documents", "Verification", "Card issued"],
    appointment: false,
    documents: [
      { name: "Age proof", why: "To confirm you are 18 or older. Class 10 certificate, birth certificate, or Aadhaar work." },
      { name: "Address proof", why: "Your voter registration is linked to your residential address. Aadhaar, utility bill, or bank statement are accepted." },
      { name: "Passport-size photo", why: "Printed on your voter ID card." },
    ],
    steps: [
      { title: "Go to the National Voters' Service Portal", desc: "Visit voters.eci.gov.in and click 'Register as New Voter'.", isGovt: true },
      { title: "Fill Form 6", desc: "Enter your name, address, date of birth, and upload your photo and documents." },
      { title: "Submit the application", desc: "Submit online — you'll receive a reference number to track your application.", isGovt: true },
      { title: "Verification by BLO", desc: "A Booth Level Officer verifies your details, sometimes with a home visit." },
      { title: "Card dispatched", desc: "Your voter ID card is sent via post. Track status using your reference number on the portal." },
    ],
    officialUrl: "https://voters.eci.gov.in/",
    officialName: "National Voters' Service Portal",
    faqs: [
      { q: "Can I register at my college address?", a: "Yes, if you are ordinarily residing there. You can register at either your home or college address, but not both." },
      { q: "How long does it take?", a: "Usually 3–4 weeks after submission, though it can vary by state and election season." },
      { q: "What if I move to a new city?", a: "Submit Form 8A to transfer or update your address in the electoral roll." },
    ],
    lastVerified: "2026-09-26",
  },
  "passport": {
    icon: "🛂",
    gradient: "from-emerald-400 to-teal-500",
    titles: {
      en: "Passport",
      ta: "பாஸ்போர்ட்",
      hi: "पासपोर्ट",
      te: "పాస్‌పోర్ట్",
    },
    taglines: {
      en: "Applying for your first passport? Here's everything you need before you book your appointment.",
      ta: "முதல் பாஸ்போர்ட்டிற்கு விண்ணப்பிக்கிறீர்களா? அப்பாயிண்ட்மென்ட் முன்பு தெரிந்துகொள்ள வேண்டியவை இங்கே.",
      hi: "पहली बार पासपोर्ट बना रहे हैं? अपॉइंटमेंट से पहले ये सब जान लें।",
      te: "తొలిసారి పాస్‌పోర్ట్ కోసం దరఖాస్తు చేస్తున్నారా? అపాయింట్‌మెంట్ ముందు ఇవి తెలుసుకోండి.",
    },
    who: "Indian citizens of any age",
    stages: ["Apply online", "Book appointment", "Visit PSK", "Police verification", "Passport dispatched"],
    appointment: true,
    documents: [
      { name: "Proof of date of birth", why: "Class 10 certificate or birth certificate — establishes your age legally." },
      { name: "Proof of address", why: "Must reflect where you currently live. Aadhaar, voter ID, or utility bill are accepted." },
      { name: "Aadhaar card", why: "Accepted as both address and identity proof, and makes the process faster." },
      { name: "Passport-size photos", why: "Required at the Passport Seva Kendra on appointment day." },
    ],
    steps: [
      { title: "Register on Passport Seva portal", desc: "Go to passportindia.gov.in and create an account with your email.", isGovt: true },
      { title: "Fill the application form", desc: "Select 'Fresh Passport', fill in your details, and save the application." },
      { title: "Pay fee and book appointment", desc: "Fee: ₹1500 (normal) or ₹3500 (Tatkal). Book a slot at your nearest Passport Seva Kendra.", isGovt: true },
      { title: "Visit the PSK on your appointment day", desc: "Bring all original documents + photocopies. You'll go through three counters: document check, data entry, and officer interview." },
      { title: "Police verification", desc: "A local police officer visits your home address to verify your details. Usually takes 1–3 weeks." },
      { title: "Passport dispatched", desc: "After verification, your passport is sent via Speed Post. Track it on the portal." },
    ],
    officialUrl: "https://www.passportindia.gov.in/",
    officialName: "Passport Seva",
    faqs: [
      { q: "What is Tatkal?", a: "An expedited service — faster processing (1–3 days post-verification) for a higher fee of ₹3500." },
      { q: "What is police verification?", a: "A local police officer visits your address to confirm you live there and your documents are genuine. It's routine and nothing to worry about." },
      { q: "What if my Aadhaar address is different from where I live?", a: "Bring a recent utility bill or bank statement as additional proof of your current address." },
    ],
    lastVerified: "2026-09-26",
  },
  "aadhaar-update": {
    icon: "🪪",
    gradient: "from-violet-400 to-purple-500",
    titles: {
      en: "Aadhaar Update",
      ta: "ஆதார் புதுப்பிப்பு",
      hi: "आधार अपडेट",
      te: "ఆధార్ నవీకరణ",
    },
    taglines: {
      en: "Need to update your Aadhaar? Here's what you can change, and how.",
      ta: "உங்கள் ஆதாரை புதுப்பிக்க வேண்டுமா? எதை மாற்றலாம், எப்படி என்று பாருங்கள்.",
      hi: "आधार अपडेट करना है? क्या बदल सकते हैं और कैसे — यहाँ जानें।",
      te: "ఆధార్ అప్‌డేట్ చేయాలా? ఏమి మార్చవచ్చు మరియు ఎలా అనేది ఇక్కడ చూడండి.",
    },
    who: "Anyone who already has an Aadhaar number",
    stages: ["Choose what to update", "Online or visit centre", "Submit documents", "Update processed"],
    appointment: false,
    documents: [
      { name: "Proof of address (for address update)", why: "Bank statement, utility bill, rent agreement, or other UIDAI-accepted documents." },
      { name: "Proof of name (for name update)", why: "PAN card, passport, or gazette notification." },
      { name: "Aadhaar-linked mobile number", why: "Needed to receive the OTP for online updates. If not linked, you must visit an Enrolment Centre." },
    ],
    steps: [
      { title: "Check if your update can be done online", desc: "Address, mobile number, and email can be updated online. Name and date of birth changes may require a centre visit." },
      { title: "Log in to myAadhaar portal", desc: "Visit myaadhaar.uidai.gov.in, enter your Aadhaar number, and verify with OTP.", isGovt: true },
      { title: "Select the field to update", desc: "Click 'Update Aadhaar Online', choose the field (address, mobile, etc.), and follow the steps." },
      { title: "Upload supporting document", desc: "Upload a clear scan or photo of your proof document.", isGovt: true },
      { title: "Track with URN", desc: "You'll receive an Update Request Number (URN). Check status at uidai.gov.in." },
    ],
    officialUrl: "https://myaadhaar.uidai.gov.in/",
    officialName: "myAadhaar — UIDAI",
    faqs: [
      { q: "Can I update my address if I am a tenant?", a: "Yes. A rent agreement (registered or notarised) is accepted as address proof." },
      { q: "How long does it take?", a: "Online updates usually process within 5–7 working days." },
      { q: "What if my mobile number isn't linked to Aadhaar?", a: "You'll need to visit the nearest Aadhaar Enrolment Centre to link or update your number — this can't be done online." },
    ],
    lastVerified: "2026-09-26",
  },
};

const sectionLabels: Record<Lang, {
  back: string; glance: string; who: string; docs: string; steps: string;
  faq: string; ready: string; readyDesc: string; open: string; ask: string;
  askDesc: string; askPlaceholder: string; askBtn: string; lastVerified: string;
  apptNote: string;
}> = {
  en: {
    back: "← Back", glance: "At a glance", who: "Who this is for",
    docs: "What you'll need", steps: "How it works", faq: "Common questions",
    ready: "Ready to start?",
    readyDesc: "This next step happens on the official government website. You'll complete the actual application there — come back here if you get stuck.",
    open: "Open", ask: "Ask FormSaathi",
    askDesc: "Something unclear? Ask in any language — voice support coming soon.",
    askPlaceholder: "Type your question…", askBtn: "Ask",
    lastVerified: "Info verified", apptNote: "An in-person appointment is required for this service.",
  },
  ta: {
    back: "← திரும்பு", glance: "சுருக்கமான பார்வை", who: "யார் இதை பயன்படுத்தலாம்",
    docs: "உங்களுக்கு தேவையானவை", steps: "எப்படி செய்வது", faq: "பொதுவான கேள்விகள்",
    ready: "தொடங்க தயாரா?",
    readyDesc: "அடுத்த கட்டம் அரசு இணையதளத்தில் நடக்கும். விண்ணப்பம் நீங்களே பூர்த்தி செய்வீர்கள் — குழப்பம் வந்தால் திரும்பி வாருங்கள்.",
    open: "திற", ask: "FormSaathi-ஐ கேளுங்கள்",
    askDesc: "ஏதாவது தெளிவில்லையா? எந்த மொழியிலும் கேளுங்கள்.",
    askPlaceholder: "உங்கள் கேள்வியை தட்டச்சு செய்யுங்கள்…", askBtn: "கேள்",
    lastVerified: "தகவல் சரிபார்க்கப்பட்டது", apptNote: "இந்த சேவைக்கு நேரில் வருகை தேவை.",
  },
  hi: {
    back: "← वापस", glance: "संक्षिप्त जानकारी", who: "यह किनके लिए है",
    docs: "आपको क्या चाहिए", steps: "यह कैसे काम करता है", faq: "सामान्य सवाल",
    ready: "शुरू करने के लिए तैयार?",
    readyDesc: "अगला कदम सरकारी वेबसाइट पर होगा। आवेदन आप खुद करेंगे — अगर कोई दिक्कत हो तो वापस आएं।",
    open: "खोलें", ask: "FormSaathi से पूछें",
    askDesc: "कुछ स्पष्ट नहीं? किसी भी भाषा में पूछें।",
    askPlaceholder: "अपना सवाल लिखें…", askBtn: "पूछें",
    lastVerified: "जानकारी जांची गई", apptNote: "इस सेवा के लिए व्यक्तिगत रूप से जाना जरूरी है।",
  },
  te: {
    back: "← వెనుకకు", glance: "సంక్షిప్త వివరణ", who: "ఇది ఎవరికోసం",
    docs: "మీకు ఏమి కావాలి", steps: "ఇది ఎలా పని చేస్తుంది", faq: "సాధారణ ప్రశ్నలు",
    ready: "ప్రారంభించడానికి సిద్ధంగా ఉన్నారా?",
    readyDesc: "తదుపరి దశ అధికారిక ప్రభుత్వ వెబ్‌సైట్‌లో జరుగుతుంది. మీరే దరఖాస్తు పూర్తి చేస్తారు — చిక్కు వస్తే తిరిగి రండి.",
    open: "తెరవండి", ask: "FormSaathi ని అడగండి",
    askDesc: "ఏదైనా అస్పష్టంగా ఉందా? ఏ భాషలోనైనా అడగండి.",
    askPlaceholder: "మీ ప్రశ్న టైప్ చేయండి…", askBtn: "అడగండి",
    lastVerified: "సమాచారం ధృవీకరించబడింది", apptNote: "ఈ సేవకు వ్యక్తిగతంగా హాజరు కావాలి.",
  },
};

export default function ServicePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const serviceId = params.serviceId as string;
  const service = services[serviceId];

  const initialLang = (searchParams.get("lang") as Lang) || "en";
  const [lang, setLang] = useState<Lang>(
    ["en", "ta", "hi", "te"].includes(initialLang) ? initialLang : "en"
  );
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!service) notFound();

  const lbl = sectionLabels[lang];

  const langOptions: { code: Lang; label: string }[] = [
    { code: "en", label: "EN" },
    { code: "hi", label: "HI" },
    { code: "ta", label: "TA" },
    { code: "te", label: "TE" },
  ];

  return (
    <main className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Hero */}
      <div
        className="px-4 pt-6 pb-8"
        style={{ background: "linear-gradient(135deg, #1C1C2E 0%, #2D1B69 50%, #1C1C2E 100%)" }}
      >
        <div className="max-w-lg mx-auto">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
              {lbl.back}
            </Link>
            <div className="flex gap-1.5">
              {langOptions.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className="w-8 h-8 rounded-full text-xs font-semibold transition-all"
                  style={
                    lang === l.code
                      ? { background: "var(--accent)", color: "#fff" }
                      : { background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }
                  }
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Icon + title */}
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 bg-gradient-to-br ${service.gradient} shadow-lg`}
          >
            {service.icon}
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{service.titles[lang]}</h1>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
            {service.taglines[lang]}
          </p>

          {/* Stages */}
          <div className="flex items-center gap-1.5 mt-5 flex-wrap">
            {service.stages.map((stage, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs" style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)" }}>
                  <span className="w-4 h-4 rounded-full bg-white/20 text-white text-[10px] flex items-center justify-center font-bold">{i + 1}</span>
                  {stage}
                </div>
                {i < service.stages.length - 1 && <span style={{ color: "rgba(255,255,255,0.3)" }}>›</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Appointment banner */}
        {service.appointment && (
          <div className="flex items-start gap-3 rounded-2xl px-4 py-3" style={{ background: "#FFF3CD", border: "1px solid #FFE082" }}>
            <span className="text-lg">📅</span>
            <p className="text-sm text-amber-800">{lbl.apptNote}</p>
          </div>
        )}

        {/* Verified note */}
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          {lbl.lastVerified}: {service.lastVerified}
        </p>

        {/* Documents */}
        <section className="rounded-2xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
            <h2 className="font-semibold text-[15px]">{lbl.docs}</h2>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {service.documents.map((doc, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "rgba(34,197,94,0.12)" }}>
                  <span className="text-xs text-green-600 font-bold">✓</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                  <div className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--muted)" }}>{doc.why}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Steps */}
        <section className="rounded-2xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
            <h2 className="font-semibold text-[15px]">{lbl.steps}</h2>
          </div>
          <div className="px-4 py-4 space-y-5">
            {service.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
                  style={{ background: "linear-gradient(135deg, #1C1C2E, #2D1B69)" }}
                >
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-900">{step.title}</div>
                  <div className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--muted)" }}>{step.desc}</div>
                  {step.isGovt && (
                    <span className="inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(59,130,246,0.1)", color: "#2563EB" }}>
                      On official website
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="rounded-2xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
            <h2 className="font-semibold text-[15px]">{lbl.faq}</h2>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {service.faqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                >
                  <span className="text-sm font-medium text-gray-900 pr-3">{faq.q}</span>
                  <span className="text-gray-400 flex-shrink-0 transition-transform" style={{ transform: openFaq === i ? "rotate(180deg)" : "none" }}>⌄</span>
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-3 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Official handoff */}
        <section
          className="rounded-2xl p-5"
          style={{ background: "linear-gradient(135deg, #1C1C2E 0%, #2D1B69 100%)" }}
        >
          <div className="text-sm font-semibold text-white mb-1">{lbl.ready}</div>
          <p className="text-xs leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>
            {lbl.readyDesc}
          </p>
          <a
            href={service.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full font-semibold text-sm py-3 rounded-xl transition-opacity hover:opacity-90"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            {lbl.open} {service.officialName} ↗
          </a>
        </section>

        {/* Ask FormSaathi */}
        <section className="rounded-2xl p-4" style={{ border: "1.5px dashed var(--border)" }}>
          <div className="text-sm font-semibold text-gray-800 mb-1">{lbl.ask}</div>
          <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>{lbl.askDesc}</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={lbl.askPlaceholder}
              className="flex-1 text-sm rounded-xl px-3 py-2.5 outline-none"
              style={{ border: "1px solid var(--border)", background: "var(--card)" }}
            />
            <button
              className="text-sm px-4 py-2.5 rounded-xl font-semibold text-white"
              style={{ background: "var(--accent)" }}
            >
              {lbl.askBtn}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
