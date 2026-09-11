"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

const countries = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "Singapore",
  "United Arab Emirates",
  "Other",
];

const industries = [
  "Technology",
  "Fintech",
  "Healthcare",
  "Education",
  "E-commerce",
  "Food & Beverage",
  "Travel & Tourism",
  "Real Estate",
  "SaaS",
  "Logistics",
  "Manufacturing",
  "Other",
];

const targetMarkets = [
  "Small businesses",
  "Startups",
  "Consumers",
  "Enterprises",
  "Students",
  "Professionals",
  "Developers",
  "Healthcare customers",
  "Online shoppers",
  "Other",
];

const aiModels = ["Gemini 3.5 Flash-Lite"];

type ResearchSection = {
  number: string;
  title: string;
  content: string;
};

type ScoreData = {
  marketOpportunity: number | null;
  demandStrength: number | null;
  competitivePressure: number | null;
  marketRisk: number | null;
  customerOpportunity: number | null;
  keyInsight: string;
};

function cleanMarkdownText(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/^>\s?/gm, "")
    .trim();
}

function getScoreLabel(score: number | null) {
  if (score === null) return "Pending";
  if (score >= 80) return "Excellent";
  if (score >= 65) return "Strong";
  if (score >= 50) return "Moderate";
  if (score >= 35) return "Weak";
  return "Low";
}

function getCompetitionLabel(score: number | null) {
  if (score === null) return "Pending";
  if (score >= 80) return "Very High";
  if (score >= 65) return "High";
  if (score >= 50) return "Moderate";
  if (score >= 35) return "Low";
  return "Very Low";
}

function getRiskLabel(score: number | null) {
  if (score === null) return "Pending";
  if (score >= 80) return "Critical";
  if (score >= 65) return "Elevated";
  if (score >= 50) return "Moderate";
  if (score >= 35) return "Low";
  return "Very Low";
}

function extractScore(text: string, pattern: RegExp): number | null {
  const match = text.match(pattern);

  if (!match) {
    return null;
  }

  const value = Number(match[1]);

  if (Number.isNaN(value)) {
    return null;
  }

  return Math.max(0, Math.min(100, value));
}

function parseScoreData(text: string): ScoreData {
  const marketOpportunity = extractScore(
    text,
    /MARKET OPPORTUNITY SCORE\s*:?\s*(\d{1,3})/i
  );

  const demandStrength = extractScore(
    text,
    /DEMAND STRENGTH SCORE\s*:?\s*(\d{1,3})/i
  );

  const competitivePressure = extractScore(
    text,
    /COMPETITIVE PRESSURE SCORE\s*:?\s*(\d{1,3})/i
  );

  const marketRisk = extractScore(
    text,
    /MARKET RISK SCORE\s*:?\s*(\d{1,3})/i
  );

  const customerOpportunity = extractScore(
    text,
    /CUSTOMER OPPORTUNITY SCORE\s*:?\s*(\d{1,3})/i
  );

  const insightMatch = text.match(
    /KEY MARKET INSIGHT\s*:?\s*([\s\S]*?)(?=\n\s*(?:1[.)]\s+Market Overview|MARKET OVERVIEW))/i
  );

  return {
    marketOpportunity,
    demandStrength,
    competitivePressure,
    marketRisk,
    customerOpportunity,
    keyInsight: insightMatch
      ? cleanMarkdownText(insightMatch[1])
      : "",
  };
}

function parseResearch(text: string): ResearchSection[] {
  const lines = text.split("\n");
  const sections: ResearchSection[] = [];

  let currentNumber = "";
  let currentTitle = "";
  let currentContent: string[] = [];

  function saveCurrentSection() {
    if (!currentTitle && currentContent.length === 0) {
      return;
    }

    const content = currentContent
      .join("\n")
      .replace(/^---+$/gm, "")
      .trim();

    if (!content && !currentTitle) {
      return;
    }

    sections.push({
      number: currentNumber,
      title: cleanMarkdownText(
        currentTitle || "Research Analysis"
      ),
      content: cleanMarkdownText(content),
    });
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      if (currentContent.length > 0) {
        currentContent.push("");
      }

      continue;
    }

    if (/^-{3,}$/.test(line)) {
      continue;
    }

    const numberedHeading = line.match(
      /^#{0,6}\s*(\d+)[.)]\s+(.+)$/
    );

    if (numberedHeading) {
      saveCurrentSection();

      currentNumber = numberedHeading[1];

      currentTitle = cleanMarkdownText(
        numberedHeading[2]
      );

      currentContent = [];

      continue;
    }

    const markdownHeading = line.match(
      /^#{1,6}\s+(.+)$/
    );

    if (markdownHeading) {
      currentContent.push(
        cleanMarkdownText(markdownHeading[1])
      );

      continue;
    }

    currentContent.push(line);
  }

  saveCurrentSection();

  return sections.filter(
    (section) =>
      section.number &&
      section.title &&
      section.content
  );
}

function getSectionIcon(title: string) {
  const normalized = title.toLowerCase();

  if (normalized.includes("market overview")) return "📊";
  if (normalized.includes("market demand")) return "📈";
  if (normalized.includes("growth")) return "🚀";
  if (normalized.includes("customer")) return "🎯";
  if (normalized.includes("challenge")) return "⚠️";
  if (normalized.includes("competitive")) return "⚔️";
  if (normalized.includes("differentiation")) return "🧠";
  if (normalized.includes("regulatory")) return "⚖️";
  if (normalized.includes("investment")) return "💰";
  if (normalized.includes("conclusion")) return "🏁";

  return "🔎";
}

function ScoreCard({
  icon,
  label,
  score,
  description,
  type = "positive",
}: {
  icon: string;
  label: string;
  score: number | null;
  description: string;
  type?: "positive" | "competition" | "risk";
}) {
  let status = getScoreLabel(score);

  if (type === "competition") {
    status = getCompetitionLabel(score);
  }

  if (type === "risk") {
    status = getRiskLabel(score);
  }

  const progress = score === null ? 0 : score;

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl">
          {icon}
        </div>

        <div className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500">
          {status}
        </div>
      </div>

      <div className="mt-7">
        <div className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-400">
          {label}
        </div>

        <div className="mt-2 flex items-end gap-2">
          <div className="text-4xl font-black tracking-tight text-slate-900">
            {score ?? "—"}
          </div>

          <div className="mb-1 text-sm font-bold text-slate-400">
            / 100
          </div>
        </div>

        <p className="mt-3 min-h-[48px] text-sm leading-6 text-slate-500">
          {description}
        </p>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 transition-all duration-700"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function ResearchPageContent() {
  const searchParams = useSearchParams();

  const [business, setBusiness] = useState(
    searchParams.get("business") ||
      "AI-powered business platform"
  );

  const [country, setCountry] = useState(
    searchParams.get("country") || "India"
  );

  const [industry, setIndustry] = useState(
    searchParams.get("industry") || "Technology"
  );

  const [market, setMarket] = useState(
    searchParams.get("market") || "Small businesses"
  );

  const [model, setModel] = useState(
    "Gemini 3.5 Flash-Lite"
  );

  const [research, setResearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function generateResearch() {
    if (!business.trim()) {
      setError("Please enter a business idea.");
      return;
    }

    setLoading(true);
    setError("");
    setResearch("");
    setCopied(false);

    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          business,
          country,
          industry,
          market,
          model,
        }),
      });

      const responseText = await response.text();

      let data: {
        research?: string;
        error?: string;
      } | null = null;

      try {
        data = responseText
          ? JSON.parse(responseText)
          : null;
      } catch {
        throw new Error(
          responseText ||
            "The research server returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            `Research request failed with status ${response.status}.`
        );
      }

      if (!data?.research) {
        throw new Error(
          "The research engine returned an empty report."
        );
      }

      setResearch(data.research);
    } catch (err) {
      console.error(
        "LaunchIQ Research Error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to generate market research."
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyResearch() {
    if (!research) {
      return;
    }

    try {
      await navigator.clipboard.writeText(research);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError(
        "Unable to copy the research report."
      );
    }
  }

  const scoreData = research
    ? parseScoreData(research)
    : {
        marketOpportunity: null,
        demandStrength: null,
        competitivePressure: null,
        marketRisk: null,
        customerOpportunity: null,
        keyInsight: "",
      };

  const sections = research
    ? parseResearch(research)
    : [];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#020617] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(79,70,229,0.22),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-14">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-xl font-black shadow-lg shadow-cyan-500/20">
                L
              </div>

              <div>
                <div className="text-lg font-black tracking-tight">
                  LaunchIQ
                </div>

                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  Venture Intelligence
                </div>
              </div>
            </div>

            <div className="hidden rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold text-emerald-300 md:block">
              ● Research Engine Online
            </div>
          </div>

          <div className="mt-14 max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-cyan-300">
              🔎 AI Market Research
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight md:text-6xl">
              Research your market

              <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                before you launch.
              </span>
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
              Configure your venture, choose your
              research engine and generate a
              structured market intelligence report
              for your startup idea.
            </p>
          </div>
        </div>
      </section>

      {/* WORKSPACE */}
      <section className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          {/* INPUT PANEL */}
          <div className="h-fit rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 md:p-8">
            <div className="mb-8">
              <div className="text-xs font-black uppercase tracking-[0.18em] text-cyan-600">
                Research Configuration
              </div>

              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                Configure your analysis
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Enter your venture information before
                generating the research report.
              </p>
            </div>

            {/* BUSINESS */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-black text-slate-800">
                💡 Business Idea
              </label>

              <textarea
                value={business}
                onChange={(e) =>
                  setBusiness(e.target.value)
                }
                placeholder="Describe your business idea..."
                rows={4}
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              />
            </div>

            {/* COUNTRY */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-black text-slate-800">
                🌍 Country
              </label>

              <select
                value={country}
                onChange={(e) =>
                  setCountry(e.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              >
                {countries.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* INDUSTRY */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-black text-slate-800">
                🏭 Industry
              </label>

              <select
                value={industry}
                onChange={(e) =>
                  setIndustry(e.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              >
                {industries.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* TARGET MARKET */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-black text-slate-800">
                🎯 Target Market
              </label>

              <select
                value={market}
                onChange={(e) =>
                  setMarket(e.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              >
                {targetMarkets.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* AI MODEL */}
            <div className="mb-8">
              <label className="mb-2 block text-sm font-black text-slate-800">
                🤖 AI Research Model
              </label>

              <select
                value={model}
                onChange={(e) =>
                  setModel(e.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              >
                {aiModels.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <div className="mt-2 text-xs font-medium text-slate-400">
                Powered by Google Gemini
              </div>
            </div>

            {/* GENERATE */}
            <button
              type="button"
              onClick={generateResearch}
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-6 py-4 text-sm font-black text-white shadow-xl shadow-blue-500/20 transition hover:-translate-y-0.5 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Researching market...
                </span>
              ) : (
                "✨ Generate Market Research"
              )}
            </button>

            {error && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold leading-6 text-red-700">
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* RESULTS */}
          <div className="min-h-[500px] rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 md:p-8">
            {/* EMPTY */}
            {!research && !loading && (
              <div className="flex min-h-[450px] flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-100 to-blue-100 text-4xl">
                  🔎
                </div>

                <h2 className="mt-6 text-2xl font-black text-slate-900">
                  Ready to research
                </h2>

                <p className="mt-3 max-w-lg text-sm leading-7 text-slate-500">
                  Configure your business idea,
                  country, industry, target market and
                  AI research model. Then generate your
                  market intelligence report.
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600">
                    📊 Market Demand
                  </span>

                  <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600">
                    🎯 Customers
                  </span>

                  <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600">
                    ⚔️ Competition
                  </span>

                  <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600">
                    🚀 Growth
                  </span>
                </div>
              </div>
            )}

            {/* LOADING */}
            {loading && (
              <div className="flex min-h-[450px] flex-col items-center justify-center text-center">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-500" />

                <h2 className="mt-8 text-2xl font-black text-slate-900">
                  LaunchIQ is researching...
                </h2>

                <p className="mt-3 max-w-lg text-sm leading-7 text-slate-500">
                  Analyzing market demand,
                  customers, growth drivers, competition,
                  differentiation and investment potential.
                </p>
              </div>
            )}

            {/* REPORT */}
            {research && !loading && (
              <div>
                {/* HEADER */}
                <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.18em] text-cyan-600">
                      Detailed Analysis
                    </div>

                    <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                      Market intelligence report
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      {business}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={copyResearch}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-black text-slate-700 transition hover:bg-slate-100"
                  >
                    {copied
                      ? "✓ Copied"
                      : "📋 Copy Report"}
                  </button>
                </div>

                {/* SNAPSHOT */}
                <div className="mb-8">
                  <div className="mb-5">
                    <div className="text-xs font-black uppercase tracking-[0.18em] text-cyan-600">
                      Intelligence Snapshot
                    </div>

                    <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                      Market opportunity at a glance
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      AI-generated indicators based on
                      the venture configuration and
                      research analysis.
                    </p>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    <ScoreCard
                      icon="📊"
                      label="Market Opportunity"
                      score={
                        scoreData.marketOpportunity
                      }
                      description="Overall attractiveness of the market opportunity."
                    />

                    <ScoreCard
                      icon="📈"
                      label="Demand Strength"
                      score={
                        scoreData.demandStrength
                      }
                      description="Estimated strength of customer demand."
                    />

                    <ScoreCard
                      icon="⚔️"
                      label="Competitive Pressure"
                      score={
                        scoreData.competitivePressure
                      }
                      type="competition"
                      description="Higher scores indicate stronger competitive pressure."
                    />

                    <ScoreCard
                      icon="⚠️"
                      label="Market Risk"
                      score={scoreData.marketRisk}
                      type="risk"
                      description="Higher scores indicate greater market risk."
                    />

                    <ScoreCard
                      icon="🎯"
                      label="Customer Opportunity"
                      score={
                        scoreData.customerOpportunity
                      }
                      description="Potential attractiveness of the target customer base."
                    />

                    {/* KEY INSIGHT */}
                    <div className="rounded-[1.75rem] border border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-6 shadow-sm">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-xl">
                        🧠
                      </div>

                      <div className="mt-7 text-[11px] font-black uppercase tracking-[0.12em] text-cyan-600">
                        Key Market Insight
                      </div>

                      <p className="mt-4 text-sm font-bold leading-7 text-slate-700">
                        {scoreData.keyInsight ||
                          "LaunchIQ has generated a market intelligence assessment based on the selected venture configuration."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CONFIGURATION */}
                <div className="mb-8 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="mb-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Research Configuration
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl bg-white p-4">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Country
                      </div>

                      <div className="mt-1 text-sm font-black text-slate-800">
                        🌍 {country}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white p-4">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Industry
                      </div>

                      <div className="mt-1 text-sm font-black text-slate-800">
                        🏭 {industry}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white p-4">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Target Market
                      </div>

                      <div className="mt-1 text-sm font-black text-slate-800">
                        🎯 {market}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white p-4">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        AI Model
                      </div>

                      <div className="mt-1 text-sm font-black text-slate-800">
                        🤖 Gemini 3.5 Flash-Lite
                      </div>
                    </div>
                  </div>
                </div>

                {/* DETAILED REPORT */}
                <div className="mb-5">
                  <div className="text-xs font-black uppercase tracking-[0.18em] text-cyan-600">
                    Detailed Analysis
                  </div>

                  <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                    Research intelligence
                  </h3>
                </div>

                <div className="space-y-5">
                  {sections.map(
                    (section, index) => {
                      const icon = getSectionIcon(
                        section.title
                      );

                      const isCompetitive =
                        section.title
                          .toLowerCase()
                          .includes("competitive");

                      const isDifferentiation =
                        section.title
                          .toLowerCase()
                          .includes("differentiation");

                      return (
                        <div
                          key={`${section.number}-${index}`}
                          className={`group overflow-hidden rounded-3xl border bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                            isCompetitive
                              ? "border-indigo-200"
                              : isDifferentiation
                              ? "border-cyan-200"
                              : "border-slate-200"
                          }`}
                        >
                          <div className="flex gap-5 p-6 md:p-7">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-black text-white shadow-lg shadow-blue-500/20">
                              {section.number ||
                                String(
                                  index + 1
                                ).padStart(2, "0")}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-600">
                                  LaunchIQ Intelligence
                                </div>

                                {isCompetitive && (
                                  <div className="rounded-full bg-indigo-50 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-indigo-600">
                                    Competitive Intelligence
                                  </div>
                                )}
                              </div>

                              <div className="mt-2 flex items-center gap-3">
                                <span className="text-xl">
                                  {icon}
                                </span>

                                <h4 className="text-xl font-black tracking-tight text-slate-900">
                                  {section.title}
                                </h4>
                              </div>

                              <div className="mt-5 whitespace-pre-wrap text-sm leading-8 text-slate-600">
                                {section.content}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>

                {/* COMPETITIVE CTA */}
                <div className="mt-8 rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-6 md:p-7">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-xl">
                      ⚔️
                    </div>

                    <div>
                      <div className="text-sm font-black text-slate-900">
                        Competitive Intelligence
                      </div>

                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        Use the competitive landscape
                        and differentiation analysis to
                        understand where your startup may
                        have an opportunity to compete.
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm">
                          ⚔️ Competitors
                        </span>

                        <span className="rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm">
                          💪 Strengths
                        </span>

                        <span className="rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm">
                          ⚠️ Weaknesses
                        </span>

                        <span className="rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm">
                          🎯 Positioning
                        </span>

                        <span className="rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm">
                          🧠 Differentiation
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* INSIGHT */}
                <div className="mt-8 rounded-3xl border border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-6">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-lg">
                      🧠
                    </div>

                    <div>
                      <div className="text-sm font-black text-slate-900">
                        LaunchIQ Research Insight
                      </div>

                      <p className="mt-2 text-xs leading-6 text-slate-600">
                        Use this research as
                        decision-support information.
                        Important market statistics,
                        competitors, regulations and
                        investment assumptions should be
                        independently verified before making
                        business decisions.
                      </p>
                    </div>
                  </div>
                </div>

                {/* DISCLAIMER */}
                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <div className="flex gap-3">
                    <div className="text-xl">⚠️</div>

                    <div>
                      <div className="text-sm font-black text-amber-900">
                        Research Disclaimer
                      </div>

                      <p className="mt-1 text-xs leading-6 text-amber-800">
                        This report is AI-generated
                        market intelligence intended for
                        research and decision-support
                        purposes. Verify important market
                        statistics, regulations, competitors
                        and investment assumptions
                        independently before making business
                        decisions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white px-6 py-8 text-center">
        <div className="text-sm font-black text-slate-800">
          LaunchIQ
        </div>

        <div className="mt-1 text-xs text-slate-400">
          AI Venture Intelligence Engine
        </div>

        <div className="mt-4 text-xs text-slate-400">
          © 2026 LaunchIQ — AI Venture Intelligence Platform
        </div>
      </footer>
    </main>
  );
}

export default function ResearchPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-500" />

            <p className="mt-4 text-sm font-bold text-slate-600">
              Loading LaunchIQ Research...
            </p>
          </div>
        </main>
      }
    >
      <ResearchPageContent />
    </Suspense>
  );
}