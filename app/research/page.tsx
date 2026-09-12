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

function getAverageScore(scoreData: ScoreData) {
  const values = [
    scoreData.marketOpportunity,
    scoreData.demandStrength,
    scoreData.customerOpportunity,
    scoreData.marketRisk !== null
      ? 100 - scoreData.marketRisk
      : null,
    scoreData.competitivePressure !== null
      ? 100 - scoreData.competitivePressure
      : null,
  ].filter(
    (value): value is number => value !== null
  );

  if (!values.length) {
    return null;
  }

  return Math.round(
    values.reduce((sum, value) => sum + value, 0) /
      values.length
  );
}

function getOverallLabel(score: number | null) {
  if (score === null) return "Awaiting analysis";
  if (score >= 80) return "Highly attractive";
  if (score >= 65) return "Promising";
  if (score >= 50) return "Mixed opportunity";
  if (score >= 35) return "Challenging";
  return "High caution";
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
    <div className="group relative overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-cyan-50 blur-2xl transition group-hover:bg-blue-50" />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-lg">
            {icon}
          </div>

          <div className="rounded-full bg-slate-100 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-slate-500">
            {status}
          </div>
        </div>

        <div className="mt-6">
          <div className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
            {label}
          </div>

          <div className="mt-2 flex items-end gap-2">
            <div className="text-4xl font-black tracking-tight text-slate-950">
              {score ?? "—"}
            </div>

            <div className="mb-1 text-sm font-bold text-slate-400">
              / 100
            </div>
          </div>

          <p className="mt-3 min-h-[44px] text-xs leading-6 text-slate-500">
            {description}
          </p>

          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 transition-all duration-700"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
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

  const overallScore = getAverageScore(scoreData);

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#020617] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(79,70,229,0.24),transparent_38%)]" />

        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-9 sm:px-6 md:px-10 md:py-12">
          {/* NAV */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-lg font-black shadow-lg shadow-cyan-500/20">
                L
              </div>

              <div>
                <div className="text-lg font-black tracking-tight">
                  LaunchIQ
                </div>

                <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  Venture Intelligence
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-[9px] font-black uppercase tracking-widest text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Engine Online
            </div>
          </div>

          {/* HERO COPY */}
          <div className="mt-12 max-w-4xl md:mt-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-300">
              🔎 AI Market Intelligence
            </div>

            <h1 className="mt-5 text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl md:text-6xl">
              Research your market
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                before you launch.
              </span>
            </h1>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base md:text-lg">
              Turn your startup idea into a structured
              market intelligence report with AI-powered
              analysis across demand, customers,
              competition, growth and risk.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-bold text-slate-300">
                ✨ AI-generated
              </div>

              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-bold text-slate-300">
                ⚡ Gemini 3.5 Flash-Lite
              </div>

              <div className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-[10px] font-bold text-amber-200">
                ℹ️ Decision support
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WORKSPACE */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-6 md:px-10 md:py-12">
        <div className="grid gap-7 lg:grid-cols-[390px_1fr]">
          {/* CONFIGURATION */}
          <aside className="h-fit rounded-[1.8rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/40 sm:p-7 lg:sticky lg:top-6">
            <div className="mb-7">
              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-600">
                Research Configuration
              </div>

              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                Configure your analysis
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Define the venture you want LaunchIQ
                to evaluate.
              </p>
            </div>

            {/* BUSINESS */}
            <div className="mb-5">
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
            <div className="mb-5">
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
            <div className="mb-5">
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
            <div className="mb-5">
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

            {/* MODEL */}
            <div className="mb-6">
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

              <div className="mt-2 flex items-center gap-2 text-[10px] font-bold text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Powered by Google Gemini
              </div>
            </div>

            {/* FREE ENGINE NOTICE */}
            <div className="mb-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex gap-3">
                <div className="text-lg">ℹ️</div>

                <div>
                  <div className="text-xs font-black text-blue-900">
                    Free AI research engine
                  </div>

                  <p className="mt-1 text-[11px] leading-5 text-blue-700">
                    This analysis uses Gemini to
                    generate structured market
                    intelligence from your venture
                    configuration.
                  </p>
                </div>
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
                  LaunchIQ is researching...
                </span>
              ) : (
                "✨ Generate Market Research"
              )}
            </button>

            {error && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold leading-6 text-red-700">
                ⚠️ {error}
              </div>
            )}
          </aside>

          {/* REPORT AREA */}
          <div className="min-h-[600px] rounded-[1.8rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/40 sm:p-7 md:p-8">
            {/* EMPTY STATE */}
            {!research && !loading && (
              <div className="flex min-h-[540px] flex-col items-center justify-center px-4 text-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-[2rem] bg-cyan-200/40 blur-2xl" />

                  <div className="relative flex h-20 w-20 items-center justify-center rounded-[1.8rem] bg-gradient-to-br from-cyan-100 to-blue-100 text-4xl shadow-sm">
                    🔎
                  </div>
                </div>

                <div className="mt-7 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-600">
                  LaunchIQ Research Engine
                </div>

                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                  Ready to research
                </h2>

                <p className="mt-3 max-w-lg text-sm leading-7 text-slate-500">
                  Configure your venture and generate
                  an AI-powered market intelligence
                  report covering demand, customers,
                  competition, growth, risks and
                  investment considerations.
                </p>

                <div className="mt-7 grid w-full max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    ["📊", "Demand"],
                    ["🎯", "Customers"],
                    ["⚔️", "Competition"],
                    ["🚀", "Growth"],
                  ].map(([icon, label]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-4"
                    >
                      <div className="text-xl">
                        {icon}
                      </div>

                      <div className="mt-2 text-[10px] font-black uppercase tracking-wider text-slate-500">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LOADING */}
            {loading && (
              <div className="flex min-h-[540px] flex-col items-center justify-center px-4 text-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-cyan-300/30 blur-2xl" />

                  <div className="relative h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-500" />
                </div>

                <div className="mt-8 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-600">
                  Gemini Research Engine
                </div>

                <h2 className="mt-2 text-2xl font-black text-slate-950">
                  LaunchIQ is researching
                </h2>

                <p className="mt-3 max-w-lg text-sm leading-7 text-slate-500">
                  Building your market intelligence
                  assessment across demand, customers,
                  growth, competition, differentiation
                  and investment potential.
                </p>

                <div className="mt-7 flex flex-wrap justify-center gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-2 text-[10px] font-bold text-slate-500">
                    Analyzing demand
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-2 text-[10px] font-bold text-slate-500">
                    Mapping customers
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-2 text-[10px] font-bold text-slate-500">
                    Assessing competition
                  </span>
                </div>
              </div>
            )}

            {/* REPORT */}
            {research && !loading && (
              <div>
                {/* REPORT HEADER */}
                <div className="border-b border-slate-200 pb-7">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-600">
                          Market Intelligence Report
                        </div>

                        <div className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-600">
                          Generated
                        </div>
                      </div>

                      <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                        Market intelligence
                      </h2>

                      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        AI-generated assessment for{" "}
                        <span className="font-bold text-slate-700">
                          {business}
                        </span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={copyResearch}
                      className="shrink-0 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-black text-slate-700 transition hover:bg-slate-100"
                    >
                      {copied
                        ? "✓ Copied"
                        : "📋 Copy Report"}
                    </button>
                  </div>

                  {/* SOURCE STATUS */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    <div className="rounded-full border border-cyan-100 bg-cyan-50 px-3 py-2 text-[10px] font-bold text-cyan-700">
                      🤖 Gemini 3.5 Flash-Lite
                    </div>

                    <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-bold text-slate-600">
                      🧠 AI-generated analysis
                    </div>

                    <div className="rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-[10px] font-bold text-amber-700">
                      ℹ️ Not live web research
                    </div>
                  </div>
                </div>

                {/* EXECUTIVE SCORE */}
                <div className="mt-7 rounded-[1.6rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-xl">
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">
                        Executive Snapshot
                      </div>

                      <h3 className="mt-2 text-2xl font-black">
                        Overall opportunity
                      </h3>

                      <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
                        A directional AI assessment
                        combining opportunity, demand,
                        customer attractiveness and
                        competitive and market risk
                        signals.
                      </p>
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full border border-cyan-300/30 bg-white/5">
                        <div className="text-3xl font-black">
                          {overallScore ?? "—"}
                        </div>

                        <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                          / 100
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-black text-cyan-300">
                          {getOverallLabel(
                            overallScore
                          )}
                        </div>

                        <div className="mt-1 text-xs text-slate-400">
                          Directional AI indicator
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SNAPSHOT */}
                <div className="mt-8">
                  <div className="mb-5">
                    <div className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-600">
                      Intelligence Snapshot
                    </div>

                    <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                      Market opportunity at a glance
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      AI-generated indicators based on
                      your venture configuration and
                      generated research analysis.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <ScoreCard
                      icon="📊"
                      label="Market Opportunity"
                      score={
                        scoreData.marketOpportunity
                      }
                      description="Overall attractiveness of the opportunity."
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
                      description="Higher scores indicate stronger competition."
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
                      description="Potential attractiveness of the target customers."
                    />

                    {/* KEY INSIGHT */}
                    <div className="rounded-[1.6rem] border border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-5 shadow-sm">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-100 text-lg">
                        🧠
                      </div>

                      <div className="mt-6 text-[10px] font-black uppercase tracking-[0.14em] text-cyan-600">
                        Key Market Insight
                      </div>

                      <p className="mt-3 text-sm font-bold leading-7 text-slate-700">
                        {scoreData.keyInsight ||
                          "LaunchIQ has generated a market intelligence assessment based on the selected venture configuration."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CONFIGURATION */}
                <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                        Venture Profile
                      </div>

                      <div className="mt-1 text-sm font-black text-slate-800">
                        Research configuration
                      </div>
                    </div>

                    <div className="hidden rounded-full bg-white px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400 sm:block">
                      Analysis Context
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl bg-white p-4">
                      <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                        Country
                      </div>

                      <div className="mt-1 text-sm font-black text-slate-800">
                        🌍 {country}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white p-4">
                      <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                        Industry
                      </div>

                      <div className="mt-1 text-sm font-black text-slate-800">
                        🏭 {industry}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white p-4">
                      <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                        Target Market
                      </div>

                      <div className="mt-1 text-sm font-black text-slate-800">
                        🎯 {market}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white p-4">
                      <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                        AI Model
                      </div>

                      <div className="mt-1 text-sm font-black text-slate-800">
                        🤖 Gemini 3.5 Flash-Lite
                      </div>
                    </div>
                  </div>
                </div>

                {/* DETAILED ANALYSIS */}
                <div className="mt-10">
                  <div className="mb-5">
                    <div className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-600">
                      Detailed Analysis
                    </div>

                    <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                      Research intelligence
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Structured insights generated by
                      the LaunchIQ research engine.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {sections.map(
                      (section, index) => {
                        const icon =
                          getSectionIcon(
                            section.title
                          );

                        const isCompetitive =
                          section.title
                            .toLowerCase()
                            .includes("competitive");

                        const isDifferentiation =
                          section.title
                            .toLowerCase()
                            .includes(
                              "differentiation"
                            );

                        const isConclusion =
                          section.title
                            .toLowerCase()
                            .includes(
                              "conclusion"
                            );

                        return (
                          <div
                            key={`${section.number}-${index}`}
                            className={`overflow-hidden rounded-[1.5rem] border bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                              isCompetitive
                                ? "border-indigo-200"
                                : isDifferentiation
                                ? "border-cyan-200"
                                : isConclusion
                                ? "border-emerald-200"
                                : "border-slate-200"
                            }`}
                          >
                            <div className="p-5 sm:p-6 md:p-7">
                              <div className="flex gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-black text-white shadow-lg shadow-blue-500/20">
                                  {section.number ||
                                    String(
                                      index + 1
                                    ).padStart(
                                      2,
                                      "0"
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <div className="text-[9px] font-black uppercase tracking-[0.18em] text-cyan-600">
                                      LaunchIQ Intelligence
                                    </div>

                                    {isCompetitive && (
                                      <div className="rounded-full bg-indigo-50 px-2.5 py-1 text-[8px] font-black uppercase tracking-widest text-indigo-600">
                                        Competitive
                                      </div>
                                    )}

                                    {isDifferentiation && (
                                      <div className="rounded-full bg-cyan-50 px-2.5 py-1 text-[8px] font-black uppercase tracking-widest text-cyan-600">
                                        Strategy
                                      </div>
                                    )}

                                    {isConclusion && (
                                      <div className="rounded-full bg-emerald-50 px-2.5 py-1 text-[8px] font-black uppercase tracking-widest text-emerald-600">
                                        Decision Point
                                      </div>
                                    )}
                                  </div>

                                  <div className="mt-2 flex items-center gap-3">
                                    <span className="text-xl">
                                      {icon}
                                    </span>

                                    <h4 className="text-lg font-black tracking-tight text-slate-950 sm:text-xl">
                                      {section.title}
                                    </h4>
                                  </div>

                                  <div className="mt-5 whitespace-pre-wrap text-sm leading-8 text-slate-600">
                                    {section.content}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* COMPETITIVE INTELLIGENCE */}
                <div className="mt-8 rounded-[1.5rem] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-5 sm:p-6">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-xl">
                      ⚔️
                    </div>

                    <div>
                      <div className="text-sm font-black text-slate-950">
                        Competitive Intelligence
                      </div>

                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        LaunchIQ uses the competitive
                        landscape and differentiation
                        analysis to help identify where
                        your startup could create a
                        defensible position.
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {[
                          "⚔️ Competition",
                          "💪 Strengths",
                          "⚠️ Weaknesses",
                          "🎯 Positioning",
                          "🧠 Differentiation",
                        ].map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-white px-3 py-2 text-[10px] font-bold text-slate-600 shadow-sm"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* DECISION SUPPORT */}
                <div className="mt-6 rounded-[1.5rem] border border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-5 sm:p-6">
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-lg">
                      🧠
                    </div>

                    <div>
                      <div className="text-sm font-black text-slate-950">
                        LaunchIQ Decision Support
                      </div>

                      <p className="mt-2 text-xs leading-6 text-slate-600">
                        Use this report to identify
                        assumptions, opportunities and
                        questions worth validating before
                        investing significant time or
                        capital.
                      </p>
                    </div>
                  </div>
                </div>

                {/* IMPORTANT LIMITATION */}
                <div className="mt-5 rounded-[1.5rem] border border-amber-200 bg-amber-50 p-5">
                  <div className="flex gap-3">
                    <div className="text-xl">
                      ⚠️
                    </div>

                    <div>
                      <div className="text-sm font-black text-amber-950">
                        Important: AI-generated research
                      </div>

                      <p className="mt-1 text-xs leading-6 text-amber-800">
                        This report is generated by AI
                        from the venture information you
                        provide. It is not live web
                        research and should not be treated
                        as verified market data. Important
                        statistics, competitors,
                        regulations, pricing and
                        investment assumptions should be
                        independently verified before making
                        business decisions.
                      </p>
                    </div>
                  </div>
                </div>

                {/* REPORT FOOTER */}
                <div className="mt-7 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-xs font-black text-slate-700">
                      LaunchIQ Market Intelligence
                    </div>

                    <div className="mt-1 text-[10px] text-slate-400">
                      Powered by Gemini 3.5 Flash-Lite
                    </div>
                  </div>

                  <div className="text-[10px] font-bold text-slate-400">
                    AI decision-support prototype
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white px-5 py-8 text-center">
        <div className="text-sm font-black text-slate-800">
          LaunchIQ
        </div>

        <div className="mt-1 text-xs text-slate-400">
          AI Venture Intelligence Engine
        </div>

        <div className="mt-4 text-[10px] text-slate-400">
          © 2026 LaunchIQ — AI Venture Intelligence
          Platform
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