"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

import { calculateVentureScore } from "@/lib/score";
import {
  calculateFinancialModel,
  calculateFinancialScenarios,
} from "@/lib/financial";
import { calculateMarketIntelligence } from "@/lib/market";
import { calculateCompetitorIntelligence } from "@/lib/competitor";
import { calculateRiskIntelligence } from "@/lib/risk";

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
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div
        className={`absolute right-0 top-0 h-24 w-24 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-2xl transition-opacity group-hover:opacity-20`}
      />

      <div
        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-lg text-white shadow-lg`}
      >
        {icon}
      </div>

      <p className="text-sm font-medium text-slate-500">{title}</p>

      <p className="mt-2 break-words text-2xl font-bold text-slate-900">
        {value}
      </p>

      {subtitle && (
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      )}
    </div>
  );
}

function ScoreBar({
  name,
  score,
  gradient,
}: {
  name: string;
  score: number;
  gradient: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">{name}</span>

        <span className="text-sm font-bold text-slate-900">
          {score}/100
        </span>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function RiskCard({
  name,
  score,
  level,
  explanation,
}: {
  name: string;
  score: number;
  level: string;
  explanation: string;
}) {
  let badgeStyle =
    "border-emerald-200 bg-emerald-100 text-emerald-700";

  let barStyle = "from-emerald-400 to-green-500";

  if (score >= 60) {
    badgeStyle = "border-orange-200 bg-orange-100 text-orange-700";
    barStyle = "from-orange-400 to-amber-500";
  }

  if (score >= 75) {
    badgeStyle = "border-red-200 bg-red-100 text-red-700";
    barStyle = "from-red-400 to-rose-500";
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900">{name}</h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {explanation}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-2xl font-bold text-slate-900">{score}</p>

          <span
            className={`mt-1 inline-block rounded-full border px-2.5 py-1 text-xs font-bold ${badgeStyle}`}
          >
            {level}
          </span>
        </div>
      </div>

      <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barStyle}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

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
    <div className="mb-6">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
        {title}
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function ResultsContent() {
  const searchParams = useSearchParams();

  const [advice, setAdvice] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const business =
    searchParams.get("business") ||
    "AI-powered healthcare platform";

  const country =
    searchParams.get("country") ||
    "India";

  const market =
    searchParams.get("market") ||
    "College students";

  const investment =
    searchParams.get("investment") ||
    "50 lakh";

  const model =
    searchParams.get("model") ||
    "Subscription";

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

  const financialScenarios = calculateFinancialScenarios({
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

  async function analyzeWithAI() {
    setAiLoading(true);
    setAiError("");
    setAdvice("");

    try {
      const response = await fetch("/api/advisor", {
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

          ventureScore: score.total,

          marketOpportunity: marketData.marketOpportunity,

          competitionPressure:
            competitorData.competitionPressure,

          overallRisk: riskData.overallRisk,

          monthlyRevenue:
            financialData.monthlyRevenue,

          monthlyExpenses:
            financialData.monthlyExpenses,

          runway: financialData.runway,
        }),
      });

      const responseText = await response.text();

      let data;

      try {
        data = responseText ? JSON.parse(responseText) : null;
      } catch {
        throw new Error(
          responseText || "The AI server returned an invalid response."
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
      console.error(error);

      setAiError(
        error instanceof Error
          ? error.message
          : "Unable to generate AI advice."
      );
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">

      {/* ============================= */}
      {/* HERO HEADER */}
      {/* ============================= */}

      <section className="relative overflow-hidden bg-slate-950 px-6 py-12 text-white md:py-16">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="absolute -right-20 top-10 h-80 w-80 rounded-full bg-purple-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">

          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-xl font-bold shadow-lg shadow-blue-500/20">
              L
            </div>

            <div>
              <p className="text-lg font-bold">
                LaunchIQ
              </p>

              <p className="text-xs text-slate-400">
                AI Venture Intelligence Engine
              </p>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-3 lg:items-center">

            <div className="lg:col-span-2">

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-300">
                <span className="h-2 w-2 rounded-full bg-blue-400" />

                Venture Intelligence Report
              </div>

              <h1 className="max-w-4xl break-words text-4xl font-black tracking-tight md:text-6xl">
                {business}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                A comprehensive venture analysis covering
                market opportunity, financial potential,
                competition and business risk.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">

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

              </div>
            </div>

            {/* HERO SCORE */}

            <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl">

              <p className="text-sm font-medium text-slate-400">
                Overall Venture Score
              </p>

              <div className="mt-3 flex items-end gap-2">

                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-7xl font-black text-transparent">
                  {score.total}
                </span>

                <span className="mb-3 text-slate-500">
                  /100
                </span>

              </div>

              <p className="mt-2 text-lg font-bold text-white">
                {score.verdict}
              </p>

              <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500"
                  style={{
                    width: `${score.total}%`,
                  }}
                />
              </div>

              <p className="mt-3 text-xs text-slate-400">
                Prototype intelligence score
              </p>

            </div>
          </div>
        </div>
      </section>

      {/* ============================= */}
      {/* MAIN CONTENT */}
      {/* ============================= */}

      <div className="mx-auto max-w-7xl px-6 py-12">

        {/* ============================= */}
        {/* SCORE BREAKDOWN */}
        {/* ============================= */}

        <section className="mb-14">

          <SectionHeader
            eyebrow="01 · Venture Score"
            title="Investment Attractiveness"
            description="A weighted view of the core factors influencing the venture's potential."
          />

          <div className="grid gap-6 lg:grid-cols-3">

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm lg:col-span-1">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-2xl text-white shadow-lg shadow-blue-500/20">
                ✦
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                {score.verdict}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                LaunchIQ evaluates the opportunity across
                market, competition, economics, regulation
                and risk.
              </p>

            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm lg:col-span-2">

              <div className="space-y-6">

                <ScoreBar
                  name="Market"
                  score={score.market}
                  gradient="from-blue-500 to-cyan-400"
                />

                <ScoreBar
                  name="Competition"
                  score={score.competition}
                  gradient="from-purple-500 to-fuchsia-500"
                />

                <ScoreBar
                  name="Economics"
                  score={score.economics}
                  gradient="from-emerald-500 to-teal-400"
                />

                <ScoreBar
                  name="Regulation"
                  score={score.regulation}
                  gradient="from-orange-500 to-amber-400"
                />

                <ScoreBar
                  name="Risk"
                  score={score.risk}
                  gradient="from-rose-500 to-red-400"
                />

              </div>
            </div>
          </div>
        </section>

        {/* ============================= */}
        {/* MARKET INTELLIGENCE */}
        {/* ============================= */}

        <section className="mb-14">

          <SectionHeader
            eyebrow="02 · Market Intelligence"
            title="Understand the Market"
            description="Country-level indicators help estimate digital readiness, market scale and growth potential."
          />

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            <MetricCard
              title="Population"
              value={marketData.population.toLocaleString()}
              icon="🌍"
              gradient="from-blue-500 to-cyan-400"
            />

            <MetricCard
              title="GDP"
              value={`$${(
                marketData.gdp /
                1_000_000_000_000
              ).toFixed(2)}T`}
              icon="📈"
              gradient="from-violet-500 to-purple-500"
            />

            <MetricCard
              title="Internet Penetration"
              value={`${marketData.internetPenetration}%`}
              icon="🌐"
              gradient="from-cyan-500 to-blue-500"
            />

            <MetricCard
              title="Digital Adoption"
              value={`${marketData.digitalAdoption}%`}
              icon="⚡"
              gradient="from-emerald-500 to-teal-400"
            />

          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-3">

            <MetricCard
              title="Market Growth"
              value={`${marketData.marketGrowth}%`}
              subtitle={marketData.growthOutlook}
              icon="🚀"
              gradient="from-orange-500 to-amber-400"
            />

            <MetricCard
              title="Market Size"
              value={marketData.marketSize}
              icon="📊"
              gradient="from-purple-500 to-pink-500"
            />

            <MetricCard
              title="Opportunity Score"
              value={`${marketData.marketOpportunity}/100`}
              subtitle={marketData.opportunityLevel}
              icon="💎"
              gradient="from-blue-600 to-indigo-500"
            />

          </div>
        </section>

        {/* ============================= */}
        {/* COMPETITOR INTELLIGENCE */}
        {/* ============================= */}

        <section className="mb-14">

          <SectionHeader
            eyebrow="03 · Competitive Intelligence"
            title="Competitive Landscape"
            description="Understand the major players, their strengths and where differentiation may be possible."
          />

          <div className="mb-6 grid gap-5 md:grid-cols-2">

            <MetricCard
              title="Competition Pressure"
              value={`${competitorData.competitionPressure}/100`}
              subtitle={competitorData.competitionLevel}
              icon="⚔️"
              gradient="from-rose-500 to-orange-400"
            />

            <MetricCard
              title="Competitive Opportunity"
              value={`${competitorData.competitiveOpportunity}/100`}
              subtitle="Room to differentiate"
              icon="🎯"
              gradient="from-indigo-500 to-purple-500"
            />

          </div>

          <div className="grid gap-5 lg:grid-cols-3">

            {competitorData.competitors.map(
              (competitor) => (
                <div
                  key={competitor.name}
                  className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div>

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 text-sm font-bold text-white">
                          {competitor.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>

                          <h3 className="font-bold text-slate-900">
                            {competitor.name}
                          </h3>

                          <p className="text-xs text-slate-500">
                            {competitor.category}
                          </p>

                        </div>
                      </div>
                    </div>

                    <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600">
                      {competitor.pressure}
                    </span>

                  </div>

                  <div className="mt-6 space-y-4">

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Pricing
                      </p>

                      <p className="mt-1 text-sm text-slate-700">
                        {competitor.pricing}
                      </p>
                    </div>

                    <div className="rounded-xl bg-emerald-50 p-4">

                      <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                        Strength
                      </p>

                      <p className="mt-1 text-sm leading-6 text-emerald-900">
                        {competitor.strength}
                      </p>

                    </div>

                    <div className="rounded-xl bg-orange-50 p-4">

                      <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
                        Weakness
                      </p>

                      <p className="mt-1 text-sm leading-6 text-orange-900">
                        {competitor.weakness}
                      </p>

                    </div>

                  </div>
                </div>
              )
            )}

          </div>
        </section>

        {/* ============================= */}
        {/* FINANCIAL INTELLIGENCE */}
        {/* ============================= */}

        <section className="mb-14">

          <SectionHeader
            eyebrow="04 · Financial Intelligence"
            title="Financial Potential"
            description="A prototype financial model estimates revenue, expenses, profitability and capital runway."
          />

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            <MetricCard
              title="Monthly Revenue"
              value={`₹${financialData.monthlyRevenue.toLocaleString()}`}
              icon="💵"
              gradient="from-emerald-500 to-green-400"
            />

            <MetricCard
              title="Monthly Expenses"
              value={`₹${financialData.monthlyExpenses.toLocaleString()}`}
              icon="💳"
              gradient="from-orange-500 to-amber-400"
            />

            <MetricCard
              title="Gross Profit"
              value={`₹${financialData.grossProfit.toLocaleString()}`}
              icon="📈"
              gradient="from-blue-500 to-cyan-400"
            />

            <MetricCard
              title="Gross Margin"
              value={`${financialData.grossMargin}%`}
              icon="📊"
              gradient="from-purple-500 to-fuchsia-500"
            />

          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            <MetricCard
              title="Monthly Burn"
              value={`₹${financialData.monthlyBurn.toLocaleString()}`}
              icon="🔥"
              gradient="from-red-500 to-orange-400"
            />

            <MetricCard
              title="Runway"
              value={`${financialData.runway} months`}
              icon="🛣️"
              gradient="from-indigo-500 to-blue-500"
            />

            <MetricCard
              title="Break-even Revenue"
              value={`₹${financialData.breakEvenRevenue.toLocaleString()}`}
              icon="⚖️"
              gradient="from-cyan-500 to-teal-400"
            />

            <MetricCard
              title="ROI"
              value={`${financialData.roi}%`}
              icon="💎"
              gradient="from-violet-500 to-purple-500"
            />

          </div>

          <div className="mt-6 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-purple-50 p-7">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                💡
              </div>

              <h3 className="font-bold text-slate-900">
                Financial Assumptions
              </h3>

            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">

              <div className="rounded-2xl border border-blue-100 bg-white/80 p-5">

                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Revenue Assumption
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {financialData.revenueAssumption}
                </p>

              </div>

              <div className="rounded-2xl border border-purple-100 bg-white/80 p-5">

                <p className="text-xs font-bold uppercase tracking-wider text-purple-600">
                  Expense Assumption
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {financialData.expenseAssumption}
                </p>

              </div>

            </div>
          </div>

          {/* FINANCIAL SCENARIOS */}
          <div className="mt-6">
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                Scenario Planning
              </p>
              <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
                Three possible financial paths
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Compare conservative, base-case and aggressive assumptions before making a launch decision.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {financialScenarios.map((scenario) => {
                const isBase = scenario.name === "Base Case";
                const isAggressive = scenario.name === "Aggressive";

                const cardStyle = isBase
                  ? "border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50"
                  : isAggressive
                    ? "border-purple-200 bg-gradient-to-br from-purple-50 via-white to-fuchsia-50"
                    : "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50";

                const badgeStyle = isBase
                  ? "bg-blue-100 text-blue-700"
                  : isAggressive
                    ? "bg-purple-100 text-purple-700"
                    : "bg-emerald-100 text-emerald-700";

                return (
                  <div
                    key={scenario.name}
                    className={`rounded-3xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${cardStyle}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-lg font-bold text-slate-900">
                          {scenario.name}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {scenario.description}
                        </p>
                      </div>

                      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${badgeStyle}`}>
                        {isBase ? "Recommended baseline" : isAggressive ? "Upside case" : "Downside case"}
                      </span>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-white/80 p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Revenue
                        </p>
                        <p className="mt-1 text-lg font-bold text-slate-900">
                          ₹{scenario.monthlyRevenue.toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-500">per month</p>
                      </div>

                      <div className="rounded-2xl bg-white/80 p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Expenses
                        </p>
                        <p className="mt-1 text-lg font-bold text-slate-900">
                          ₹{scenario.monthlyExpenses.toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-500">per month</p>
                      </div>

                      <div className="rounded-2xl bg-white/80 p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Runway
                        </p>
                        <p className="mt-1 text-lg font-bold text-slate-900">
                          {scenario.runway} months
                        </p>
                      </div>

                      <div className="rounded-2xl bg-white/80 p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          ROI
                        </p>
                        <p className={`mt-1 text-lg font-bold ${scenario.roi >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                          {scenario.roi}%
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl bg-white/70 p-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-slate-600">
                          Break-even revenue
                        </span>
                        <span className="font-bold text-slate-900">
                          ₹{scenario.breakEvenRevenue.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================= */}
        {/* RISK INTELLIGENCE */}
        {/* ============================= */}

        <section className="mb-14">

          <SectionHeader
            eyebrow="05 · Risk Intelligence"
            title="Venture Risk Profile"
            description="Identify the areas that could prevent the venture from reaching its potential."
          />

          <div className="mb-6 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 p-7 text-white shadow-xl">

            <div className="grid gap-8 md:grid-cols-2 md:items-center">

              <div>

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
                    ⚠
                  </div>

                  <div>

                    <p className="text-sm text-slate-400">
                      Overall Risk
                    </p>

                    <p className="font-bold">
                      {riskData.overallLevel} Risk
                    </p>

                  </div>
                </div>

                <p className="mt-5 text-5xl font-black">
                  {riskData.overallRisk}

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
                      width: `${riskData.overallRisk}%`,
                    }}
                  />

                </div>

                <div className="mt-3 flex justify-between text-xs text-slate-500">
                  <span>Low</span>
                  <span>Moderate</span>
                  <span>High</span>
                  <span>Very High</span>
                </div>

                <p className="mt-5 text-sm leading-6 text-slate-400">
                  Lower risk scores indicate a more favorable
                  risk profile for the venture.
                </p>

              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">

            <RiskCard
              name={riskData.marketRisk.name}
              score={riskData.marketRisk.score}
              level={riskData.marketRisk.level}
              explanation={riskData.marketRisk.explanation}
            />

            <RiskCard
              name={riskData.financialRisk.name}
              score={riskData.financialRisk.score}
              level={riskData.financialRisk.level}
              explanation={riskData.financialRisk.explanation}
            />

            <RiskCard
              name={riskData.competitionRisk.name}
              score={riskData.competitionRisk.score}
              level={riskData.competitionRisk.level}
              explanation={riskData.competitionRisk.explanation}
            />

            <RiskCard
              name={riskData.operationalRisk.name}
              score={riskData.operationalRisk.score}
              level={riskData.operationalRisk.level}
              explanation={riskData.operationalRisk.explanation}
            />

            <RiskCard
              name={riskData.regulatoryRisk.name}
              score={riskData.regulatoryRisk.score}
              level={riskData.regulatoryRisk.level}
              explanation={riskData.regulatoryRisk.explanation}
            />

          </div>
        </section>

        {/* ============================= */}
        {/* AI VENTURE ADVISOR */}
        {/* ============================= */}

        <section className="mb-10 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white shadow-2xl">

          <div className="p-8 md:p-10">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur">
              ✨ LAUNCHIQ AI
            </div>

            <h2 className="text-3xl font-black md:text-4xl">
              AI Venture Advisor
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-100 md:text-base">
              Turn your LaunchIQ intelligence report into a
              practical AI-generated strategy for launching,
              validating and growing your venture.
            </p>

            <button
              type="button"
              onClick={analyzeWithAI}
              disabled={aiLoading}
              className="mt-7 inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-indigo-700 shadow-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {aiLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-700" />
                  Analyzing your venture...
                </>
              ) : (
                <>
                  ✨ Analyze with AI
                </>
              )}
            </button>

            {aiError && (
              <div className="mt-6 rounded-2xl border border-red-300/30 bg-red-500/20 p-5">

                <p className="text-sm font-bold text-white">
                  AI analysis could not be completed
                </p>

                <p className="mt-2 text-sm leading-6 text-red-100">
                  {aiError}
                </p>

              </div>
            )}

          </div>

          {/* AI RESULT */}

          {advice && (
            <div className="border-t border-white/10 bg-white/10 p-8 backdrop-blur-md md:p-10">

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl text-indigo-600 shadow-lg">
                  ✦
                </div>

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200">
                    AI Analysis Complete
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-white">
                    LaunchIQ Strategic Advisor
                  </h3>

                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-6">

                <div className="whitespace-pre-wrap text-sm leading-7 text-blue-50 md:text-base">
                  {advice}
                </div>

              </div>

              <p className="mt-5 text-xs leading-5 text-blue-200">
                AI-generated analysis is based on the venture
                information and prototype intelligence shown
                in this report. It should be used as decision
                support, not as a guarantee of business success.
              </p>

            </div>
          )}

        </section>

        {/* ============================= */}
        {/* NOTICE */}
        {/* ============================= */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              ℹ
            </div>

            <div>

              <h3 className="font-bold text-slate-900">
                Prototype Intelligence
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
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
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-950">

          <div className="text-center text-white">

            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-blue-400" />

            <p className="text-slate-300">
              Loading LaunchIQ intelligence...
            </p>

          </div>

        </main>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}