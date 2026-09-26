import Link from "next/link";
import { notFound } from "next/navigation";

const services: Record<string, {
  icon: string;
  title: string;
  tagline: string;
  who: string;
  stages: string[];
  appointment: boolean;
  documents: { name: string; why: string }[];
  steps: { title: string; desc: string; isGovt?: boolean }[];
  officialUrl: string;
  officialName: string;
  faqs: { q: string; a: string }[];
  lastVerified: string;
}> = {
  "driving-licence": {
    icon: "🚗",
    title: "Driving Licence",
    tagline: "Getting your first driving licence? Here's what you'll need and what happens at each stage.",
    who: "Indian citizens aged 16+ (learner's) or 18+ (full licence)",
    stages: ["Apply online", "Learner's test at RTO", "Wait 30 days", "Driving test", "Licence issued"],
    appointment: true,
    documents: [
      { name: "Age proof", why: "The RTO needs to verify you meet the minimum age requirement." },
      { name: "Address proof", why: "Required to confirm your residential address for the licence." },
      { name: "Passport-size photos", why: "For the licence card and application form." },
      { name: "Medical certificate (Form 1A)", why: "Confirms you are medically fit to drive." },
    ],
    steps: [
      { title: "Create account on Parivahan", desc: "Go to parivahan.gov.in, register with your mobile number.", isGovt: true },
      { title: "Fill Learner's Licence application", desc: "Select your state and RTO, fill in your personal details and upload documents." },
      { title: "Pay the fee", desc: "Pay online (₹200–400 depending on vehicle type).", isGovt: true },
      { title: "Book your slot at the RTO", desc: "Choose a date for your learner's licence test at your local RTO." },
      { title: "Appear for the learner's test", desc: "A short computer-based test on traffic rules. You need to score 57%+ to pass." },
      { title: "Wait 30 days, then apply for driving licence", desc: "After your learner's licence is issued, wait 30 days before applying for the full DL. Practice during this period." },
    ],
    officialUrl: "https://parivahan.gov.in/parivahan/",
    officialName: "Parivahan Sewa",
    faqs: [
      { q: "What is RTO?", a: "Regional Transport Office — the government office that handles vehicle registration and driving licences in your area." },
      { q: "Do I need to visit in person?", a: "Yes, for the tests. The application can be done online, but the learner's test and driving test must be done at the RTO." },
      { q: "What if I fail the test?", a: "You can reappear after 7 days. There's no limit on attempts, but each attempt may have a fee." },
      { q: "Which documents count as age proof?", a: "Class 10 certificate, birth certificate, Aadhaar, or passport." },
    ],
    lastVerified: "2026-09-26",
  },
  "voter-id": {
    icon: "🗳️",
    title: "Voter ID (EPIC)",
    tagline: "Registering to vote for the first time? Here's how it works.",
    who: "Indian citizens aged 18+ with a permanent address",
    stages: ["Fill Form 6 online", "Submit with documents", "Verification", "Card issued"],
    appointment: false,
    documents: [
      { name: "Age proof", why: "To confirm you are 18 or older." },
      { name: "Address proof", why: "Your voter registration is linked to your residential address." },
      { name: "Passport-size photo", why: "Printed on your voter ID card." },
    ],
    steps: [
      { title: "Go to the National Voters' Service Portal", desc: "Visit voters.eci.gov.in and click 'Register as New Voter'.", isGovt: true },
      { title: "Fill Form 6", desc: "Enter your name, address, date of birth, and upload your photo and documents." },
      { title: "Submit the application", desc: "Submit online. You'll receive a reference number.", isGovt: true },
      { title: "Booth Level Officer verifies", desc: "A government officer will verify your details, sometimes with a home visit." },
      { title: "Card dispatched", desc: "Your voter ID card is posted to your address. Check status on the portal using your reference number." },
    ],
    officialUrl: "https://voters.eci.gov.in/",
    officialName: "National Voters' Service Portal",
    faqs: [
      { q: "Can I register at my college address?", a: "Yes, if you are ordinarily residing there. You can register at either your home or college address, but not both." },
      { q: "How long does it take?", a: "Usually 3–4 weeks after submission, though it varies by state." },
      { q: "What if I move to a new address?", a: "You need to submit Form 8A to update your address in the electoral roll." },
    ],
    lastVerified: "2026-09-26",
  },
  "passport": {
    icon: "🛂",
    title: "Passport",
    tagline: "Applying for your first passport? Here's everything you need before you book your appointment.",
    who: "Indian citizens of any age",
    stages: ["Apply online", "Book appointment", "Visit Passport Seva Kendra", "Police verification", "Passport dispatched"],
    appointment: true,
    documents: [
      { name: "Proof of date of birth", why: "Class 10 certificate or birth certificate — establishes your age." },
      { name: "Proof of address", why: "Aadhaar, voter ID, or utility bill — must match your current address." },
      { name: "Aadhaar card", why: "Accepted as both address and identity proof." },
      { name: "Passport-size photos", why: "Required at the Passport Seva Kendra." },
    ],
    steps: [
      { title: "Register on Passport Seva portal", desc: "Go to passportindia.gov.in and create an account.", isGovt: true },
      { title: "Fill the application form", desc: "Select 'Fresh Passport', fill in your details, and save the application." },
      { title: "Pay the fee and book appointment", desc: "Fee starts at ₹1500 for normal, ₹3500 for Tatkal. Book an appointment at your nearest Passport Seva Kendra (PSK).", isGovt: true },
      { title: "Visit the PSK on your appointment day", desc: "Bring all original documents + photocopies. You'll go through three counters: document check, data entry, and officer interview." },
      { title: "Police verification", desc: "A police officer visits your address to verify your details. This usually takes 1–3 weeks." },
      { title: "Passport dispatched", desc: "After successful verification, your passport is dispatched via Speed Post. Track it on the portal." },
    ],
    officialUrl: "https://www.passportindia.gov.in/",
    officialName: "Passport Seva",
    faqs: [
      { q: "What is Tatkal?", a: "An expedited service — you get the passport faster (1–3 days after police verification) for a higher fee." },
      { q: "What is police verification?", a: "A local police officer visits your home address to confirm you live there and your documents are genuine." },
      { q: "Do I need to go with my parents?", a: "If you are under 18, yes. If you are 18+, you can apply and attend independently." },
      { q: "What if my Aadhaar address differs from where I live?", a: "Bring a recent utility bill or bank statement showing your current address as an additional proof." },
    ],
    lastVerified: "2026-09-26",
  },
  "aadhaar-update": {
    icon: "🪪",
    title: "Aadhaar Update",
    tagline: "Need to update your Aadhaar? Here's what you can change and how.",
    who: "Anyone who already has an Aadhaar number",
    stages: ["Choose what to update", "Online or visit centre", "Submit documents", "Update processed"],
    appointment: false,
    documents: [
      { name: "Proof of address (for address update)", why: "Bank statement, utility bill, rent agreement, or other UIDAI-accepted documents." },
      { name: "Proof of name (for name update)", why: "PAN card, passport, or gazette notification." },
      { name: "Mobile number (for online updates)", why: "Your Aadhaar-linked mobile number is needed to receive the OTP for online updates." },
    ],
    steps: [
      { title: "Check if your update can be done online", desc: "Address, mobile number, and email can be updated online. Name and date of birth changes may require visiting an Aadhaar centre." },
      { title: "Go to myAadhaar portal", desc: "Visit myaadhaar.uidai.gov.in and log in with your Aadhaar number and OTP.", isGovt: true },
      { title: "Select the field to update", desc: "Click 'Update Aadhaar Online', select the field (address, mobile, etc.), and follow the steps." },
      { title: "Upload supporting document", desc: "Upload a clear scan or photo of your supporting document.", isGovt: true },
      { title: "Track your request", desc: "You'll receive a URN (Update Request Number). Track status at uidai.gov.in." },
    ],
    officialUrl: "https://myaadhaar.uidai.gov.in/",
    officialName: "myAadhaar — UIDAI",
    faqs: [
      { q: "Can I update my address if I am a tenant?", a: "Yes. A rent agreement (registered or notarised) is accepted as address proof." },
      { q: "How long does it take?", a: "Online updates usually process within 5–7 working days." },
      { q: "Can I change my date of birth?", a: "Only once, and only if the change is minor (within 3 years). This usually requires visiting an Aadhaar Enrolment Centre." },
      { q: "What if I don't have my mobile number linked?", a: "You'll need to visit the nearest Aadhaar Enrolment Centre to link or update your number." },
    ],
    lastVerified: "2026-09-26",
  },
};

export default async function ServicePage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;
  const service = services[serviceId];
  if (!service) notFound();

  return (
    <main className="max-w-lg mx-auto px-4 pt-6 pb-20">
      {/* Back */}
      <Link href="/" className="flex items-center gap-1 text-sm text-gray-400 mb-6">
        ← Back
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="text-4xl mb-3">{service.icon}</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h1>
        <p className="text-gray-500 text-sm leading-relaxed">{service.tagline}</p>
        <p className="text-xs text-gray-400 mt-2">
          Info last verified: {service.lastVerified}
        </p>
      </div>

      {/* At a glance */}
      <section className="bg-white border border-gray-100 rounded-2xl p-4 mb-4">
        <h2 className="font-semibold text-gray-800 text-sm mb-3">At a glance</h2>
        <div className="text-sm text-gray-600 mb-3">
          <span className="font-medium text-gray-700">Who: </span>{service.who}
        </div>
        <div className="flex gap-2 flex-wrap mb-3">
          {service.stages.map((stage, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-xs flex items-center justify-center font-medium">
                {i + 1}
              </span>
              <span className="text-xs text-gray-600">{stage}</span>
              {i < service.stages.length - 1 && (
                <span className="text-gray-300 text-xs">›</span>
              )}
            </div>
          ))}
        </div>
        {service.appointment && (
          <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
            <span>📅</span> An in-person appointment is required for this service.
          </div>
        )}
      </section>

      {/* Documents */}
      <section className="bg-white border border-gray-100 rounded-2xl p-4 mb-4">
        <h2 className="font-semibold text-gray-800 text-sm mb-3">What you&apos;ll need</h2>
        <div className="flex flex-col gap-3">
          {service.documents.map((doc, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-green-50 text-green-600 text-xs flex items-center justify-center mt-0.5 flex-shrink-0">
                ✓
              </span>
              <div>
                <div className="text-sm font-medium text-gray-800">{doc.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{doc.why}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="bg-white border border-gray-100 rounded-2xl p-4 mb-4">
        <h2 className="font-semibold text-gray-800 text-sm mb-3">How it works</h2>
        <div className="flex flex-col gap-4">
          {service.steps.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center font-semibold flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <div>
                <div className="text-sm font-medium text-gray-800">{step.title}</div>
                <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{step.desc}</div>
                {step.isGovt && (
                  <span className="inline-block mt-1 text-xs text-blue-600 bg-blue-50 rounded px-2 py-0.5">
                    On official website
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white border border-gray-100 rounded-2xl p-4 mb-4">
        <h2 className="font-semibold text-gray-800 text-sm mb-3">Common questions</h2>
        <div className="flex flex-col gap-4">
          {service.faqs.map((faq, i) => (
            <div key={i}>
              <div className="text-sm font-medium text-gray-800">{faq.q}</div>
              <div className="text-xs text-gray-500 mt-1 leading-relaxed">{faq.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Official website handoff */}
      <section className="bg-gray-900 text-white rounded-2xl p-5 mb-4">
        <div className="text-sm font-medium mb-1">Ready to start?</div>
        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
          This next step happens on the official government website. You&apos;ll
          complete the actual application there — we&apos;ll be here if you get
          stuck.
        </p>
        <a
          href={service.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-white text-gray-900 font-semibold text-sm py-3 rounded-xl"
        >
          Open {service.officialName} ↗
        </a>
      </section>

      {/* Ask FormSaathi placeholder */}
      <section className="border border-dashed border-gray-200 rounded-2xl p-4">
        <div className="text-sm font-medium text-gray-600 mb-1">Ask FormSaathi</div>
        <p className="text-xs text-gray-400 mb-3">
          Something unclear? Ask in English or Tamil — voice support coming soon.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your question…"
            className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-gray-400 bg-white"
          />
          <button className="bg-gray-900 text-white text-sm px-4 py-2.5 rounded-xl font-medium">
            Ask
          </button>
        </div>
      </section>
    </main>
  );
}
