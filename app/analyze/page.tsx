"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AnalyzePage() {
  const router = useRouter();

  const [businessIdea, setBusinessIdea] = useState("");
  const [country, setCountry] = useState("India");
  const [industry, setIndustry] = useState("Technology");
  const [targetMarket, setTargetMarket] = useState("");
  const [investment, setInvestment] = useState("");
  const [businessModel, setBusinessModel] = useState("Subscription");
  const [launchTimeline, setLaunchTimeline] = useState("Within 6 months");
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!businessIdea || !targetMarket || !investment) {
      alert("Please complete the required fields.");
      return;
    }

    setIsLoading(true);

    const params = new URLSearchParams({
      business: businessIdea,
      country,
      market: targetMarket,
      investment,
      model: businessModel,
      industry,
      timeline: launchTimeline,
    });

    router.push(`/results?${params.toString()}`);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">

          <a
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-lg font-bold text-white shadow-md">
              L
            </div>

            <div>
              <div className="text-xl font-bold tracking-tight text-slate-900">
                Launch<span className="text-blue-600">IQ</span>
              </div>

              <div className="hidden text-[10px] font-semibold uppercase tracking-widest text-slate-400 sm:block">
                Venture Intelligence
              </div>
            </div>
          </a>

          <div className="flex items-center gap-3">
            <span className="hidden rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 sm:block">
              Venture Analysis
            </span>

            <a
              href="/"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Exit
            </a>
          </div>

        </div>
      </nav>


      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-white">

        <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl" />
        <div className="absolute -right-32 top-20 h-80 w-80 rounded-full bg-violet-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-6 pb-12 pt-16 text-center lg:px-8">

          <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-700">
            <span>✦</span>
            LaunchIQ Intelligence Engine
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Turn your idea into a
            <span className="block bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              venture intelligence report
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Tell LaunchIQ about your venture. We'll evaluate the market,
            competition, economics and risk to help you understand the
            opportunity before you invest.
          </p>

          {/* Progress */}
          <div className="mx-auto mt-10 flex max-w-xl items-center justify-center">

            <div className="flex items-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-md">
                1
              </div>

              <div className="h-1 w-16 bg-gradient-to-r from-blue-600 to-violet-500 sm:w-28" />
            </div>

            <div className="flex items-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
                2
              </div>

              <div className="h-1 w-16 bg-slate-200 sm:w-28" />
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-400">
              3
            </div>

          </div>

          <div className="mt-3 flex justify-center gap-16 text-[11px] font-semibold uppercase tracking-wider text-slate-400 sm:gap-28">
            <span className="text-blue-600">Your venture</span>
            <span>Intelligence</span>
            <span>Decision</span>
          </div>

        </div>
      </section>


      {/* ================= FORM SECTION ================= */}
      <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8 lg:py-14">

        <form onSubmit={handleSubmit}>

          {/* Main Card */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">

            {/* Card Header */}
            <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-7 sm:px-10">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-xl">
                  💡
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-950">
                    Tell us about your venture
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Start with the basics. These details power your LaunchIQ
                    intelligence report.
                  </p>
                </div>

              </div>

            </div>


            {/* Form Body */}
            <div className="space-y-8 px-6 py-8 sm:px-10 sm:py-10">


              {/* ================= BUSINESS IDEA ================= */}
              <div>

                <div className="flex items-center justify-between">
                  <label
                    htmlFor="businessIdea"
                    className="text-sm font-bold text-slate-900"
                  >
                    Business idea
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <span className="text-xs text-slate-400">
                    Be specific
                  </span>
                </div>

                <textarea
                  id="businessIdea"
                  value={businessIdea}
                  onChange={(e) => setBusinessIdea(e.target.value)}
                  placeholder="Example: AI-powered platform that helps small businesses automate customer support"
                  rows={4}
                  className="mt-3 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />

                <p className="mt-2 text-xs text-slate-400">
                  What are you building, and what problem does it solve?
                </p>

              </div>


              {/* ================= TWO COLUMN ================= */}
              <div className="grid gap-6 md:grid-cols-2">

                {/* Country */}
                <div>
                  <label
                    htmlFor="country"
                    className="text-sm font-bold text-slate-900"
                  >
                    🌍 Country
                  </label>

                  <select
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  >
                    <option>India</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>United Arab Emirates</option>
                    <option>Singapore</option>
                    <option>Australia</option>
                    <option>Canada</option>
                    <option>Germany</option>
                    <option>Other</option>
                  </select>

                  <p className="mt-2 text-xs text-slate-400">
                    Where will the venture primarily operate?
                  </p>
                </div>


                {/* Industry */}
                <div>
                  <label
                    htmlFor="industry"
                    className="text-sm font-bold text-slate-900"
                  >
                    🏭 Industry
                  </label>

                  <select
                    id="industry"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  >
                    <option>Technology</option>
                    <option>Healthcare</option>
                    <option>FinTech</option>
                    <option>Education</option>
                    <option>E-commerce</option>
                    <option>Food & Beverage</option>
                    <option>Travel & Hospitality</option>
                    <option>Logistics</option>
                    <option>Real Estate</option>
                    <option>Manufacturing</option>
                    <option>Other</option>
                  </select>

                  <p className="mt-2 text-xs text-slate-400">
                    Which sector best describes your venture?
                  </p>
                </div>

              </div>


              {/* ================= TARGET CUSTOMER ================= */}
              <div>

                <label
                  htmlFor="targetMarket"
                  className="text-sm font-bold text-slate-900"
                >
                  🎯 Target customer
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  id="targetMarket"
                  type="text"
                  value={targetMarket}
                  onChange={(e) => setTargetMarket(e.target.value)}
                  placeholder="Example: College students aged 18–25 in Indian cities"
                  className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Who is most likely to pay for your product or service?
                </p>

              </div>


              {/* ================= INVESTMENT ================= */}
              <div>

                <label
                  htmlFor="investment"
                  className="text-sm font-bold text-slate-900"
                >
                  💰 Initial investment
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <div className="relative mt-3">

                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                    ₹
                  </div>

                  <input
                    id="investment"
                    type="text"
                    value={investment}
                    onChange={(e) => setInvestment(e.target.value)}
                    placeholder="Example: 50 lakh"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-4 pl-10 pr-5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />

                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Approximate capital available to launch the venture.
                </p>

              </div>


              {/* ================= BUSINESS MODEL ================= */}
              <div>

                <label className="text-sm font-bold text-slate-900">
                  💼 Business model
                </label>

                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">

                  {[
                    {
                      name: "Subscription",
                      icon: "🔄",
                      description: "Recurring revenue",
                    },
                    {
                      name: "SaaS",
                      icon: "☁️",
                      description: "Software service",
                    },
                    {
                      name: "Marketplace",
                      icon: "🛒",
                      description: "Connect buyers & sellers",
                    },
                    {
                      name: "Commission",
                      icon: "💳",
                      description: "Transaction based",
                    },
                    {
                      name: "Direct Sales",
                      icon: "🏷️",
                      description: "Sell directly",
                    },
                    {
                      name: "Freemium",
                      icon: "🆓",
                      description: "Free + premium",
                    },
                  ].map((option) => {

                    const selected = businessModel === option.name;

                    return (
                      <button
                        key={option.name}
                        type="button"
                        onClick={() => setBusinessModel(option.name)}
                        className={`rounded-2xl border p-4 text-left transition ${
                          selected
                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >

                        <div className="flex items-center justify-between">

                          <span className="text-xl">
                            {option.icon}
                          </span>

                          {selected && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                              ✓
                            </span>
                          )}

                        </div>

                        <div className="mt-3 text-sm font-bold text-slate-900">
                          {option.name}
                        </div>

                        <div className="mt-1 text-[11px] text-slate-400">
                          {option.description}
                        </div>

                      </button>
                    );
                  })}

                </div>

              </div>


              {/* ================= TIMELINE ================= */}
              <div>

                <label
                  htmlFor="timeline"
                  className="text-sm font-bold text-slate-900"
                >
                  🚀 Launch timeline
                </label>

                <select
                  id="timeline"
                  value={launchTimeline}
                  onChange={(e) => setLaunchTimeline(e.target.value)}
                  className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                >
                  <option>Within 3 months</option>
                  <option>Within 6 months</option>
                  <option>Within 12 months</option>
                  <option>More than 12 months</option>
                  <option>Still exploring</option>
                </select>

                <p className="mt-2 text-xs text-slate-400">
                  How soon are you planning to launch?
                </p>

              </div>


              {/* ================= INFO BOX ================= */}
              <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-violet-50 p-5">

                <div className="flex gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-lg shadow-sm">
                    🧠
                  </div>

                  <div>

                    <h3 className="text-sm font-bold text-slate-900">
                      What happens next?
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      LaunchIQ will combine your venture information with its
                      intelligence engine to estimate opportunity, competition,
                      financial potential and risk.
                    </p>

                  </div>

                </div>

              </div>


              {/* ================= SUBMIT ================= */}
              <div className="pt-2">

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-7 py-5 text-base font-bold text-white shadow-xl shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-blue-200 disabled:cursor-not-allowed disabled:opacity-70"
                >

                  {isLoading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Building your intelligence report...
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      Analyze My Venture
                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </>
                  )}

                </button>

                <p className="mt-3 text-center text-xs text-slate-400">
                  Takes only a few seconds • No signup required
                </p>

              </div>

            </div>
          </div>


          {/* ================= TRUST CARDS ================= */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">

            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
              <div className="text-2xl">📊</div>
              <h3 className="mt-3 text-sm font-bold text-slate-900">
                Market Intelligence
              </h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Understand market opportunity and growth potential.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
              <div className="text-2xl">⚔️</div>
              <h3 className="mt-3 text-sm font-bold text-slate-900">
                Competitive Intelligence
              </h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                See how competitive pressure could affect your venture.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
              <div className="text-2xl">🛡️</div>
              <h3 className="mt-3 text-sm font-bold text-slate-900">
                Risk Intelligence
              </h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Identify major risks before committing capital.
              </p>
            </div>

          </div>

        </form>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-200 bg-white px-6 py-10">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">

          <div>
            <div className="text-lg font-bold text-slate-900">
              Launch<span className="text-blue-600">IQ</span>
            </div>

            <p className="mt-1 text-xs text-slate-400">
              AI-powered venture intelligence.
            </p>
          </div>

          <p className="text-xs text-slate-400">
            © 2026 LaunchIQ — AI Venture Intelligence Engine
          </p>

        </div>

      </footer>

    </main>
  );
}