"use client";

import { useState, useEffect, useCallback } from "react";

export type Lang = "en" | "ta" | "hi" | "te";

export const LANG_KEY = "fs_lang";
export const SUPPORTED_LANGS: readonly Lang[] = ["en", "hi", "ta", "te"] as const;

export const SARVAM_LANG: Record<Lang, string> = {
  en: "en-IN",
  hi: "hi-IN",
  ta: "ta-IN",
  te: "te-IN",
};

export const SARVAM_STT_MODE: Record<Lang, "transcribe" | "codemix"> = {
  en: "transcribe",
  hi: "codemix",
  ta: "codemix",
  te: "codemix",
};

export function getLang(): Lang {
  if (typeof window === "undefined") return "en";
  try {
    const stored = localStorage.getItem(LANG_KEY) as Lang | null;
    return stored && (SUPPORTED_LANGS as readonly string[]).includes(stored) ? stored : "en";
  } catch {
    return "en";
  }
}

export function saveLang(lang: Lang): void {
  try {
    if (typeof window !== "undefined") localStorage.setItem(LANG_KEY, lang);
  } catch {
    // ignore
  }
}

export function useLanguage(): { lang: Lang; setLang: (l: Lang) => void; mounted: boolean } {
  const [lang, setLangState] = useState<Lang>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLangState(getLang());
  }, []);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    saveLang(newLang);
  }, []);

  return { lang, setLang, mounted };
}

export const HOME_LABELS: Record<Lang, {
  greeting: string;
  prompt: string;
  orType: string;
  typePlaceholder: string;
  submit: string;
  listening: string;
  processing: string;
  notUnderstood: string;
  tryAgain: string;
  tapCard: string;
  micError: string;
  iHeard: string;
  confirmYes: string;
}> = {
  en: {
    greeting: "Hello! What would you like to get done today?",
    prompt: "Tap a service below, or speak to tell me what you need.",
    orType: "Or type your request",
    typePlaceholder: "e.g. I need to apply for a passport…",
    submit: "Go",
    listening: "Listening…",
    processing: "Got it! Finding the right guide…",
    notUnderstood: "I didn't quite catch that. Please try again or tap a service below.",
    tryAgain: "Try again",
    tapCard: "Or choose a service",
    micError: "Microphone not available. Type your request instead.",
    iHeard: "I heard you say:",
    confirmYes: "Yes, continue →",
  },
  hi: {
    greeting: "नमस्ते! आज आप क्या करना चाहते हैं?",
    prompt: "नीचे कोई सेवा चुनें, या बोलकर बताएं।",
    orType: "या टाइप करें",
    typePlaceholder: "जैसे: मुझे पासपोर्ट के लिए आवेदन करना है…",
    submit: "जाएं",
    listening: "सुन रहा हूँ…",
    processing: "समझ गया! सही गाइड खोज रहा हूँ…",
    notUnderstood: "मैं समझ नहीं पाया। फिर से बोलें या नीचे सेवा चुनें।",
    tryAgain: "फिर से कोशिश करें",
    tapCard: "या सेवा चुनें",
    micError: "माइक्रोफ़ोन उपलब्ध नहीं है। टाइप करें।",
    iHeard: "मैंने सुना:",
    confirmYes: "हाँ, जारी रखें →",
  },
  ta: {
    greeting: "வணக்கம்! இன்று நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்?",
    prompt: "கீழே ஒரு சேவையை தேர்வு செய்யுங்கள், அல்லது பேசுங்கள்.",
    orType: "அல்லது தட்டச்சு செய்யுங்கள்",
    typePlaceholder: "எ.கா: எனக்கு பாஸ்போர்ட் தேவை…",
    submit: "செல்லுங்கள்",
    listening: "கேட்கிறேன்…",
    processing: "புரிந்தது! சரியான வழிகாட்டி தேடுகிறேன்…",
    notUnderstood: "புரியவில்லை. மீண்டும் முயற்சிக்கவும் அல்லது கீழே சேவை தேர்வு செய்யுங்கள்.",
    tryAgain: "மீண்டும் முயற்சி",
    tapCard: "அல்லது சேவை தேர்வு செய்யுங்கள்",
    micError: "மைக்ரோஃபோன் கிடைக்கவில்லை. தட்டச்சு செய்யுங்கள்.",
    iHeard: "நான் கேட்டது:",
    confirmYes: "ஆம், தொடரவும் →",
  },
  te: {
    greeting: "నమస్కారం! ఈరోజు మీరు ఏమి చేయాలనుకుంటున్నారు?",
    prompt: "దిగువన ఒక సేవను ఎంచుకోండి లేదా మాట్లాడండి.",
    orType: "లేదా టైప్ చేయండి",
    typePlaceholder: "ఉదా: నాకు పాస్‌పోర్ట్ కావాలి…",
    submit: "వెళ్ళండి",
    listening: "వింటున్నాను…",
    processing: "అర్థమైంది! సరైన గైడ్ వెతుకుతున్నాను…",
    notUnderstood: "అర్థం కాలేదు. మళ్ళీ ప్రయత్నించండి లేదా సేవ ఎంచుకోండి.",
    tryAgain: "మళ్ళీ ప్రయత్నించు",
    tapCard: "లేదా సేవను ఎంచుకోండి",
    micError: "మైక్రోఫోన్ అందుబాటులో లేదు. టైప్ చేయండి.",
    iHeard: "నేను విన్నది:",
    confirmYes: "అవును, కొనసాగండి →",
  },
};

export const GUIDE_LABELS: Record<Lang, {
  step: string;
  of: string;
  beforeYouStart: string;
  docsNeeded: string;
  haveThese: string;
  hearStep: string;
  textOnly: string;
  nextStep: string;
  askQuestion: string;
  askPlaceholder: string;
  send: string;
  youreReady: string;
  readyDesc: string;
  openOfficial: string;
  readFull: string;
  backToHome: string;
  ttsError: string;
  chatError: string;
  onOfficialSite: string;
  appointment: string;
  speakNow: string;
  skipListen: string;
}> = {
  en: {
    step: "Step", of: "of",
    beforeYouStart: "Before you start",
    docsNeeded: "Keep these documents ready. It'll save you a trip later.",
    haveThese: "I have these ready →",
    hearStep: "🔊 Hear this step",
    textOnly: "Text only mode",
    nextStep: "Ready for next step →",
    askQuestion: "Have a question?",
    askPlaceholder: "Ask anything about this step…",
    send: "Ask",
    youreReady: "You're ready!",
    readyDesc: "The actual application happens on the official government website. You'll complete it yourself — we'll be here if you need help.",
    openOfficial: "Open official website ↗",
    readFull: "Read full guide",
    backToHome: "← Start over",
    ttsError: "Audio unavailable",
    chatError: "I couldn't answer that right now. Please try again.",
    onOfficialSite: "On official website",
    appointment: "An in-person appointment is required for this service.",
    speakNow: "Speak now…",
    skipListen: "Skip",
  },
  hi: {
    step: "चरण", of: "में से",
    beforeYouStart: "शुरू करने से पहले",
    docsNeeded: "ये दस्तावेज़ तैयार रखें। बाद में परेशानी नहीं होगी।",
    haveThese: "मेरे पास ये हैं, आगे बढ़ें →",
    hearStep: "🔊 यह चरण सुनें",
    textOnly: "केवल टेक्स्ट मोड",
    nextStep: "अगले चरण के लिए तैयार →",
    askQuestion: "कोई सवाल है?",
    askPlaceholder: "इस चरण के बारे में कुछ भी पूछें…",
    send: "पूछें",
    youreReady: "आप तैयार हैं!",
    readyDesc: "असली आवेदन सरकारी वेबसाइट पर होगा। आप खुद करेंगे — अगर कोई मदद चाहिए तो वापस आएं।",
    openOfficial: "सरकारी वेबसाइट खोलें ↗",
    readFull: "पूरी गाइड पढ़ें",
    backToHome: "← वापस जाएं",
    ttsError: "ऑडियो उपलब्ध नहीं",
    chatError: "अभी जवाब नहीं दे सका। फिर से कोशिश करें।",
    onOfficialSite: "सरकारी वेबसाइट पर",
    appointment: "इस सेवा के लिए व्यक्तिगत रूप से जाना जरूरी है।",
    speakNow: "बोलें…",
    skipListen: "छोड़ें",
  },
  ta: {
    step: "படி", of: "இல்",
    beforeYouStart: "தொடங்குவதற்கு முன்பு",
    docsNeeded: "இந்த ஆவணங்களை தயாராக வைத்திருங்கள். பிறகு சிரமம் இருக்காது.",
    haveThese: "என்னிடம் உள்ளது, தொடரலாம் →",
    hearStep: "🔊 இந்த படியை கேளுங்கள்",
    textOnly: "உரை மட்டும் பயன்முறை",
    nextStep: "அடுத்த படிக்கு தயார் →",
    askQuestion: "கேள்வி இருக்கிறதா?",
    askPlaceholder: "இந்த படியைப் பற்றி எதையும் கேளுங்கள்…",
    send: "கேளுங்கள்",
    youreReady: "நீங்கள் தயார்!",
    readyDesc: "உண்மையான விண்ணப்பம் அரசு இணையதளத்தில் நடக்கும். நீங்களே செய்வீர்கள் — உதவி தேவைப்பட்டால் திரும்பி வாருங்கள்.",
    openOfficial: "அதிகாரப்பூர்வ இணையதளம் திறக்கவும் ↗",
    readFull: "முழு வழிகாட்டியை படிக்கவும்",
    backToHome: "← மீண்டும் தொடங்கவும்",
    ttsError: "ஒலி கிடைக்கவில்லை",
    chatError: "இப்போது பதில் சொல்ல முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
    onOfficialSite: "அதிகாரப்பூர்வ இணையதளத்தில்",
    appointment: "இந்த சேவைக்கு நேரில் வருகை தேவை.",
    speakNow: "பேசுங்கள்…",
    skipListen: "தவிர்",
  },
  te: {
    step: "దశ", of: "లో",
    beforeYouStart: "ప్రారంభించే ముందు",
    docsNeeded: "ఈ పత్రాలను సిద్ధంగా ఉంచుకోండి. తర్వాత ఇబ్బంది ఉండదు.",
    haveThese: "వాటిని సిద్ధంగా ఉంచాను, ముందుకు వెళ్ళండి →",
    hearStep: "🔊 ఈ దశను వినండి",
    textOnly: "టెక్స్ట్ మాత్రమే మోడ్",
    nextStep: "తదుపరి దశకు సిద్ధంగా ఉన్నాను →",
    askQuestion: "ఏదైనా అడగాలా?",
    askPlaceholder: "ఈ దశ గురించి ఏదైనా అడగండి…",
    send: "అడగండి",
    youreReady: "మీరు సిద్ధంగా ఉన్నారు!",
    readyDesc: "అసలు దరఖాస్తు అధికారిక ప్రభుత్వ వెబ్‌సైట్‌లో జరుగుతుంది. మీరే పూర్తి చేస్తారు — సహాయం అవసరమైతే తిరిగి రండి.",
    openOfficial: "అధికారిక వెబ్‌సైట్ తెరవండి ↗",
    readFull: "పూర్తి గైడ్ చదవండి",
    backToHome: "← తిరిగి వెళ్ళండి",
    ttsError: "ఆడియో అందుబాటులో లేదు",
    chatError: "ఇప్పుడు సమాధానం ఇవ్వలేకపోయాను. మళ్ళీ ప్రయత్నించండి.",
    onOfficialSite: "అధికారిక వెబ్‌సైట్‌లో",
    appointment: "ఈ సేవకు వ్యక్తిగతంగా హాజరు కావాలి.",
    speakNow: "మాట్లాడండి…",
    skipListen: "వదిలేయండి",
  },
};
