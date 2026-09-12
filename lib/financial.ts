export type FinancialInputs = {
  business: string;
  investment: string;
  model: string;
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

export type FinancialScenarioName =
  | "Conservative"
  | "Base Case"
  | "Aggressive";

export type FinancialScenario = {
  name: FinancialScenarioName;
  description: string;

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

function parseInvestment(value: string): number {
  const text = value.toLowerCase().trim();

  const numberMatch = text.match(/[\d,.]+/);

  if (!numberMatch) {
    return 1000000;
  }

  const number = parseFloat(
    numberMatch[0].replace(/,/g, "")
  );

  if (text.includes("crore")) {
    return number * 10000000;
  }

  if (
    text.includes("lakh") ||
    text.includes("lac")
  ) {
    return number * 100000;
  }

  if (text.includes("k")) {
    return number * 1000;
  }

  return number;
}

function calculateScenario(
  investment: number,
  model: string,
  scenario: FinancialScenarioName
): FinancialScenario {
  let monthlyRevenue = 0;
  let monthlyExpenses = 0;
  let grossMargin = 0;

  let revenueAssumption = "";
  let expenseAssumption = "";
  let description = "";

  /*
   * SUBSCRIPTION / SAAS
   */

  if (
    model.includes("subscription") ||
    model.includes("saas")
  ) {
    const baseCustomers = 500;
    const monthlyPrice = 499;

    let customerMultiplier = 1;
    let expenseMultiplier = 1;

    if (scenario === "Conservative") {
      customerMultiplier = 0.6;
      expenseMultiplier = 0.9;

      description =
        "Slower customer adoption with controlled operating costs.";
    }

    if (scenario === "Base Case") {
      customerMultiplier = 1;
      expenseMultiplier = 1;

      description =
        "Current prototype assumptions using a balanced growth case.";
    }

    if (scenario === "Aggressive") {
      customerMultiplier = 1.6;
      expenseMultiplier = 1.2;

      description =
        "Stronger customer adoption with increased growth investment.";
    }

    const startingCustomers = Math.round(
      baseCustomers * customerMultiplier
    );

    monthlyRevenue =
      startingCustomers * monthlyPrice;

    grossMargin = 82;

    monthlyExpenses =
      Math.round(400000 * expenseMultiplier);

    revenueAssumption =
      `${startingCustomers} starting customers × ₹${monthlyPrice} average monthly subscription`;

    expenseAssumption =
      `Prototype assumption: ₹${(
        monthlyExpenses / 100000
      ).toFixed(1)} lakh monthly operating expenses`;
  }

  /*
   * MARKETPLACE
   */

  else if (
    model.includes("marketplace")
  ) {
    const baseTransactionValue = 1000000;
    const platformFee = 0.12;

    let transactionMultiplier = 1;
    let expenseMultiplier = 1;

    if (scenario === "Conservative") {
      transactionMultiplier = 0.6;
      expenseMultiplier = 0.9;

      description =
        "Lower transaction activity with disciplined operating costs.";
    }

    if (scenario === "Base Case") {
      transactionMultiplier = 1;
      expenseMultiplier = 1;

      description =
        "Current prototype marketplace assumptions.";
    }

    if (scenario === "Aggressive") {
      transactionMultiplier = 1.7;
      expenseMultiplier = 1.2;

      description =
        "Higher transaction volume supported by increased investment.";
    }

    const monthlyTransactionValue =
      Math.round(
        baseTransactionValue *
          transactionMultiplier
      );

    monthlyRevenue =
      monthlyTransactionValue * platformFee;

    grossMargin = 75;

    monthlyExpenses =
      Math.round(350000 * expenseMultiplier);

    revenueAssumption =
      `₹${(
        monthlyTransactionValue / 100000
      ).toFixed(1)} lakh monthly transaction value × 12% platform fee`;

    expenseAssumption =
      `Prototype assumption: ₹${(
        monthlyExpenses / 100000
      ).toFixed(1)} lakh monthly operating expenses`;
  }

  /*
   * OTHER BUSINESS MODELS
   */

  else {
    let revenueMultiplier = 1;
    let expenseMultiplier = 1;

    if (scenario === "Conservative") {
      revenueMultiplier = 0.65;
      expenseMultiplier = 0.9;

      description =
        "Slower revenue generation with controlled operating costs.";
    }

    if (scenario === "Base Case") {
      revenueMultiplier = 1;
      expenseMultiplier = 1;

      description =
        "Current prototype assumptions using a balanced case.";
    }

    if (scenario === "Aggressive") {
      revenueMultiplier = 1.6;
      expenseMultiplier = 1.2;

      description =
        "Faster revenue growth with increased operating investment.";
    }

    monthlyRevenue =
      Math.round(
        300000 * revenueMultiplier
      );

    grossMargin = 65;

    monthlyExpenses =
      Math.round(
        350000 * expenseMultiplier
      );

    revenueAssumption =
      `Prototype assumption: ₹${(
        monthlyRevenue / 100000
      ).toFixed(1)} lakh monthly revenue`;

    expenseAssumption =
      `Prototype assumption: ₹${(
        monthlyExpenses / 100000
      ).toFixed(1)} lakh monthly operating expenses`;
  }

  /*
   * FALLBACK DESCRIPTION
   */

  if (!description) {
    if (scenario === "Conservative") {
      description =
        "A cautious case using slower growth assumptions.";
    }

    if (scenario === "Base Case") {
      description =
        "The central case based on current prototype assumptions.";
    }

    if (scenario === "Aggressive") {
      description =
        "A higher-growth case assuming stronger market adoption.";
    }
  }

  /*
   * GROSS PROFIT
   */

  const grossProfit = Math.round(
    monthlyRevenue *
      (grossMargin / 100)
  );

  /*
   * MONTHLY BURN
   */

  const monthlyBurn = Math.max(
    0,
    monthlyExpenses - grossProfit
  );

  /*
   * RUNWAY
   */

  const runway =
    monthlyBurn > 0
      ? Number(
          (
            investment / monthlyBurn
          ).toFixed(1)
        )
      : 99;

  /*
   * BREAK-EVEN REVENUE
   */

  const breakEvenRevenue =
    grossMargin > 0
      ? Math.round(
          monthlyExpenses /
            (grossMargin / 100)
        )
      : monthlyExpenses;

  /*
   * ANNUAL PROFIT
   */

  const annualProfit = Math.round(
    (grossProfit - monthlyExpenses) *
      12
  );

  /*
   * ROI
   */

  const roi =
    investment > 0
      ? Number(
          (
            (annualProfit / investment) *
            100
          ).toFixed(1)
        )
      : 0;

  return {
    name: scenario,
    description,

    investment,
    monthlyRevenue,
    monthlyExpenses,
    grossProfit,
    grossMargin,
    monthlyBurn,
    runway,
    breakEvenRevenue,
    annualProfit,
    roi,

    revenueAssumption,
    expenseAssumption,
  };
}

/*
 * EXISTING FINANCIAL MODEL
 *
 * Kept compatible with the current Results page.
 */

export function calculateFinancialModel(
  inputs: FinancialInputs
): FinancialModel {
  const investment = parseInvestment(
    inputs.investment
  );

  const scenario = calculateScenario(
    investment,
    inputs.model.toLowerCase(),
    "Base Case"
  );

  return {
    investment: scenario.investment,
    monthlyRevenue:
      scenario.monthlyRevenue,
    monthlyExpenses:
      scenario.monthlyExpenses,
    grossProfit:
      scenario.grossProfit,
    grossMargin:
      scenario.grossMargin,
    monthlyBurn:
      scenario.monthlyBurn,
    runway:
      scenario.runway,
    breakEvenRevenue:
      scenario.breakEvenRevenue,
    annualProfit:
      scenario.annualProfit,
    roi:
      scenario.roi,
    revenueAssumption:
      scenario.revenueAssumption,
    expenseAssumption:
      scenario.expenseAssumption,
  };
}

/*
 * FINANCIAL SCENARIO ENGINE
 *
 * Returns Conservative, Base Case
 * and Aggressive financial scenarios.
 */

export function calculateFinancialScenarios(
  inputs: FinancialInputs
): FinancialScenario[] {
  const investment = parseInvestment(
    inputs.investment
  );

  const model =
    inputs.model.toLowerCase();

  return [
    calculateScenario(
      investment,
      model,
      "Conservative"
    ),
    calculateScenario(
      investment,
      model,
      "Base Case"
    ),
    calculateScenario(
      investment,
      model,
      "Aggressive"
    ),
  ];
}