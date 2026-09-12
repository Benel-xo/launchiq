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

export function calculateFinancialModel(
  inputs: FinancialInputs
): FinancialModel {
  const investment = parseInvestment(
    inputs.investment
  );

  const model = inputs.model.toLowerCase();

  let monthlyRevenue = 0;
  let monthlyExpenses = 0;
  let grossMargin = 0;

  let revenueAssumption = "";
  let expenseAssumption = "";

  /*
   * SUBSCRIPTION / SAAS
   *
   * Revenue:
   * 500 starting customers × ₹499/month
   *
   * Gross margin:
   * 82%
   *
   * Operating expenses:
   * ₹4 lakh/month
   */

  if (
    model.includes("subscription") ||
    model.includes("saas")
  ) {
    const startingCustomers = 500;
    const monthlyPrice = 499;

    monthlyRevenue =
      startingCustomers * monthlyPrice;

    grossMargin = 82;

    monthlyExpenses = 400000;

    revenueAssumption =
      "500 starting customers × ₹499 average monthly subscription";

    expenseAssumption =
      "Prototype assumption: ₹4 lakh monthly operating expenses";
  }

  /*
   * MARKETPLACE
   *
   * Transaction value:
   * ₹10 lakh/month
   *
   * Platform fee:
   * 12%
   *
   * Operating expenses:
   * ₹3.5 lakh/month
   */

  else if (
    model.includes("marketplace")
  ) {
    const monthlyTransactionValue = 1000000;
    const platformFee = 0.12;

    monthlyRevenue =
      monthlyTransactionValue * platformFee;

    grossMargin = 75;

    monthlyExpenses = 350000;

    revenueAssumption =
      "₹10 lakh monthly transaction value × 12% platform fee";

    expenseAssumption =
      "Prototype assumption: ₹3.5 lakh monthly operating expenses";
  }

  /*
   * OTHER BUSINESS MODELS
   */

  else {
    monthlyRevenue = 300000;

    grossMargin = 65;

    monthlyExpenses = 350000;

    revenueAssumption =
      "Prototype assumption: ₹3 lakh monthly revenue";

    expenseAssumption =
      "Prototype assumption: ₹3.5 lakh monthly operating expenses";
  }

  /*
   * COST OF GOODS / SERVICE DELIVERY
   *
   * Gross margin represents the percentage of revenue
   * remaining after direct delivery costs.
   */

  const directCosts =
    Math.round(
      monthlyRevenue *
        (1 - grossMargin / 100)
    );

  /*
   * GROSS PROFIT
   */

  const grossProfit =
    Math.round(
      monthlyRevenue *
        (grossMargin / 100)
    );

  /*
   * NET OPERATING PROFIT
   *
   * Gross profit minus monthly operating expenses.
   */

  const monthlyOperatingProfit =
    grossProfit - monthlyExpenses;

  /*
   * MONTHLY BURN
   *
   * Burn is only positive when the business is losing
   * money operationally.
   */

  const monthlyBurn =
    Math.max(
      0,
      -monthlyOperatingProfit
    );

  /*
   * RUNWAY
   *
   * If the business is profitable, runway is shown
   * as 99 months rather than infinity so the existing
   * dashboard can display it cleanly.
   */

  const runway =
    monthlyBurn > 0
      ? Number(
          (
            investment /
            monthlyBurn
          ).toFixed(1)
        )
      : 99;

  /*
   * BREAK-EVEN REVENUE
   *
   * Revenue required to cover monthly operating expenses
   * at the assumed gross margin.
   */

  const breakEvenRevenue =
    grossMargin > 0
      ? Math.round(
          monthlyExpenses /
            (grossMargin / 100)
        )
      : monthlyExpenses;

  /*
   * ANNUAL OPERATING PROFIT
   *
   * This is annualized operating profit before tax,
   * financing costs and one-time expenses.
   */

  const annualProfit =
    Math.round(
      monthlyOperatingProfit * 12
    );

  /*
   * ROI
   *
   * Annual operating profit compared with the
   * initial investment.
   */

  const roi =
    investment > 0
      ? Number(
          (
            (annualProfit /
              investment) *
            100
          ).toFixed(1)
        )
      : 0;

  /*
   * Keep directCosts calculated so the financial
   * structure remains explicit and easy to extend later.
   */

  void directCosts;

  return {
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