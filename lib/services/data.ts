import type { Lang } from "@/lib/lang";

export type { Lang };

export interface ServiceDocument {
  name: string;
  why: string;
}

export interface ServiceStep {
  title: string;
  desc: string;
  isGovt?: boolean;
}

export interface ServiceFAQ {
  q: string;
  a: string;
}

export interface ServiceData {
  id: string;
  icon: string;
  gradient: string;
  bg: string;
  border: string;
  badge: string;
  meta: string;
  titles: Record<Lang, string>;
  taglines: Record<Lang, string>;
  descs: Record<Lang, string>;
  who: string;
  stages: string[];
  appointment: boolean;
  documents: ServiceDocument[];
  steps: ServiceStep[];
  officialUrl: string;
  officialName: string;
  faqs: ServiceFAQ[];
  lastVerified: string;
}

export const services: Record<string, ServiceData> = {
  "driving-licence": {
    id: "driving-licence",
    icon: "🚗",
    gradient: "from-orange-400 to-red-500",
    bg: "bg-orange-50",
    border: "border-orange-100",
    badge: "bg-orange-100 text-orange-700",
    meta: "6 steps · Parivahan",
    titles: { en: "Driving Licence", ta: "ஓட்டுநர் உரிமம்", hi: "ड्राइविंग लाइसेंस", te: "డ్రైవింగ్ లైసెన్స్" },
    taglines: {
      en: "Getting your first driving licence? Here's what you'll need and what happens at each stage.",
      ta: "முதல் முறையாக ஓட்டுநர் உரிமம் பெறுகிறீர்களா? ஒவ்வொரு கட்டத்திலும் என்ன நடக்கும் என்பதை இங்கே பாருங்கள்.",
      hi: "पहली बार ड्राइविंग लाइसेंस बना रहे हैं? हर कदम पर क्या होगा — यहाँ समझें।",
      te: "మొదటిసారి డ్రైవింగ్ లైసెన్స్ తీసుకుంటున్నారా? ప్రతి దశలో ఏమి జరుగుతుందో ఇక్కడ చూడండి.",
    },
    descs: {
      en: "Get your learner's licence or full driving licence.",
      ta: "உங்கள் கற்றல் உரிமம் அல்லது முழு ஓட்டுநர் உரிமம் பெறுங்கள்.",
      hi: "लर्नर लाइसेंस या पूरा ड्राइविंग लाइसेंस पाएं।",
      te: "లెర్నర్ లైసెన్స్ లేదా పూర్తి డ్రైవింగ్ లైసెన్స్ పొందండి.",
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
      { title: "Create account on Parivahan", desc: "Go to parivahan.gov.in and register with your mobile number.", isGovt: true },
      { title: "Fill Learner's Licence application", desc: "Select your state and RTO, fill personal details and upload documents." },
      { title: "Pay the fee and book slot", desc: "Pay online (₹200–400 depending on vehicle type). Choose a date at your local RTO.", isGovt: true },
      { title: "Appear for the learner's test", desc: "A short computer-based test on traffic rules at the RTO. You need 57%+ to pass." },
      { title: "Wait 30 days", desc: "After your learner's licence is issued, you must wait 30 days before applying for the full DL. Use this time to practice." },
      { title: "Apply and test for full driving licence", desc: "Apply online again, book a slot, and appear for the practical driving test at the RTO." },
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
    id: "voter-id",
    icon: "🗳️",
    gradient: "from-blue-400 to-indigo-500",
    bg: "bg-blue-50",
    border: "border-blue-100",
    badge: "bg-blue-100 text-blue-700",
    meta: "4 steps · ECI portal",
    titles: { en: "Voter ID (EPIC)", ta: "வாக்காளர் அட்டை", hi: "वोटर आईडी", te: "ఓటర్ గుర్తింపు కార్డు" },
    taglines: {
      en: "Registering to vote for the first time? Here's how it works.",
      ta: "முதல் முறையாக வாக்காளராக பதிவு செய்கிறீர்களா? இப்படி செய்யுங்கள்.",
      hi: "पहली बार वोटर के रूप में रजिस्ट्रेशन कर रहे हैं? यहाँ पूरी जानकारी है।",
      te: "మొదటిసారి ఓటరుగా నమోదు చేసుకుంటున్నారా? ఇలా చేయండి.",
    },
    descs: {
      en: "Register to vote for the first time.",
      ta: "முதல் முறையாக வாக்காளராக பதிவு செய்யுங்கள்.",
      hi: "पहली बार मतदाता के रूप में पंजीकरण करें।",
      te: "మొదటిసారి ఓటరుగా నమోదు చేసుకోండి.",
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
      { title: "Verification and card dispatch", desc: "A Booth Level Officer verifies your details. Your voter ID card is sent via post after approval." },
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
    id: "passport",
    icon: "🛂",
    gradient: "from-emerald-400 to-teal-500",
    bg: "bg-green-50",
    border: "border-green-100",
    badge: "bg-green-100 text-green-700",
    meta: "7 steps · Passport Seva",
    titles: { en: "Passport", ta: "பாஸ்போர்ட்", hi: "पासपोर्ट", te: "పాస్‌పోర్ట్" },
    taglines: {
      en: "Applying for your first passport? Here's everything you need before you book your appointment.",
      ta: "முதல் பாஸ்போர்ட்டிற்கு விண்ணப்பிக்கிறீர்களா? அப்பாயிண்ட்மென்ட் முன்பு தெரிந்துகொள்ள வேண்டியவை இங்கே.",
      hi: "पहली बार पासपोर्ट बना रहे हैं? अपॉइंटमेंट से पहले ये सब जान लें।",
      te: "తొలిసారి పాస్‌పోర్ట్ కోసం దరఖాస్తు చేస్తున్నారా? అపాయింట్‌మెంట్ ముందు ఇవి తెలుసుకోండి.",
    },
    descs: {
      en: "Apply for your first passport or renew an existing one.",
      ta: "உங்கள் முதல் பாஸ்போர்ட்டிற்கு விண்ணப்பிக்கவும் அல்லது புதுப்பிக்கவும்.",
      hi: "पहली बार पासपोर्ट के लिए आवेदन करें या नवीनीकरण करें।",
      te: "మీ తొలి పాస్‌పోర్ట్ కోసం దరఖాస్తు చేయండి లేదా పునరుద్ధరించండి.",
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

  "pan-card": {
    id: "pan-card",
    icon: "💳",
    gradient: "from-cyan-400 to-sky-500",
    bg: "bg-sky-50",
    border: "border-sky-100",
    badge: "bg-sky-100 text-sky-700",
    meta: "4 steps · NSDL/Protean",
    titles: { en: "PAN Card", ta: "பான் கார்டு", hi: "पैन कार्ड", te: "పాన్ కార్డు" },
    taglines: {
      en: "Applying for your first PAN card? Here's what to expect at each stage.",
      ta: "முதல் முறையாக பான் கார்டிற்கு விண்ணப்பிக்கிறீர்களா? ஒவ்வொரு கட்டத்திலும் என்ன நடக்கும் என்று பாருங்கள்.",
      hi: "पहली बार PAN कार्ड बना रहे हैं? हर कदम पर क्या होगा — यहाँ जानें।",
      te: "తొలిసారి పాన్ కార్డు కోసం దరఖాస్తు చేస్తున్నారా? ప్రతి దశలో ఏమి జరుగుతుందో చూడండి.",
    },
    descs: {
      en: "Get your Permanent Account Number for taxes and identity.",
      ta: "வரி மற்றும் அடையாளத்திற்கான நிரந்தர கணக்கு எண் பெறுங்கள்.",
      hi: "टैक्स और पहचान के लिए स्थायी खाता संख्या पाएं।",
      te: "పన్ను మరియు గుర్తింపు కోసం శాశ్వత ఖాతా సంఖ్య పొందండి.",
    },
    who: "Any Indian citizen or entity needing to file taxes or make high-value financial transactions",
    stages: ["Fill Form 49A online", "Pay fee", "Submit documents", "PAN dispatched"],
    appointment: false,
    documents: [
      { name: "Proof of identity", why: "Aadhaar, voter ID, passport, or driving licence — to confirm who you are." },
      { name: "Proof of address", why: "Aadhaar, passport, utility bill, or bank statement — to confirm where you live." },
      { name: "Proof of date of birth", why: "Class 10 certificate, birth certificate, or Aadhaar — to confirm your age." },
      { name: "Passport-size photo", why: "Printed on the PAN card." },
    ],
    steps: [
      { title: "Go to the NSDL (Protean) or UTIITSL portal", desc: "Visit onlineservices.nsdl.com or pan.utiitsl.com. Click 'Apply Online' under PAN services.", isGovt: true },
      { title: "Fill Form 49A", desc: "Select 'New PAN – Indian Citizen (Form 49A)'. Fill in your name, date of birth, address, and contact details exactly as in your documents." },
      { title: "Pay the fee and upload documents", desc: "Fee: ₹93 (within India) or ₹864 (outside India). Upload scans of your identity, address, and date-of-birth proofs.", isGovt: true },
      { title: "Track and receive your PAN", desc: "You'll receive an acknowledgement number. Your PAN is usually issued within 15 days and sent via post (or e-PAN to email)." },
    ],
    officialUrl: "https://onlineservices.nsdl.com/paam/endUserRegisterContact.html",
    officialName: "NSDL PAN Online",
    faqs: [
      { q: "Is it free?", a: "No. It costs ₹93 for a physical PAN card sent within India (+ 18% GST), or ₹66 for an e-PAN only." },
      { q: "Can I use Aadhaar for all three proofs?", a: "Yes — Aadhaar is accepted as identity, address, and date-of-birth proof simultaneously, making it the simplest option." },
      { q: "What is e-PAN?", a: "A digitally signed PDF version of your PAN card, issued to your email within 10 days. It is legally equivalent to the physical card for most purposes." },
    ],
    lastVerified: "2026-09-26",
  },

  "itr-filing": {
    id: "itr-filing",
    icon: "📊",
    gradient: "from-yellow-400 to-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-100",
    badge: "bg-amber-100 text-amber-700",
    meta: "5 steps · Income Tax Portal",
    titles: { en: "ITR Filing", ta: "வருமான வரி தாக்கல்", hi: "ITR दाखिल करना", te: "ITR దాఖలు" },
    taglines: {
      en: "Filing your income tax return for the first time? Here's what you need to know.",
      ta: "முதல் முறையாக வருமான வரி தாக்கல் செய்கிறீர்களா? தெரிந்துகொள்ள வேண்டியவை இங்கே.",
      hi: "पहली बार ITR दाखिल कर रहे हैं? जरूरी बातें यहाँ जानें।",
      te: "తొలిసారి ITR దాఖలు చేస్తున్నారా? తెలుసుకోవాల్సిన విషయాలు ఇక్కడ చూడండి.",
    },
    descs: {
      en: "File your annual income tax return online.",
      ta: "உங்கள் ஆண்டு வருமான வரி தாக்கலை ஆன்லைனில் செய்யுங்கள்.",
      hi: "अपना सालाना आयकर रिटर्न ऑनलाइन दाखिल करें।",
      te: "మీ వార్షిక ఆదాయపు పన్ను రిటర్న్‌ను ఆన్‌లైన్‌లో దాఖలు చేయండి.",
    },
    who: "Individuals whose income exceeds the basic exemption limit (₹3 lakh for FY 2024-25); also mandatory if you have foreign income, own foreign assets, or had TDS deducted and want a refund",
    stages: ["Collect documents", "Choose ITR form", "Fill and verify prefilled data", "Submit and e-verify"],
    appointment: false,
    documents: [
      { name: "PAN card", why: "Your PAN is your tax identity. You cannot file without it." },
      { name: "Aadhaar card", why: "Mandatory for e-verification and linking to your PAN." },
      { name: "Form 16 (if salaried)", why: "Issued by your employer — shows your salary and TDS details for the financial year." },
      { name: "Bank account details", why: "Required for receiving any tax refund." },
      { name: "AIS/Form 26AS", why: "Annual Information Statement — lists all income and TDS on record with the tax department. Download it from the portal to cross-check." },
    ],
    steps: [
      { title: "Log in to the Income Tax portal", desc: "Visit incometax.gov.in and sign in with your PAN (which is your user ID). Register first if it's your first time.", isGovt: true },
      { title: "Download and review Form 26AS and AIS", desc: "Go to 'e-File' → 'Income Tax Returns' → 'View Form 26AS'. Also check the Annual Information Statement (AIS) for a full picture of your income." },
      { title: "Choose the right ITR form", desc: "Most salaried individuals with no business income use ITR-1 (Sahaj). If in doubt, the portal will suggest the right form based on your profile." },
      { title: "Fill in your income details", desc: "The portal pre-fills much of the data from Form 16 and 26AS. Verify each entry, add any income sources not shown (interest, capital gains, rent), and claim deductions (80C, 80D, HRA)." },
      { title: "Submit and e-verify", desc: "Click 'Submit'. Then e-verify using Aadhaar OTP, net banking, or demat account. E-verification must happen within 30 days — otherwise your return is treated as not filed." },
    ],
    officialUrl: "https://www.incometax.gov.in/iec/foportal/",
    officialName: "Income Tax e-Filing Portal",
    faqs: [
      { q: "What is the deadline?", a: "Usually July 31 for individuals with no audit requirement. This can change each year — check the portal for the current deadline." },
      { q: "What if I miss the deadline?", a: "You can file a belated return up to December 31 of the assessment year, with a late fee of up to ₹5,000. After that, only the tax department can allow it." },
      { q: "What is e-verification?", a: "Confirming your return is genuine — you can do it instantly with Aadhaar OTP. Without it, the return is invalid even if submitted." },
      { q: "Do I need to pay to file?", a: "No. Filing directly on incometax.gov.in is free. Third-party apps may charge a fee for assistance." },
    ],
    lastVerified: "2026-09-26",
  },

  "bank-account": {
    id: "bank-account",
    icon: "🏦",
    gradient: "from-rose-400 to-pink-500",
    bg: "bg-rose-50",
    border: "border-rose-100",
    badge: "bg-rose-100 text-rose-700",
    meta: "3 steps · Your chosen bank",
    titles: { en: "Open Bank Account", ta: "வங்கி கணக்கு திற", hi: "बैंक खाता खोलें", te: "బ్యాంక్ ఖాతా తెరవండి" },
    taglines: {
      en: "Opening your first savings account? Here's what you'll need and what to expect.",
      ta: "முதல் சேமிப்பு கணக்கு திறக்கிறீர்களா? என்ன தேவை, என்ன நடக்கும் என்று பாருங்கள்.",
      hi: "पहला बचत खाता खोल रहे हैं? यहाँ पूरी जानकारी है।",
      te: "తొలి సేవింగ్స్ ఖాతా తెరుస్తున్నారా? ఏమి కావాలి, ఏమి జరుగుతుందో ఇక్కడ చూడండి.",
    },
    descs: {
      en: "Open a savings account with any scheduled bank.",
      ta: "எந்த அட்டவணை வங்கியிலும் சேமிப்பு கணக்கு திறங்கள்.",
      hi: "किसी भी अनुसूचित बैंक में बचत खाता खोलें।",
      te: "ఏ షెడ్యూల్డ్ బ్యాంక్‌లోనైనా సేవింగ్స్ ఖాతా తెరవండి.",
    },
    who: "Any Indian resident aged 18+ (minors can open accounts jointly with a guardian)",
    stages: ["Choose bank & account type", "Submit KYC documents", "Initial deposit", "Account activated"],
    appointment: false,
    documents: [
      { name: "Identity proof (KYC)", why: "Aadhaar is the simplest — it serves as both identity and address proof and enables instant digital KYC at most banks." },
      { name: "Address proof", why: "Aadhaar, passport, utility bill, or rental agreement. Must match your current address." },
      { name: "PAN card", why: "Mandatory for accounts where you may deposit over ₹50,000 or for interest income reporting. If you don't have a PAN yet, submit Form 60." },
      { name: "Passport-size photo", why: "For the account opening form." },
    ],
    steps: [
      { title: "Choose the right bank and account type", desc: "Public sector banks (SBI, Bank of Baroda) have lower minimum balance requirements. Private banks (HDFC, ICICI, Axis) often have better apps. Zero-balance options: Jan Dhan (₹0 min), Small Finance Banks, or digital accounts (Paytm Payments Bank, etc.)." },
      { title: "Apply online or visit a branch", desc: "Most banks let you start online with Aadhaar-based video KYC. You can also walk into any branch with your documents. For a student account, bring your college ID too." },
      { title: "Complete KYC and make initial deposit", desc: "For Aadhaar-based KYC: a short video call verifies your identity. For branch KYC: staff verify your originals. Make the initial deposit (₹0–10,000 depending on account type) to activate the account." },
    ],
    officialUrl: "https://www.rbi.org.in/commonman/English/scripts/BankersDirectory.aspx",
    officialName: "RBI Bankers Directory",
    faqs: [
      { q: "Which bank should I choose?", a: "For first accounts, SBI or your nearest public sector bank is reliable for basic needs. For better digital experience, HDFC or ICICI are popular. For zero balance, open a Jan Dhan account at any nationalised bank." },
      { q: "What is a zero-balance account?", a: "An account with no minimum balance requirement. Jan Dhan accounts under the government scheme are free and come with a RuPay debit card and basic insurance." },
      { q: "Can I open an account without PAN?", a: "Yes, temporarily — submit Form 60 instead. But you'll need to link your PAN within a few months or the account may be restricted for certain transactions." },
    ],
    lastVerified: "2026-09-26",
  },

  "aadhaar-update": {
    id: "aadhaar-update",
    icon: "🪪",
    gradient: "from-violet-400 to-purple-500",
    bg: "bg-purple-50",
    border: "border-purple-100",
    badge: "bg-purple-100 text-purple-700",
    meta: "3–5 steps · UIDAI",
    titles: { en: "Aadhaar Update", ta: "ஆதார் புதுப்பிப்பு", hi: "आधार अपडेट", te: "ఆధార్ నవీకరణ" },
    taglines: {
      en: "Need to update your Aadhaar? Here's what you can change, and how.",
      ta: "உங்கள் ஆதாரை புதுப்பிக்க வேண்டுமா? எதை மாற்றலாம், எப்படி என்று பாருங்கள்.",
      hi: "आधार अपडेट करना है? क्या बदल सकते हैं और कैसे — यहाँ जानें।",
      te: "ఆధార్ అప్‌డేట్ చేయాలా? ఏమి మార్చవచ్చు మరియు ఎలా అనేది ఇక్కడ చూడండి.",
    },
    descs: {
      en: "Update your address, name, phone number, or photo.",
      ta: "உங்கள் முகவரி, பெயர், தொலைபேசி எண் அல்லது புகைப்படத்தை புதுப்பிக்கவும்.",
      hi: "अपना पता, नाम, फोन नंबर या फोटो अपडेट करें।",
      te: "మీ చిరునామా, పేరు, ఫోన్ నంబర్ లేదా ఫోటో అప్‌డేట్ చేయండి.",
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

export function getService(id: string): ServiceData | null {
  return services[id] ?? null;
}

export function getAllServices(): ServiceData[] {
  return Object.values(services);
}

export function buildQASystemPrompt(service: ServiceData, lang: Lang): string {
  const stepList = service.steps
    .map((s, i) => `Step ${i + 1}: ${s.title} — ${s.desc}`)
    .join("\n");
  const docList = service.documents.map((d) => `- ${d.name}: ${d.why}`).join("\n");
  const faqList = service.faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n");
  const langName = { en: "English", hi: "Hindi", ta: "Tamil", te: "Telugu" }[lang];

  return `You are FormSaathi, a friendly and clear guide for young Indians navigating government processes.
You speak like an informed elder sibling — practical, patient, non-judgmental.

You are helping the user with: ${service.titles.en}.

Who this is for: ${service.who}

Documents they will need:
${docList}

Process steps:
${stepList}

Common questions:
${faqList}

Official website: ${service.officialUrl} (${service.officialName})
Information last verified: ${service.lastVerified}

Rules:
- Respond in ${langName}
- Be brief and reassuring (2–3 sentences maximum)
- Only use facts from the information above
- If you don't know something, say: "I don't have verified information for that. Check the official source."
- Never invent government procedures, fees, URLs, or eligibility requirements
- Never ask for Aadhaar numbers, passwords, OTPs, or government credentials`;
}

export type SectionLabels = {
  back: string; glance: string; who: string; docs: string; steps: string;
  faq: string; ready: string; readyDesc: string; open: string; ask: string;
  askDesc: string; askPlaceholder: string; askBtn: string;
  lastVerified: string; apptNote: string; guideMe: string;
};

export const sectionLabels: Record<Lang, SectionLabels> = {
  en: {
    back: "← Back", glance: "At a glance", who: "Who this is for",
    docs: "What you'll need", steps: "How it works", faq: "Common questions",
    ready: "Ready to start?",
    readyDesc: "This next step happens on the official government website. You'll complete the actual application there — come back here if you get stuck.",
    open: "Open", ask: "Ask FormSaathi",
    askDesc: "Something unclear? Ask in any language.",
    askPlaceholder: "Type your question…", askBtn: "Ask",
    lastVerified: "Info verified", apptNote: "An in-person appointment is required for this service.",
    guideMe: "Guide me step by step →",
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
    guideMe: "என்னை படிப்படியாக வழிகாட்டுங்கள் →",
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
    guideMe: "मुझे चरण दर चरण गाइड करें →",
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
    guideMe: "నన్ను దశలవారీగా గైడ్ చేయండి →",
  },
};
