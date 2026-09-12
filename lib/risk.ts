export type RiskInputs = {
  business: string;
  country: string;
  market: string;
  investment: string;
  model: string;
};

export type RiskItem = {
  name: string;
  score: number;
  level: string;
  explanation: string;
};

export type RiskIntelligence = {
  overallRisk: number;
  overallLevel: string;
  marketRisk: RiskItem;
  financialRisk: RiskItem;
  competitionRisk: RiskItem;
  operationalRisk: RiskItem;
  regulatoryRisk: RiskItem;
};

function parseInvestment(value: string): number {
  const text = value.toLowerCase().trim();

  const numberMatch = text.match(/[\d,.]+/);

  if (!numberMatch) {
    return 500000;
  }

  const number = parseFloat(
    numberMatch[0].replace(/,/g, "")
  );

  if (!Number.isFinite(number)) {
    return 500000;
  }

  if (
    text.includes("crore") ||
    text.includes("cr")
  ) {
    return number * 10000000;
  }

  if (
    text.includes("lakh") ||
    text.includes("lac")
  ) {
    return number * 100000;
  }

  if (text.includes("million")) {
    return number * 1000000;
  }

  if (
    text.endsWith("k") ||
    text.includes(" k")
  ) {
    return number * 1000;
  }

  return number;
}

function clamp(
  value: number,
  minimum = 15,
  maximum = 95
): number {
  return Math.max(
    minimum,
    Math.min(value, maximum)
  );
}

function getRiskLevel(score: number): string {
  if (score >= 75) {
    return "Very High";
  }

  if (score >= 60) {
    return "High";
  }

  if (score >= 40) {
    return "Moderate";
  }

  return "Low";
}

function getRiskExplanation(
  type: string,
  score: number
): string {
  if (type === "market") {
    if (score >= 75) {
      return "Market uncertainty is significant. Customer demand, adoption and market validation should be treated as major priorities.";
    }

    if (score >= 60) {
      return "The venture may face meaningful uncertainty around demand, market maturity or customer adoption.";
    }

    if (score >= 40) {
      return "The market appears reasonably viable, but customer demand should be validated before significant scaling.";
    }

    return "The selected market appears relatively favorable, with comparatively lower demand uncertainty.";
  }

  if (type === "financial") {
    if (score >= 75) {
      return "Capital requirements and cash-flow pressure could materially threaten the venture without careful financial control.";
    }

    if (score >= 60) {
      return "The venture may require disciplined spending, sufficient capital and close monitoring of cash flow.";
    }

    if (score >= 40) {
      return "Financial risk appears manageable, but revenue assumptions should be validated before major spending.";
    }

    return "The business model appears relatively manageable from a financial-risk perspective.";
  }

  if (type === "competition") {
    if (score >= 75) {
      return "The category is highly competitive. Differentiation, customer acquisition and retention will be major challenges.";
    }

    if (score >= 60) {
      return "Strong competitive pressure may require clear positioning and a defensible customer advantage.";
    }

    if (score >= 40) {
      return "Competition appears manageable, although the venture will still need clear differentiation.";
    }

    return "Competitive pressure appears relatively limited, creating more room for differentiation.";
  }

  if (type === "operational") {
    if (score >= 75) {
      return "The operating model may involve significant logistics, infrastructure, people or execution complexity.";
    }

    if (score >= 60) {
      return "Execution may become complex as the venture grows and should be supported by strong operational processes.";
    }

    if (score >= 40) {
      return "The operating model appears manageable, but execution discipline will still be important.";
    }

    return "The operating model appears relatively straightforward for an early-stage venture.";
  }

  if (type === "regulatory") {
    if (score >= 75) {
      return "The venture may face significant licensing, compliance, privacy, financial or sector-specific requirements.";
    }

    if (score >= 60) {
      return "Regulatory and compliance requirements should be reviewed carefully before launch.";
    }

    if (score >= 40) {
      return "Some regulatory considerations may apply and should be validated for the selected market.";
    }

    return "The venture appears to have relatively limited regulatory exposure based on the information provided.";
  }

  return "Risk should be validated as the business develops.";
}

export function calculateRiskIntelligence(
  inputs: RiskInputs
): RiskIntelligence {
  const business =
    inputs.business.toLowerCase();

  const country =
    inputs.country.toLowerCase();

  const market =
    inputs.market.toLowerCase();

  const model =
    inputs.model.toLowerCase();

  const investment =
    parseInvestment(inputs.investment);

  // ==========================================================
  // MARKET RISK
  // ==========================================================

  let marketRiskScore = 45;

  if (
    market.includes("consumer") ||
    market.includes("student") ||
    market.includes("students") ||
    market.includes("individual") ||
    market.includes("retail")
  ) {
    marketRiskScore -= 5;
  }

  if (
    market.includes("business") ||
    market.includes("enterprise") ||
    market.includes("b2b")
  ) {
    marketRiskScore -= 3;
  }

  if (
    market.includes("niche") ||
    market.includes("small") ||
    market.includes("specialized")
  ) {
    marketRiskScore += 8;
  }

  if (
    market.includes("global") ||
    market.includes("international")
  ) {
    marketRiskScore += 7;
  }

  if (
    market.includes("emerging") ||
    market.includes("new")
  ) {
    marketRiskScore += 5;
  }

  if (
    business.includes("ai") ||
    business.includes("software") ||
    business.includes("saas") ||
    business.includes("technology") ||
    business.includes("digital") ||
    business.includes("app")
  ) {
    marketRiskScore -= 4;
  }

  if (
    business.includes("manufacturing") ||
    business.includes("hardware")
  ) {
    marketRiskScore += 10;
  }

  marketRiskScore = clamp(
    marketRiskScore
  );

  // ==========================================================
  // FINANCIAL RISK
  // ==========================================================

  let financialRiskScore = 45;

  if (
    model.includes("subscription") ||
    model.includes("saas")
  ) {
    financialRiskScore -= 8;
  }

  if (
    model.includes("freemium")
  ) {
    financialRiskScore += 7;
  }

  if (
    model.includes("marketplace")
  ) {
    financialRiskScore += 8;
  }

  if (
    model.includes("commission")
  ) {
    financialRiskScore += 5;
  }

  if (
    model.includes("direct sales")
  ) {
    financialRiskScore += 2;
  }

  if (investment < 250000) {
    financialRiskScore += 15;
  } else if (investment < 500000) {
    financialRiskScore += 8;
  } else if (investment < 1000000) {
    financialRiskScore += 3;
  } else if (investment >= 5000000) {
    financialRiskScore -= 8;
  }

  if (
    business.includes("manufacturing") ||
    business.includes("hardware")
  ) {
    financialRiskScore += 12;
  }

  if (
    business.includes("real estate") ||
    business.includes("construction")
  ) {
    financialRiskScore += 10;
  }

  financialRiskScore = clamp(
    financialRiskScore
  );

  // ==========================================================
  // COMPETITION RISK
  // ==========================================================

  let competitionRiskScore = 42;

  if (
    business.includes("food") ||
    business.includes("restaurant") ||
    business.includes("delivery")
  ) {
    competitionRiskScore += 18;
  }

  if (
    business.includes("ecommerce") ||
    business.includes("e-commerce") ||
    business.includes("marketplace")
  ) {
    competitionRiskScore += 15;
  }

  if (
    business.includes("fintech") ||
    business.includes("finance") ||
    business.includes("payment") ||
    business.includes("banking")
  ) {
    competitionRiskScore += 12;
  }

  if (
    business.includes("ai") ||
    business.includes("software") ||
    business.includes("saas")
  ) {
    competitionRiskScore += 8;
  }

  if (
    business.includes("education") ||
    business.includes("learning")
  ) {
    competitionRiskScore += 5;
  }

  if (
    business.includes("health") ||
    business.includes("medical")
  ) {
    competitionRiskScore += 7;
  }

  if (
    market.includes("niche") ||
    market.includes("specialized")
  ) {
    competitionRiskScore -= 12;
  }

  if (
    market.includes("enterprise") ||
    market.includes("b2b")
  ) {
    competitionRiskScore -= 4;
  }

  competitionRiskScore = clamp(
    competitionRiskScore
  );

  // ==========================================================
  // OPERATIONAL RISK
  // ==========================================================

  let operationalRiskScore = 40;

  if (
    business.includes("delivery") ||
    business.includes("logistics") ||
    business.includes("food") ||
    business.includes("restaurant")
  ) {
    operationalRiskScore += 20;
  }

  if (
    business.includes("manufacturing") ||
    business.includes("hardware")
  ) {
    operationalRiskScore += 22;
  }

  if (
    business.includes("construction") ||
    business.includes("real estate")
  ) {
    operationalRiskScore += 15;
  }

  if (
    business.includes("health") ||
    business.includes("medical") ||
    business.includes("clinic") ||
    business.includes("hospital")
  ) {
    operationalRiskScore += 12;
  }

  if (
    business.includes("marketplace")
  ) {
    operationalRiskScore += 8;
  }

  if (
    business.includes("software") ||
    business.includes("ai") ||
    business.includes("saas") ||
    business.includes("app")
  ) {
    operationalRiskScore -= 8;
  }

  if (
    model.includes("subscription") ||
    model.includes("saas")
  ) {
    operationalRiskScore -= 3;
  }

  operationalRiskScore = clamp(
    operationalRiskScore
  );

  // ==========================================================
  // REGULATORY RISK
  // ==========================================================

  let regulatoryRiskScore = 30;

  if (
    business.includes("health") ||
    business.includes("medical") ||
    business.includes("clinic") ||
    business.includes("doctor") ||
    business.includes("hospital")
  ) {
    regulatoryRiskScore += 25;
  }

  if (
    business.includes("bank") ||
    business.includes("banking") ||
    business.includes("finance") ||
    business.includes("fintech") ||
    business.includes("payment") ||
    business.includes("loan")
  ) {
    regulatoryRiskScore += 30;
  }

  if (
    business.includes("insurance")
  ) {
    regulatoryRiskScore += 25;
  }

  if (
    business.includes("food") ||
    business.includes("restaurant")
  ) {
    regulatoryRiskScore += 8;
  }

  if (
    business.includes("education") ||
    business.includes("student")
  ) {
    regulatoryRiskScore += 3;
  }

  if (
    business.includes("data") ||
    business.includes("privacy") ||
    business.includes("identity") ||
    business.includes("personal information")
  ) {
    regulatoryRiskScore += 12;
  }

  if (
    country.includes("india") ||
    country.includes("indian")
  ) {
    if (
      business.includes("fintech") ||
      business.includes("payment") ||
      business.includes("bank") ||
      business.includes("loan")
    ) {
      regulatoryRiskScore += 5;
    }

    if (
      business.includes("health") ||
      business.includes("medical")
    ) {
      regulatoryRiskScore += 5;
    }
  }

  regulatoryRiskScore = clamp(
    regulatoryRiskScore
  );

  // ==========================================================
  // RISK ITEMS
  // ==========================================================

  const marketRisk: RiskItem = {
    name: "Market Risk",
    score: marketRiskScore,
    level: getRiskLevel(
      marketRiskScore
    ),
    explanation: getRiskExplanation(
      "market",
      marketRiskScore
    ),
  };

  const financialRisk: RiskItem = {
    name: "Financial Risk",
    score: financialRiskScore,
    level: getRiskLevel(
      financialRiskScore
    ),
    explanation: getRiskExplanation(
      "financial",
      financialRiskScore
    ),
  };

  const competitionRisk: RiskItem = {
    name: "Competition Risk",
    score: competitionRiskScore,
    level: getRiskLevel(
      competitionRiskScore
    ),
    explanation: getRiskExplanation(
      "competition",
      competitionRiskScore
    ),
  };

  const operationalRisk: RiskItem = {
    name: "Operational Risk",
    score: operationalRiskScore,
    level: getRiskLevel(
      operationalRiskScore
    ),
    explanation: getRiskExplanation(
      "operational",
      operationalRiskScore
    ),
  };

  const regulatoryRisk: RiskItem = {
    name: "Regulatory Risk",
    score: regulatoryRiskScore,
    level: getRiskLevel(
      regulatoryRiskScore
    ),
    explanation: getRiskExplanation(
      "regulatory",
      regulatoryRiskScore
    ),
  };

  // ==========================================================
  // OVERALL RISK
  // ==========================================================

  const overallRisk = Math.round(
    (
      marketRiskScore +
      financialRiskScore +
      competitionRiskScore +
      operationalRiskScore +
      regulatoryRiskScore
    ) / 5
  );

  const overallLevel =
    getRiskLevel(overallRisk);

  return {
    overallRisk,
    overallLevel,
    marketRisk,
    financialRisk,
    competitionRisk,
    operationalRisk,
    regulatoryRisk,
  };
}