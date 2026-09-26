import Link from "next/link";

const services = [
  {
    id: "driving-licence",
    icon: "🚗",
    title: "Driving Licence",
    titleTa: "ஓட்டுநர் உரிமம்",
    description: "Get your learner's licence or full driving licence.",
    steps: "6 steps · Parivahan portal",
    color: "bg-orange-50 border-orange-200",
    iconBg: "bg-orange-100",
  },
  {
    id: "voter-id",
    icon: "🗳️",
    title: "Voter ID",
    titleTa: "வாக்காளர் அடையாள அட்டை",
    description: "Register to vote for the first time.",
    steps: "4 steps · ECI portal",
    color: "bg-blue-50 border-blue-200",
    iconBg: "bg-blue-100",
  },
  {
    id: "passport",
    icon: "🛂",
    title: "Passport",
    titleTa: "பாஸ்போர்ட்",
    description: "Apply for your first passport or renew an existing one.",
    steps: "7 steps · Passport Seva",
    color: "bg-green-50 border-green-200",
    iconBg: "bg-green-100",
  },
  {
    id: "aadhaar-update",
    icon: "🪪",
    title: "Aadhaar Update",
    titleTa: "ஆதார் புதுப்பிப்பு",
    description: "Update your address, name, phone, or photo.",
    steps: "3–5 steps · UIDAI portal",
    color: "bg-purple-50 border-purple-200",
    iconBg: "bg-purple-100",
  },
];

export default function Home() {
  return (
    <main className="max-w-lg mx-auto px-4 pt-10 pb-16">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">🪷</span>
          <span className="font-semibold text-lg tracking-tight">FormSaathi</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-2">
          Your elder sister for becoming an adult.
        </h1>
        <p className="text-gray-500 text-base leading-relaxed">
          Turned 18? Here&apos;s what you need to know about your first
          government IDs — in plain language, step by step.
        </p>
      </div>

      {/* Language selector */}
      <div className="flex gap-2 mb-8">
        <button className="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-900 text-white">
          English
        </button>
        <button className="px-4 py-1.5 rounded-full text-sm font-medium bg-white border border-gray-200 text-gray-600">
          தமிழ்
        </button>
      </div>

      {/* Service cards */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
          What do you want to get done?
        </p>
        {services.map((s) => (
          <Link
            key={s.id}
            href={`/services/${s.id}`}
            className={`flex items-start gap-4 p-4 rounded-2xl border ${s.color} transition-transform active:scale-[0.98]`}
          >
            <div className={`${s.iconBg} rounded-xl p-2.5 text-2xl leading-none`}>
              {s.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 text-base">
                {s.title}
              </div>
              <div className="text-xs text-gray-400 mb-1">{s.titleTa}</div>
              <div className="text-sm text-gray-600 leading-snug">
                {s.description}
              </div>
              <div className="text-xs text-gray-400 mt-1.5">{s.steps}</div>
            </div>
            <span className="text-gray-300 text-lg mt-0.5">›</span>
          </Link>
        ))}
      </div>

      {/* Footer note */}
      <p className="mt-10 text-xs text-center text-gray-400 leading-relaxed">
        FormSaathi explains the process. You do the actual application yourself
        on the official government website.
      </p>
    </main>
  );
}
