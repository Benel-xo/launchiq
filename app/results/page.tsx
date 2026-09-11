"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

import { calculateVentureScore } from "@/lib/score";
import { calculateFinancialModel } from "@/lib/financial";
import { calculateMarketIntelligence } from "@/lib/market";
import { calculateCompetitorIntelligence } from "@/lib/competitor";
import { calculateRiskIntelligence } from "@/lib/risk";

/* =========================================================
   HELPERS
========================================================= */

function safeNumber(
  value: unknown,
  fallback = 0,
  depth = 0
): number {
  if (depth > 5) return fallback;

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  if (typeof value === "object" && value !== null) {
    const objectValue = value as Record<string, unknown>;

    if ("score" in objectValue) {
      return safeNumber(objectValue.score, fallback, depth + 1);
    }

    if ("value" in objectValue) {
      return safeNumber(objectValue.value, fallback, depth + 1);
    }

    if ("rating" in objectValue) {
      return safeNumber(objectValue.rating, fallback, depth + 1);
    }
  }

  return fallback;
}

function safeText(
  value: unknown,
  fallback = "Not available"
): string {
  if (typeof value === "string" && value.trim()) {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return fallback;
}

function formatNumber(value: unknown): string {
  return safeNumber(value).toLocaleString("en-IN");
}

function clampScore(value: unknown): number {
  return Math.max(0, Math.min(100, safeNumber(value)));
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 70) return "Strong";
  if (score >= 60) return "Promising";
  if (score >= 50) return "Needs Validation";
  return "High Risk";
}

function getRiskLabel(score: number): string {
  if (score >= 75) return "Very High";
  if (score >= 60) return "High";
  if (score >= 40) return "Moderate";
  return "Low";
}

function cleanHeading(value: string): string {
  return value
    .replace(/^\s*#{1,6}\s*/, "")
    .replace(/^\s*(?:[-*•]|\d+[.)])\s+/, "")
    .replace(/\*\*/g, "")
    .replace(/[`*_]/g, "")
    .replace(/:$/, "")
    .trim();
}

function cleanText(value: string): string {
  return value
    .replace(/\*\*/g, "")
    .replace(/__/g, "")
    .replace(/[`]/g, "")
    .trim();
}

function parseAIAdvice(advice: string) {
  const lines = advice
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const sections: {
    title: string;
    content: string[];
  }[] = [];

  let current: {
    title: string;
    content: string[];
  } | null = null;

  for (const line of lines) {
    const cleaned = cleanHeading(line);

    const headingMatch =
      /^(\d+[.)]\s*)?(Executive Summary|Why This Venture Could Work|Biggest Risks|Competitive Strategy|Target Customer Strategy|Recommended Business Model Strategy|Financial Advice|First 3 Actions|Final Recommendation)$/i.test(
        cleaned
      );

    if (
      headingMatch &&
      !line.startsWith("-") &&
      !line.startsWith("*") &&
      !line.startsWith("•")
    ) {
      if (current) {
        sections.push(current);
      }

      current = {
        title: cleaned,
        content: [],
      };

      continue;
    }

    if (!current) {
      current = {
        title: "Executive Summary",
        content: [],
      };
    }

    current.content.push(cleanText(line));
  }

  if (current) {
    sections.push(current);
  }

  return sections;
}

/* =========================================================
   SCORE BAR
========================================================= */

function ScoreBar({
  name,
  score,
  gradient,
}: {
  name: string;
  score: number;
  gradient: string;
}) {
  const value = clampScore(score);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-slate-700">
          {name}
        </span>

        <span className="text-sm font-bold text-slate-900">
          {value}/100
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700`}
          style={{
            width: `${value}%`,
          }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   METRIC CARD
========================================================= */

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  gradient,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  gradient: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div
        className={`absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-2xl transition-opacity group-hover:opacity-20`}
      />

      <div
        className={`relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-xl text-white shadow-lg`}
      >
        {icon}
      </div>

      <p className="relative mt-5 text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
        {title}
      </p>

      <p className="relative mt-2 break-words text-2xl font-black tracking-tight text-slate-900">
        {value}
      </p>

      {subtitle && (
        <p className="relative mt-2 text-sm leading-6 text-slate-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-7">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-600">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
        {title}
      </h2>

      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500 md:text-base">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   RISK CARD
========================================================= */

function RiskCard({
  name,
  score,
  level,
  explanation,
}: {
  name: string;
  score: unknown;
  level: unknown;
  explanation: unknown;
}) {
  const numericScore = clampScore(score);

  let badge =
    "border-emerald-200 bg-emerald-50 text-emerald-700";

  let gradient = "from-emerald-400 to-green-500";

  if (numericScore >= 60) {
    badge =
      "border-orange-200 bg-orange-50 text-orange-700";

    gradient = "from-orange-400 to-amber-500";
  }

  if (numericScore >= 75) {
    badge =
      "border-red-200 bg-red-50 text-red-700";

    gradient = "from-red-400 to-rose-500";
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0">
          <h3 className="text-lg font-black text-slate-900">
            {safeText(name, "Risk Factor")}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {safeText(
              explanation,
              "Risk assessment based on the current venture assumptions."
            )}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-3xl font-black text-slate-900">
            {numericScore}
          </p>

          <span
            className={`mt-1 inline-block rounded-full border px-3 py-1 text-xs font-bold ${badge}`}
          >
            {safeText(level, getRiskLabel(numericScore))}
          </span>
        </div>
      </div>

      <div className="mt-6 h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
          style={{
            width: `${numericScore}%`,
          }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   AI SECTION CARD
========================================================= */

function AISectionCard({
  title,
  content,
  index,
}: {
  title: string;
  content: string[];
  index: number;
}) {
  const icons = [
    "✦",
    "◈",
    "⚡",
    "◉",
    "◆",
    "↗",
    "◎",
    "✓",
    "★",
  ];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.1]">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-lg text-cyan-200">
          {icons[index % icons.length]}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-black text-white">
            {title}
          </h3>

          <div className="mt-4 space-y-3">
            {content.map((item, itemIndex) => {
              const isBullet =
                item.startsWith("-") ||
                item.startsWith("•") ||
                /^\d+[.)]/.test(item);

              const cleaned = item
                .replace(/^[-•]\s*/, "")
                .replace(/^\d+[.)]\s*/, "")
                .trim();

              return isBullet ? (
                <div
                  key={`${title}-${itemIndex}`}
                  className="flex gap-3"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />

                  <p className="text-sm leading-7 text-blue-50">
                    {cleaned}
                  </p>
                </div>
              ) : (
                <p
                  key={`${title}-${itemIndex}`}
                  className="text-sm leading-7 text-blue-50"
                >
                  {cleaned}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN RESULTS CONTENT
========================================================= */

function ResultsContent() {
  const searchParams = useSearchParams();

  const [advice, setAdvice] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [copied, setCopied] = useState(false);

  /* -------------------------------------------------------
     URL DATA
  ------------------------------------------------------- */

  const business =
    searchParams.get("business") ||
    "AI-powered business platform";

  const country =
    searchParams.get("country") ||
    "India";

  const market =
    searchParams.get("market") ||
    "Small businesses";

  const investment =
    searchParams.get("investment") ||
    "50 lakh";

  const model =
    searchParams.get("model") ||
    "Subscription";

  const industry =
    searchParams.get("industry") ||
    "Technology";

  const timeline =
    searchParams.get("timeline") ||
    "Within 6 months";

  /* -------------------------------------------------------
     INTELLIGENCE CALCULATIONS
  ------------------------------------------------------- */

  const score = calculateVentureScore({
    business,
    country,
    market,
    investment,
    model,
  });

  const financialData = calculateFinancialModel({
    business,
    investment,
    model,
  });

  const marketData = calculateMarketIntelligence({
    business,
    country,
    market,
  });

  const competitorData = calculateCompetitorIntelligence({
    business,
    country,
    market,
  });

  const riskData = calculateRiskIntelligence({
    business,
    country,
    market,
    investment,
    model,
  });

  /* -------------------------------------------------------
     SAFE VALUES
  ------------------------------------------------------- */

  const ventureScore = clampScore(score?.total);
  const marketScore = clampScore(score?.market);
  const competitionScore = clampScore(score?.competition);
  const economicsScore = clampScore(score?.economics);
  const regulationScore = clampScore(score?.regulation);
  const ventureRiskScore = clampScore(score?.risk);

  const overallRisk = clampScore(
    riskData?.overallRisk
  );

  const marketRisk = safeNumber(
    riskData?.marketRisk
  );

  const financialRisk = safeNumber(
    riskData?.financialRisk
  );

  const competitionRisk = safeNumber(
    riskData?.competitionRisk
  );

  const operationalRisk = safeNumber(
    riskData?.operationalRisk
  );

  const regulatoryRisk = safeNumber(
    riskData?.regulatoryRisk
  );

  /* -------------------------------------------------------
     INVESTOR VERDICT
  ------------------------------------------------------- */

  let investorVerdict = "HIGH VALIDATION REQUIRED";
  let investorColor = "text-red-600";
  let investorBg = "bg-red-50 border-red-100";

  if (
    ventureScore >= 75 &&
    overallRisk < 60
  ) {
    investorVerdict = "ATTRACTIVE OPPORTUNITY";
    investorColor = "text-emerald-600";
    investorBg =
      "bg-emerald-50 border-emerald-100";
  } else if (
    ventureScore >= 60 &&
    overallRisk < 75
  ) {
    investorVerdict = "VALIDATE BEFORE SCALING";
    investorColor = "text-orange-600";
    investorBg =
      "bg-orange-50 border-orange-100";
  }

  /* -------------------------------------------------------
     STRATEGIC SIGNAL
  ------------------------------------------------------- */

  let strategicSignal = "RECONSIDER";

  let strategicDescription =
    "The current assumptions indicate that significant validation is required before committing substantial capital.";

  let strategicGradient =
    "from-red-500 to-orange-500";

  if (
    ventureScore >= 75 &&
    overallRisk < 60
  ) {
    strategicSignal = "LAUNCH";

    strategicDescription =
      "The venture shows a strong combination of opportunity, economics and manageable risk. Move into structured validation and launch preparation.";

    strategicGradient =
      "from-emerald-500 to-cyan-500";
  } else if (
    ventureScore >= 60 &&
    overallRisk < 75
  ) {
    strategicSignal = "VALIDATE";

    strategicDescription =
      "The venture has potential, but important assumptions should be tested before scaling investment.";

    strategicGradient =
      "from-orange-500 to-amber-500";
  }

  /* -------------------------------------------------------
     AI ANALYSIS
  ------------------------------------------------------- */

  async function analyzeWithAI() {
    setAiLoading(true);
    setAiError("");
    setAdvice("");

    try {
      const response = await fetch(
        "/api/advisor",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            business,
            country,
            market,
            investment,
            model,
            ventureScore,
            marketOpportunity:
              marketData.marketOpportunity,
            competitionPressure:
              competitorData.competitionPressure,
            overallRisk,
            monthlyRevenue:
              financialData.monthlyRevenue,
            monthlyExpenses:
              financialData.monthlyExpenses,
            runway:
              financialData.runway,
          }),
        }
      );

      const responseText =
        await response.text();

      let data: {
        advice?: string;
        error?: string;
      } | null = null;

      try {
        data = responseText
          ? JSON.parse(responseText)
          : null;
      } catch {
        throw new Error(
          responseText ||
            "The AI server returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            `AI request failed with status ${response.status}.`
        );
      }

      if (!data?.advice) {
        throw new Error(
          "The AI returned an empty response."
        );
      }

      setAdvice(data.advice);
    } catch (error) {
      console.error(
        "LaunchIQ AI Error:",
        error
      );

      setAiError(
        error instanceof Error
          ? error.message
          : "Unable to generate AI advice."
      );
    } finally {
      setAiLoading(false);
    }
  }

  /* -------------------------------------------------------
     COPY ANALYSIS
  ------------------------------------------------------- */

  async function copyAnalysis() {
    if (!advice) return;

    try {
      await navigator.clipboard.writeText(
        advice
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  }

  const aiSections = advice
    ? parseAIAdvice(advice)
    : [];

  /* -------------------------------------------------------
     COMPETITORS
  ------------------------------------------------------- */

  const competitors =
    Array.isArray(
      competitorData?.competitors
    )
      ? competitorData.competitors
      : [];

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />

        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-12 md:py-16">

          {/* BRAND */}

          <div className="mb-12 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-xl font-black shadow-lg shadow-cyan-500/20">
              L
            </div>

            <div>
              <p className="text-lg font-black">
                LaunchIQ
              </p>

              <p className="text-xs text-slate-400">
                AI Venture Intelligence Engine
              </p>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-center">

            {/* LEFT */}

            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-bold text-cyan-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
                Venture Intelligence Report
              </div>

              <h1 className="max-w-5xl break-words text-4xl font-black tracking-tight md:text-6xl">
                {business}
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
                A structured intelligence report covering
                market opportunity, competitive dynamics,
                financial potential and venture risk.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                  🌍 {country}
                </span>

                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                  🎯 {market}
                </span>

                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                  💰 {investment}
                </span>

                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                  ⚡ {model}
                </span>

                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                  🏭 {industry}
                </span>

                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                  🗓 {timeline}
                </span>
              </div>
            </div>

            {/* SCORE */}

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 shadow-2xl backdrop-blur-xl">
              <p className="text-sm font-medium text-slate-400">
                Overall Venture Score
              </p>

              <div className="mt-3 flex items-end gap-2">
                <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-7xl font-black text-transparent">
                  {ventureScore}
                </span>

                <span className="mb-3 text-slate-500">
                  /100
                </span>
              </div>

              <p className="mt-2 text-xl font-black text-white">
                {safeText(
                  score?.verdict,
                  getScoreLabel(ventureScore)
                )}
              </p>

              <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"
                  style={{
                    width: `${ventureScore}%`,
                  }}
                />
              </div>

              <div className="mt-3 flex justify-between text-xs text-slate-500">
                <span>0</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          INVESTOR VIEW
      ================================================= */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">

          <div className="grid gap-6 lg:grid-cols-3">

            {/* STRATEGIC SIGNAL */}

            <div
              className={`relative overflow-hidden rounded-3xl border p-7 ${investorBg}`}
            >
              <div
                className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${strategicGradient} opacity-10 blur-2xl`}
              />

              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Investor View
              </p>

              <div className="mt-4 flex items-center gap-4">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${strategicGradient} text-xl text-white shadow-lg`}
                >
                  {strategicSignal === "LAUNCH"
                    ? "↗"
                    : strategicSignal === "VALIDATE"
                      ? "◉"
                      : "!"}
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Strategic Signal
                  </p>

                  <p className="text-2xl font-black text-slate-900">
                    {strategicSignal}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-slate-600">
                {strategicDescription}
              </p>
            </div>

            {/* INVESTOR VERDICT */}

            <div className="rounded-3xl border border-slate-200 bg-slate-950 p-7 text-white shadow-xl">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                Investment Verdict
              </p>

              <p
                className={`mt-4 text-2xl font-black ${investorColor}`}
              >
                {investorVerdict}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-xs text-slate-500">
                    Venture Score
                  </p>

                  <p className="mt-1 text-2xl font-black">
                    {ventureScore}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-xs text-slate-500">
                    Overall Risk
                  </p>

                  <p className="mt-1 text-2xl font-black">
                    {overallRisk}
                  </p>
                </div>
              </div>
            </div>

            {/* DECISION LENS */}

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Decision Lens
              </p>

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Market
                  </span>

                  <span className="font-black text-slate-900">
                    {marketScore}/100
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Economics
                  </span>

                  <span className="font-black text-slate-900">
                    {economicsScore}/100
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Competition
                  </span>

                  <span className="font-black text-slate-900">
                    {competitionScore}/100
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Risk
                  </span>

                  <span className="font-black text-slate-900">
                    {ventureRiskScore}/100
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =================================================
          MAIN
      ================================================= */}

      <div className="mx-auto max-w-7xl px-6 py-14">

        {/* =================================================
            01 SCORE
        ================================================= */}

        <section className="mb-16">
          <SectionHeader
            eyebrow="01 · Venture Score"
            title="Investment Attractiveness"
            description="A weighted view of the core factors influencing the venture's potential."
          />

          <div className="grid gap-6 lg:grid-cols-3">

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-2xl text-white shadow-lg">
                ✦
              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-wider text-slate-400">
                Overall Assessment
              </p>

              <h3 className="mt-2 text-2xl font-black text-slate-900">
                {safeText(
                  score?.verdict,
                  getScoreLabel(ventureScore)
                )}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                LaunchIQ evaluates the opportunity across
                market, competition, economics, regulation
                and risk.
              </p>

              <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Score
                </p>

                <p className="mt-1 text-4xl font-black text-slate-900">
                  {ventureScore}
                  <span className="text-lg text-slate-400">
                    /100
                  </span>
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm lg:col-span-2">
              <div className="space-y-7">
                <ScoreBar
                  name="Market"
                  score={marketScore}
                  gradient="from-blue-500 to-cyan-400"
                />

                <ScoreBar
                  name="Competition"
                  score={competitionScore}
                  gradient="from-purple-500 to-fuchsia-500"
                />

                <ScoreBar
                  name="Economics"
                  score={economicsScore}
                  gradient="from-emerald-500 to-teal-400"
                />

                <ScoreBar
                  name="Regulation"
                  score={regulationScore}
                  gradient="from-orange-500 to-amber-400"
                />

                <ScoreBar
                  name="Risk"
                  score={ventureRiskScore}
                  gradient="from-rose-500 to-red-400"
                />
              </div>
            </div>

          </div>
        </section>

        {/* =================================================
            02 MARKET
        ================================================= */}

        <section className="mb-16">
          <SectionHeader
            eyebrow="02 · Market Intelligence"
            title="Understand the Opportunity"
            description="Country and market-level signals covering scale, digital readiness, growth and opportunity."
          />

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Population"
              value={formatNumber(
                marketData.population
              )}
              icon="🌍"
              gradient="from-blue-500 to-cyan-400"
            />

            <MetricCard
              title="GDP"
              value={`$${(
                safeNumber(marketData.gdp) /
                1_000_000_000_000
              ).toFixed(2)}T`}
              icon="📈"
              gradient="from-violet-500 to-purple-500"
            />

            <MetricCard
              title="Internet Penetration"
              value={`${safeNumber(
                marketData.internetPenetration
              )}%`}
              icon="🌐"
              gradient="from-cyan-500 to-blue-500"
            />

            <MetricCard
              title="Digital Adoption"
              value={`${safeNumber(
                marketData.digitalAdoption
              )}%`}
              icon="⚡"
              gradient="from-emerald-500 to-teal-400"
            />
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <MetricCard
              title="Market Growth"
              value={`${safeNumber(
                marketData.marketGrowth
              )}%`}
              subtitle={safeText(
                marketData.growthOutlook
              )}
              icon="🚀"
              gradient="from-orange-500 to-amber-400"
            />

            <MetricCard
              title="Estimated Market Size"
              value={safeText(
                marketData.marketSize,
                "N/A"
              )}
              icon="📊"
              gradient="from-purple-500 to-pink-500"
            />

            <MetricCard
              title="Opportunity Score"
              value={`${safeNumber(
                marketData.marketOpportunity
              )}/100`}
              subtitle={safeText(
                marketData.opportunityLevel
              )}
              icon="💎"
              gradient="from-blue-600 to-indigo-500"
            />
          </div>

          <div className="mt-5 rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-cyan-50 p-7">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-xl text-white">
                🎯
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-wider text-blue-600">
                  Target Market
                </p>

                <p className="mt-1 text-xl font-black text-slate-900">
                  {market}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            03 COMPETITION
        ================================================= */}

        <section className="mb-16">
          <SectionHeader
            eyebrow="03 · Competitive Intelligence"
            title="Competitive Landscape"
            description="Understand competitive pressure, market positioning and potential areas for differentiation."
          />

          <div className="mb-6 grid gap-5 md:grid-cols-2">
            <MetricCard
              title="Competition Pressure"
              value={`${safeNumber(
                competitorData.competitionPressure
              )}/100`}
              subtitle={safeText(
                competitorData.competitionLevel
              )}
              icon="⚔️"
              gradient="from-rose-500 to-orange-400"
            />

            <MetricCard
              title="Competitive Opportunity"
              value={`${safeNumber(
                competitorData.competitiveOpportunity
              )}/100`}
              subtitle="Room to differentiate"
              icon="🎯"
              gradient="from-indigo-500 to-purple-500"
            />
          </div>

          {competitors.length > 0 ? (
            <div className="grid gap-5 lg:grid-cols-3">
              {competitors.map(
                (competitor) => (
                  <div
                    key={competitor.name}
                    className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 text-sm font-black text-white">
                          {safeText(
                            competitor.name,
                            "C"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate font-black text-slate-900">
                            {safeText(
                              competitor.name,
                              "Competitor"
                            )}
                          </h3>

                          <p className="text-xs text-slate-500">
                            {safeText(
                              competitor.category
                            )}
                          </p>
                        </div>
                      </div>

                      <span className="shrink-0 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600">
                        {safeText(
                          competitor.pressure
                        )}
                      </span>
                    </div>

                    <div className="mt-6 space-y-4">
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                          Pricing
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-700">
                          {safeText(
                            competitor.pricing
                          )}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-emerald-50 p-4">
                        <p className="text-xs font-black uppercase tracking-wider text-emerald-600">
                          Strength
                        </p>

                        <p className="mt-1 text-sm leading-6 text-emerald-900">
                          {safeText(
                            competitor.strength
                          )}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-orange-50 p-4">
                        <p className="text-xs font-black uppercase tracking-wider text-orange-600">
                          Weakness
                        </p>

                        <p className="mt-1 text-sm leading-6 text-orange-900">
                          {safeText(
                            competitor.weakness
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
              <p className="text-lg font-bold text-slate-900">
                Competitive data unavailable
              </p>

              <p className="mt-2 text-sm text-slate-500">
                The current prototype does not have
                competitor records for this analysis.
              </p>
            </div>
          )}
        </section>

        {/* =================================================
            04 FINANCIAL
        ================================================= */}

        <section className="mb-16">
          <SectionHeader
            eyebrow="04 · Financial Intelligence"
            title="Financial Potential"
            description="A prototype financial model estimates revenue, expenses, profitability and capital runway."
          />

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Monthly Revenue"
              value={`₹${formatNumber(
                financialData.monthlyRevenue
              )}`}
              icon="💵"
              gradient="from-emerald-500 to-green-400"
            />

            <MetricCard
              title="Monthly Expenses"
              value={`₹${formatNumber(
                financialData.monthlyExpenses
              )}`}
              icon="💳"
              gradient="from-orange-500 to-amber-400"
            />

            <MetricCard
              title="Gross Profit"
              value={`₹${formatNumber(
                financialData.grossProfit
              )}`}
              icon="📈"
              gradient="from-blue-500 to-cyan-400"
            />

            <MetricCard
              title="Gross Margin"
              value={`${safeNumber(
                financialData.grossMargin
              )}%`}
              icon="📊"
              gradient="from-purple-500 to-fuchsia-500"
            />
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Monthly Burn"
              value={`₹${formatNumber(
                financialData.monthlyBurn
              )}`}
              icon="🔥"
              gradient="from-red-500 to-orange-400"
            />

            <MetricCard
              title="Runway"
              value={`${safeNumber(
                financialData.runway
              )} months`}
              icon="🛣️"
              gradient="from-indigo-500 to-blue-500"
            />

            <MetricCard
              title="Break-even Revenue"
              value={`₹${formatNumber(
                financialData.breakEvenRevenue
              )}`}
              icon="⚖️"
              gradient="from-cyan-500 to-teal-400"
            />

            <MetricCard
              title="ROI"
              value={`${safeNumber(
                financialData.roi
              )}%`}
              icon="💎"
              gradient="from-violet-500 to-purple-500"
            />
          </div>

          <div className="mt-6 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-purple-50 p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                💡
              </div>

              <h3 className="font-black text-slate-900">
                Financial Assumptions
              </h3>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-blue-100 bg-white p-5">
                <p className="text-xs font-black uppercase tracking-wider text-blue-600">
                  Revenue Assumption
                </p>

                <p className="mt-2 text-sm leading-7 text-slate-700">
                  {safeText(
                    financialData.revenueAssumption
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-purple-100 bg-white p-5">
                <p className="text-xs font-black uppercase tracking-wider text-purple-600">
                  Expense Assumption
                </p>

                <p className="mt-2 text-sm leading-7 text-slate-700">
                  {safeText(
                    financialData.expenseAssumption
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            05 RISK
        ================================================= */}

        <section className="mb-16">
          <SectionHeader
            eyebrow="05 · Risk Intelligence"
            title="Venture Risk Profile"
            description="Identify the areas that could prevent the venture from reaching its potential."
          />

          <div className="mb-6 overflow-hidden rounded-3xl bg-slate-950 p-7 text-white shadow-2xl">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500">
                    ⚠
                  </div>

                  <div>
                    <p className="text-sm text-slate-400">
                      Overall Risk
                    </p>

                    <p className="font-black">
                      {safeText(
                        riskData?.overallLevel,
                        getRiskLabel(overallRisk)
                      )}
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-6xl font-black">
                  {overallRisk}
                  <span className="text-xl text-slate-500">
                    /100
                  </span>
                </p>
              </div>

              <div>
                <div className="h-4 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-orange-400 to-red-500"
                    style={{
                      width: `${overallRisk}%`,
                    }}
                  />
                </div>

                <div className="mt-3 flex justify-between text-xs text-slate-500">
                  <span>Low</span>
                  <span>Moderate</span>
                  <span>High</span>
                  <span>Very High</span>
                </div>

                <p className="mt-5 text-sm leading-7 text-slate-400">
                  Lower risk scores indicate a more
                  favorable risk profile for the venture.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <RiskCard
              name={riskData?.marketRisk?.name}
              score={marketRisk}
              level={riskData?.marketRisk?.level}
              explanation={
                riskData?.marketRisk?.explanation
              }
            />

            <RiskCard
              name={riskData?.financialRisk?.name}
              score={financialRisk}
              level={riskData?.financialRisk?.level}
              explanation={
                riskData?.financialRisk?.explanation
              }
            />

            <RiskCard
              name={
                riskData?.competitionRisk?.name
              }
              score={competitionRisk}
              level={
                riskData?.competitionRisk?.level
              }
              explanation={
                riskData?.competitionRisk?.explanation
              }
            />

            <RiskCard
              name={
                riskData?.operationalRisk?.name
              }
              score={operationalRisk}
              level={
                riskData?.operationalRisk?.level
              }
              explanation={
                riskData?.operationalRisk?.explanation
              }
            />

            <RiskCard
              name={
                riskData?.regulatoryRisk?.name
              }
              score={regulatoryRisk}
              level={
                riskData?.regulatoryRisk?.level
              }
              explanation={
                riskData?.regulatoryRisk?.explanation
              }
            />
          </div>
        </section>

        {/* =================================================
            06 MARKET RESEARCH
        ================================================= */}

        <section className="mb-16">
          <div className="relative overflow-hidden rounded-[2rem] border border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-8 shadow-sm md:p-10">

            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">

              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-100 px-4 py-2 text-xs font-black uppercase tracking-wider text-cyan-700">
                  🔎 LaunchIQ Research Engine
                </div>

                <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                  Deep Market Research
                </h2>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
                  Go beyond the prototype market score.
                  LaunchIQ can generate an AI-powered research
                  report covering market demand, growth drivers,
                  customer opportunity, competition,
                  differentiation, regulation and investment
                  potential.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-sm ring-1 ring-slate-200">
                    📊 Market Overview
                  </span>

                  <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-sm ring-1 ring-slate-200">
                    🎯 Customer Opportunity
                  </span>

                  <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-sm ring-1 ring-slate-200">
                    ⚔️ Competitive Landscape
                  </span>

                  <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-sm ring-1 ring-slate-200">
                    🚀 Growth Drivers
                  </span>

                  <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-sm ring-1 ring-slate-200">
                    ⚖️ Regulatory Considerations
                  </span>
                </div>
              </div>

              <div>
                <Link
                  href={`/research?business=${encodeURIComponent(
                    business
                  )}&country=${encodeURIComponent(
                    country
                  )}&industry=${encodeURIComponent(
                    industry
                  )}&market=${encodeURIComponent(
                    market
                  )}`}
                  className="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-4 text-sm font-black text-white shadow-xl shadow-blue-500/20 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl"
                >
                  🔎 Run Market Research
                  <span className="text-lg">
                    →
                  </span>
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* =================================================
            07 AI ADVISOR
        ================================================= */}

        <section className="mb-16 overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 text-white shadow-2xl">

          {/* AI HEADER */}

          <div className="relative overflow-hidden p-8 md:p-10">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

            <div className="relative">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black backdrop-blur">
                ✨ LAUNCHIQ AI
              </div>

              <h2 className="text-3xl font-black md:text-4xl">
                AI Venture Advisor
              </h2>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-blue-100 md:text-base">
                Turn your LaunchIQ intelligence report into
                a practical AI-generated strategy for
                launching, validating and growing your
                venture.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={analyzeWithAI}
                  disabled={aiLoading}
                  className="inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-indigo-700 shadow-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {aiLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-700" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      ✨ Analyze My Venture
                    </>
                  )}
                </button>

                {advice && (
                  <button
                    type="button"
                    onClick={copyAnalysis}
                    className="rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
                  >
                    {copied
                      ? "✓ Copied"
                      : "Copy Analysis"}
                  </button>
                )}
              </div>

              {aiError && (
                <div className="mt-6 rounded-2xl border border-red-300/30 bg-red-500/20 p-5">
                  <p className="text-sm font-black text-white">
                    AI analysis could not be completed
                  </p>

                  <p className="mt-2 text-sm leading-6 text-red-100">
                    {aiError}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* AI RESULT */}

          {advice && (
            <div className="border-t border-white/10 bg-slate-950/20 p-6 md:p-10">

              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl text-indigo-600 shadow-lg">
                  ✦
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">
                    AI Analysis Complete
                  </p>

                  <h3 className="mt-1 text-2xl font-black text-white">
                    LaunchIQ Strategic Advisor
                  </h3>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                {aiSections.map(
                  (section, index) => (
                    <AISectionCard
                      key={`${section.title}-${index}`}
                      title={section.title}
                      content={section.content}
                      index={index}
                    />
                  )
                )}
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex gap-3">
                  <span className="text-lg">
                    ℹ️
                  </span>

                  <p className="text-xs leading-6 text-blue-200">
                    AI-generated analysis is based on the
                    venture information and prototype
                    intelligence shown in this report. It
                    should be used as decision support, not
                    as a guarantee of business success.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* EMPTY STATE */}

          {!advice &&
            !aiLoading &&
            !aiError && (
              <div className="border-t border-white/10 bg-slate-950/10 px-8 py-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                  ✨
                </div>

                <h3 className="mt-5 text-xl font-black">
                  Your AI strategy is ready to generate
                </h3>

                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-blue-200">
                  LaunchIQ will combine your venture score,
                  market signals, competitive pressure,
                  financial model and risk profile into a
                  practical founder-focused assessment.
                </p>
              </div>
            )}
        </section>

        {/* =================================================
            PROTOTYPE NOTICE
        ================================================= */}

        <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              ℹ
            </div>

            <div>
              <h3 className="font-black text-slate-900">
                Prototype Intelligence
              </h3>

              <p className="mt-2 text-sm leading-7 text-slate-500">
                LaunchIQ is currently using prototype
                rule-based calculations and illustrative
                market assumptions. Future versions can
                connect these modules to live market data,
                competitor intelligence, financial datasets
                and more advanced AI analysis.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-black text-white">
              L
            </div>

            <div>
              <p className="font-black text-slate-900">
                LaunchIQ
              </p>

              <p className="text-xs text-slate-400">
                AI Venture Intelligence Engine
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            © 2026 LaunchIQ — Prototype Intelligence Platform
          </p>
        </div>
      </footer>
    </main>
  );
}

/* =========================================================
   PAGE WRAPPER
========================================================= */

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-950">
          <div className="text-center text-white">
            <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-cyan-400" />

            <p className="text-lg font-bold">
              Loading LaunchIQ...
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Preparing your venture intelligence report
            </p>
          </div>
        </main>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}