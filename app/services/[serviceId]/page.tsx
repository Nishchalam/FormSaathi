"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/lang";
import { getService, sectionLabels } from "@/lib/services/data";

export default function ServicePage({ params }: { params: Promise<{ serviceId: string }> }) {
  const { serviceId } = use(params);
  const { lang, mounted } = useLanguage();
  const service = getService(serviceId);

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [askText, setAskText] = useState("");
  const [askAnswer, setAskAnswer] = useState("");
  const [askLoading, setAskLoading] = useState(false);

  const labels = sectionLabels[mounted ? lang : "en"];

  const handleAsk = async () => {
    const q = askText.trim();
    if (!q || askLoading) return;
    setAskLoading(true);
    setAskAnswer("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "qa",
          serviceId,
          lang: mounted ? lang : "en",
          question: q,
          history: [],
        }),
      });
      const data = await res.json();
      setAskAnswer(data.reply ?? "Something went wrong.");
    } catch {
      setAskAnswer("Something went wrong. Please try again.");
    } finally {
      setAskLoading(false);
    }
  };

  if (!service) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg font-semibold mb-3">Service not found.</p>
          <Link href="/home" className="text-sm" style={{ color: "var(--accent)" }}>← Back to home</Link>
        </div>
      </main>
    );
  }

  const title = mounted ? service.titles[lang] : service.titles.en;
  const tagline = mounted ? service.taglines[lang] : service.taglines.en;

  return (
    <main className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Hero */}
      <div
        className="relative overflow-hidden px-4 pt-10 pb-8"
        style={{ background: "linear-gradient(135deg, #1C1C2E 0%, #2D1B69 60%, #1C1C2E 100%)" }}
      >
        <div className="max-w-lg mx-auto">
          <Link href="/home" className="text-sm mb-4 block" style={{ color: "rgba(255,255,255,0.5)" }}>
            {labels.back}
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-gradient-to-br ${service.gradient} shadow-lg`}>
              {service.icon}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white leading-tight">{title}</h1>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${service.badge}`}>{service.meta}</span>
            </div>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>{tagline}</p>
          <Link
            href={`/guide/${service.id}`}
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold px-4 py-2 rounded-xl"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            {labels.guideMe}
          </Link>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-6">
        {/* At a glance */}
        <section className="rounded-2xl p-4" style={{ background: "var(--card)", boxShadow: "var(--card-shadow)" }}>
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: "var(--muted)" }}>
            {labels.glance}
          </h2>
          <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>
            <strong style={{ color: "var(--foreground)" }}>{labels.who}:</strong> {service.who}
          </p>
          <div className="flex flex-wrap gap-2">
            {service.stages.map((s, i) => (
              <div key={i} className="flex items-center gap-1">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>
                  {s}
                </span>
                {i < service.stages.length - 1 && <span className="text-xs" style={{ color: "var(--muted)" }}>›</span>}
              </div>
            ))}
          </div>
          {service.appointment && (
            <p className="text-xs mt-3" style={{ color: "var(--muted)" }}>📅 {labels.apptNote}</p>
          )}
        </section>

        {/* Documents */}
        <section>
          <h2 className="text-base font-bold mb-3">{labels.docs}</h2>
          <div className="flex flex-col gap-2.5">
            {service.documents.map((doc, i) => (
              <div key={i} className="rounded-xl p-3.5" style={{ background: "var(--card)", boxShadow: "var(--card-shadow)" }}>
                <p className="text-sm font-semibold mb-0.5">{doc.name}</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{doc.why}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Steps */}
        <section>
          <h2 className="text-base font-bold mb-3">{labels.steps}</h2>
          <div className="flex flex-col gap-2.5">
            {service.steps.map((step, i) => (
              <div key={i} className="rounded-xl p-4 flex items-start gap-3" style={{ background: "var(--card)", boxShadow: "var(--card-shadow)" }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-sm font-semibold">{step.title}</p>
                    {step.isGovt && (
                      <span className="text-xs font-medium px-1.5 py-0.5 rounded-full" style={{ background: "rgba(22,163,74,0.1)", color: "rgb(22,163,74)" }}>
                        Official site
                      </span>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section>
          <h2 className="text-base font-bold mb-3">{labels.faq}</h2>
          <div className="flex flex-col gap-2">
            {service.faqs.map((faq, i) => (
              <div key={i} className="rounded-xl overflow-hidden" style={{ background: "var(--card)", boxShadow: "var(--card-shadow)" }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full text-left px-4 py-3.5 flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold">{faq.q}</span>
                  <span className="text-xs flex-shrink-0" style={{ color: "var(--muted)" }}>{openFaq === i ? "▲" : "▼"}</span>
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 border-t" style={{ borderColor: "var(--border)" }}>
                    <p className="text-sm leading-relaxed pt-3" style={{ color: "var(--muted)" }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Ask FormSaathi */}
        <section className="rounded-2xl p-4" style={{ background: "var(--card)", boxShadow: "var(--card-shadow)" }}>
          <h2 className="text-base font-bold mb-1">{labels.ask}</h2>
          <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>{labels.askDesc}</p>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={askText}
              onChange={(e) => setAskText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAsk()}
              placeholder={labels.askPlaceholder}
              className="flex-1 text-sm px-3 py-2.5 rounded-xl border outline-none"
              style={{ background: "var(--background)", borderColor: "var(--border)" }}
            />
            <button
              onClick={handleAsk}
              disabled={!askText.trim() || askLoading}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: "var(--accent)", opacity: askText.trim() && !askLoading ? 1 : 0.5 }}
            >
              {askLoading ? "…" : labels.askBtn}
            </button>
          </div>
          {askAnswer && (
            <div className="rounded-xl px-3 py-3 text-sm leading-relaxed" style={{ background: "var(--accent-light)", color: "var(--foreground)" }}>
              {askAnswer}
            </div>
          )}
        </section>

        {/* Official CTA */}
        <section className="rounded-2xl p-5 text-center" style={{ background: "linear-gradient(135deg, #1C1C2E, #2D1B69)" }}>
          <h2 className="text-base font-bold text-white mb-2">{labels.ready}</h2>
          <p className="text-xs mb-5" style={{ color: "rgba(255,255,255,0.6)" }}>{labels.readyDesc}</p>
          <a
            href={service.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-5 py-2.5 rounded-xl text-sm font-semibold text-white mb-3"
            style={{ background: "var(--accent)" }}
          >
            {labels.open} {service.officialName} ↗
          </a>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            {labels.lastVerified}: {service.lastVerified}
          </p>
        </section>
      </div>
    </main>
  );
}
