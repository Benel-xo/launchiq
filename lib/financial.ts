// ============================================================
// LaunchIQ Financial Intelligence Engine
// ============================================================

export type FinancialInputs = {
  business: string;
  investment: string;
  model: string;
};

export type FinancialScenario = {
  name: string;
  description: string;
  monthlyRevenue: number;
  monthlyExpenses: number;
  grossProfit: number;
  monthlyBurn: number;
  runway: number;
  breakEvenRevenue: number;
  annualProfit: number;
  roi: number;
};

export type FinancialModel = {
  investment: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  grossProfit: number;
  grossMargin: number;
  monthlyBurn: number;
  runway: number;
  breakEvenRevenue: number;
  annualProfit: number;
  roi: number;
  revenueAssumption: string;
  expenseAssumption: string;
};

export type FinancialScenarioInput = {
  name: string;
  description: string;
  revenueMultiplier: number;
  expenseMultiplier: number;
};

// ============================================================
// HELPERS
// ============================================================

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

function roundMoney(value: number): number {
  return Math.round(value);
}

function parseInvestment(investment: string): number {
  const value = investment.toLowerCase();

  // Extract numbers from the investment field.
  const numbers = value.match(/[\d,.]+/g);

  if (!numbers || numbers.length === 0) {
    return 500000;
  }

  const parsed = numbers
    .map((item) => Number(item.replace(/,/g, "")))
    .filter((item) => Number.isFinite(item));

  if (parsed.length === 0) {
    return 500000;
  }

  // If the input contains "lakh" or "lac", convert to rupees.
  if (
    value.includes("lakh") ||
    value.includes("lac") ||
    value.includes("l")
  ) {
    return Math.max(parsed[0] * 100000, 100000);
  }

  // If the input contains crore.
  if (value.includes("crore") || value.includes("cr")) {
    return Math.max(parsed[0] * 10000000, 100000);
  }

  // If investment is already a rupee amount.
  return Math.max(parsed[0], 100000);
}

// ============================================================
// BUSINESS TYPE DETECTION
// ============================================================

function detectBusinessType(business: string, model: string): string {
  const text = `${business} ${model}`.toLowerCase();

  if (
    text.includes("saas") ||
    text.includes("software") ||
    text.includes("ai") ||
    text.includes("app") ||
    text.includes("platform") ||
    text.includes("technology")
  ) {
    return "technology";
  }

  if (
    text.includes("restaurant") ||
    text.includes("food") ||
    text.includes("cafe") ||
    text.includes("bakery") ||
    text.includes("cloud kitchen")
  ) {
    return "food";
  }

  if (
    text.includes("delivery") ||
    text.includes("logistics") ||
    text.includes("transport")
  ) {
    return "logistics";
  }

  if (
    text.includes("marketplace") ||
    text.includes("ecommerce") ||
    text.includes("e-commerce") ||
    text.includes("online store")
  ) {
    return "marketplace";
  }

  if (
    text.includes("health") ||
    text.includes("medical") ||
    text.includes("clinic") ||
    text.includes("doctor")
  ) {
    return "health";
  }

  if (
    text.includes("education") ||
    text.includes("course") ||
    text.includes("learning") ||
    text.includes("student")
  ) {
    return "education";
  }

  if (
    text.includes("consult") ||
    text.includes("agency") ||
    text.includes("service")
  ) {
    return "services";
  }

  return "general";
}

// ============================================================
// MONTHLY REVENUE ESTIMATION
// ============================================================

function calculateRevenue(
  businessType: string,
  model: string,
  investment: number
): {
  revenue: number;
  customers: number;
  averagePrice: number;
} {
  const normalizedModel = model.toLowerCase();

  let customers = 250;
  let averagePrice = 999;

  // -----------------------------
  // TECHNOLOGY / SAAS
  // -----------------------------

  if (businessType === "technology") {
    customers = 300;
    averagePrice = normalizedModel.includes("subscription")
      ? 699
      : 899;
  }

  // -----------------------------
  // MARKETPLACE
  // -----------------------------

  if (businessType === "marketplace") {
    customers = 500;
    averagePrice = 599;
  }

  // -----------------------------
  // FOOD
  // -----------------------------

  if (businessType === "food") {
    customers = 1200;
    averagePrice = 350;
  }

  // -----------------------------
  // LOGISTICS
  // -----------------------------

  if (businessType === "logistics") {
    customers = 700;
    averagePrice = 450;
  }

  // -----------------------------
  // HEALTH
  // -----------------------------

  if (businessType === "health") {
    customers = 250;
    averagePrice = 1200;
  }

  // -----------------------------
  // EDUCATION
  // -----------------------------

  if (businessType === "education") {
    customers = 350;
    averagePrice = 999;
  }

  // -----------------------------
  // SERVICES
  // -----------------------------

  if (businessType === "services") {
    customers = 40;
    averagePrice = 7500;
  }

  // -----------------------------
  // GENERAL
  // -----------------------------

  if (businessType === "general") {
    customers = 300;
    averagePrice = 799;
  }

  // Investment influences realistic starting capacity.
  if (investment >= 1000000) {
    customers = Math.round(customers * 1.25);
  } else if (investment >= 500000) {
    customers = Math.round(customers * 1.1);
  } else if (investment < 250000) {
    customers = Math.round(customers * 0.8);
  }

  // Model-specific adjustments.
  if (normalizedModel.includes("freemium")) {
    customers = Math.round(customers * 1.25);
    averagePrice = Math.round(averagePrice * 0.65);
  }

  if (normalizedModel.includes("commission")) {
    customers = Math.round(customers * 1.15);
    averagePrice = Math.round(averagePrice * 0.7);
  }

  const revenue = customers * averagePrice;

  return {
    revenue: roundMoney(revenue),
    customers,
    averagePrice,
  };
}

// ============================================================
// MONTHLY EXPENSE ESTIMATION
// ============================================================

function calculateExpenses(
  businessType: string,
  model: string,
  investment: number,
  monthlyRevenue: number
): number {
  const normalizedModel = model.toLowerCase();

  // Base operating expense by business category.
  let fixedExpenses = 90000;

  switch (businessType) {
    case "technology":
      fixedExpenses = 115000;
      break;

    case "marketplace":
      fixedExpenses = 145000;
      break;

    case "food":
      fixedExpenses = 155000;
      break;

    case "logistics":
      fixedExpenses = 175000;
      break;

    case "health":
      fixedExpenses = 135000;
      break;

    case "education":
      fixedExpenses = 95000;
      break;

    case "services":
      fixedExpenses = 75000;
      break;

    default:
      fixedExpenses = 100000;
  }

  // Business model adjustments.
  if (normalizedModel.includes("saas")) {
    fixedExpenses += 15000;
  }

  if (normalizedModel.includes("marketplace")) {
    fixedExpenses += 25000;
  }

  if (normalizedModel.includes("commission")) {
    fixedExpenses += 20000;
  }

  if (normalizedModel.includes("direct sales")) {
    fixedExpenses += 10000;
  }

  // Higher investment normally allows a larger operating setup.
  if (investment >= 1000000) {
    fixedExpenses *= 1.2;
  } else if (investment >= 500000) {
    fixedExpenses *= 1.1;
  } else if (investment < 250000) {
    fixedExpenses *= 0.85;
  }

  // Variable expenses scale with revenue.
  let variableRate = 0.15;

  if (businessType === "technology") {
    variableRate = 0.1;
  }

  if (businessType === "marketplace") {
    variableRate = 0.2;
  }

  if (businessType === "food") {
    variableRate = 0.35;
  }

  if (businessType === "logistics") {
    variableRate = 0.4;
  }

  if (businessType === "health") {
    variableRate = 0.2;
  }

  if (businessType === "education") {
    variableRate = 0.12;
  }

  if (businessType === "services") {
    variableRate = 0.18;
  }

  const variableExpenses = monthlyRevenue * variableRate;

  const totalExpenses = fixedExpenses + variableExpenses;

  return roundMoney(totalExpenses);
}

// ============================================================
// SINGLE FINANCIAL MODEL
// ============================================================

export function calculateFinancialModel(
  inputs: FinancialInputs
): FinancialModel {
  const business = inputs.business || "";
  const model = inputs.model || "";

  const investment = parseInvestment(inputs.investment || "");

  const businessType = detectBusinessType(business, model);

  const revenueData = calculateRevenue(
    businessType,
    model,
    investment
  );

  const monthlyRevenue = revenueData.revenue;

  const monthlyExpenses = calculateExpenses(
    businessType,
    model,
    investment,
    monthlyRevenue
  );

  // ----------------------------------------------------------
  // IMPORTANT:
  // Gross profit cannot be larger than revenue.
  // ----------------------------------------------------------

  const grossProfit = monthlyRevenue - monthlyRevenue * 0.18;

  const grossMargin =
    monthlyRevenue > 0
      ? (grossProfit / monthlyRevenue) * 100
      : 0;

  // Real operating profit/loss.
  const monthlyProfit =
    monthlyRevenue - monthlyExpenses;

  // Burn only exists when the business is losing money.
  const monthlyBurn =
    monthlyProfit < 0
      ? Math.abs(monthlyProfit)
      : 0;

  // ----------------------------------------------------------
  // RUNWAY
  // ----------------------------------------------------------

  let runway = 0;

  if (monthlyBurn > 0) {
    runway = investment / monthlyBurn;
  } else {
    // Profitable businesses do not have a burn-based runway.
    // Show a strong operational runway indicator instead.
    runway = 60;
  }

  runway = Number(
    clamp(runway, 0, 60).toFixed(1)
  );

  // ----------------------------------------------------------
  // BREAK-EVEN
  // ----------------------------------------------------------

  const variableCostRate =
    businessType === "food"
      ? 0.35
      : businessType === "logistics"
      ? 0.4
      : businessType === "marketplace"
      ? 0.2
      : 0.18;

  const fixedCost =
    monthlyExpenses -
    monthlyRevenue * variableCostRate;

  const contributionMargin =
    1 - variableCostRate;

  const breakEvenRevenue =
    contributionMargin > 0
      ? fixedCost / contributionMargin
      : monthlyRevenue;

  // ----------------------------------------------------------
  // ANNUAL PROFIT
  // ----------------------------------------------------------

  const annualProfit = monthlyProfit * 12;

  // ----------------------------------------------------------
  // ROI
  // ----------------------------------------------------------

  const roi =
    investment > 0
      ? (annualProfit / investment) * 100
      : 0;

  // ----------------------------------------------------------
  // ASSUMPTIONS
  // ----------------------------------------------------------

  const revenueAssumption =
    `${revenueData.customers.toLocaleString(
      "en-IN"
    )} starting customers × ₹${revenueData.averagePrice.toLocaleString(
      "en-IN"
    )} average monthly revenue per customer`;

  let expenseAssumption =
    "Prototype estimate based on product development, team, infrastructure and customer acquisition costs";

  if (businessType === "food") {
    expenseAssumption =
      "Prototype estimate including ingredients, staff, rent, packaging, delivery and operating costs";
  }

  if (businessType === "logistics") {
    expenseAssumption =
      "Prototype estimate including delivery operations, fleet/logistics, staff and technology costs";
  }

  if (businessType === "marketplace") {
    expenseAssumption =
      "Prototype estimate including technology, operations, marketplace acquisition and support costs";
  }

  if (businessType === "services") {
    expenseAssumption =
      "Prototype estimate including staff, sales, software and customer acquisition costs";
  }

  return {
    investment,
    monthlyRevenue,
    monthlyExpenses,
    grossProfit: roundMoney(grossProfit),
    grossMargin: Number(grossMargin.toFixed(1)),
    monthlyBurn: roundMoney(monthlyBurn),
    runway,
    breakEvenRevenue: roundMoney(
      Math.max(breakEvenRevenue, 0)
    ),
    annualProfit: roundMoney(annualProfit),
    roi: Number(roi.toFixed(1)),
    revenueAssumption,
    expenseAssumption,
  };
}

// ============================================================
// SCENARIO PLANNING
// ============================================================

export function calculateFinancialScenarios(
  inputs: FinancialInputs
): FinancialScenario[] {
  const base = calculateFinancialModel(inputs);

  const scenarios: FinancialScenarioInput[] = [
    {
      name: "Conservative",
      description:
        "Slower customer adoption with controlled operating costs.",
      revenueMultiplier: 0.7,
      expenseMultiplier: 0.85,
    },
    {
      name: "Base Case",
      description:
        "Current prototype assumptions using a balanced growth case.",
      revenueMultiplier: 1,
      expenseMultiplier: 1,
    },
    {
      name: "Aggressive",
      description:
        "Stronger customer adoption with increased growth investment.",
      revenueMultiplier: 1.6,
      expenseMultiplier: 1.2,
    },
  ];

  return scenarios.map((scenario) => {
    const monthlyRevenue = roundMoney(
      base.monthlyRevenue *
        scenario.revenueMultiplier
    );

    const monthlyExpenses = roundMoney(
      base.monthlyExpenses *
        scenario.expenseMultiplier
    );

    const grossProfit = roundMoney(
      monthlyRevenue -
        monthlyRevenue * 0.18
    );

    const monthlyProfit =
      monthlyRevenue - monthlyExpenses;

    const monthlyBurn =
      monthlyProfit < 0
        ? Math.abs(monthlyProfit)
        : 0;

    const runway =
      monthlyBurn > 0
        ? Number(
            clamp(
              base.investment / monthlyBurn,
              0,
              60
            ).toFixed(1)
          )
        : 60;

    const variableRate = 0.18;

    const fixedCost =
      monthlyExpenses -
      monthlyRevenue * variableRate;

    const breakEvenRevenue =
      fixedCost / (1 - variableRate);

    const annualProfit =
      monthlyProfit * 12;

    const roi =
      base.investment > 0
        ? (annualProfit /
            base.investment) *
          100
        : 0;

    return {
      name: scenario.name,
      description: scenario.description,
      monthlyRevenue,
      monthlyExpenses,
      grossProfit,
      monthlyBurn: roundMoney(monthlyBurn),
      runway,
      breakEvenRevenue: roundMoney(
        Math.max(breakEvenRevenue, 0)
      ),
      annualProfit: roundMoney(
        annualProfit
      ),
      roi: Number(roi.toFixed(1)),
    };
  });
}