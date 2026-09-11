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

export function calculateRiskIntelligence(
  inputs: RiskInputs
): RiskIntelligence {
  const business = inputs.business.toLowerCase();
  const market = inputs.market.toLowerCase();
  const model = inputs.model.toLowerCase();

  // -----------------------------------
  // MARKET RISK
  // -----------------------------------

  let marketRiskScore = 40;

  if (
    market.includes("student") ||
    market.includes("consumer") ||
    market.includes("business")
  ) {
    marketRiskScore -= 5;
  }

  if (
    business.includes("ai") ||
    business.includes("software") ||
    business.includes("technology")
  ) {
    marketRiskScore -= 5;
  }

  marketRiskScore = Math.max(
    20,
    Math.min(marketRiskScore, 90)
  );

  // -----------------------------------
  // FINANCIAL RISK
  // -----------------------------------

  let financialRiskScore = 45;

  if (
    model.includes("subscription") ||
    model.includes("saas")
  ) {
    financialRiskScore -= 10;
  }

  if (model.includes("marketplace")) {
    financialRiskScore += 5;
  }

  if (
    inputs.investment.includes("10") ||
    inputs.investment.includes("5")
  ) {
    financialRiskScore += 5;
  }

  financialRiskScore = Math.max(
    20,
    Math.min(financialRiskScore, 90)
  );

  // -----------------------------------
  // COMPETITION RISK
  // -----------------------------------

  let competitionRiskScore = 45;

  if (
    business.includes("food") ||
    business.includes("delivery")
  ) {
    competitionRiskScore += 20;
  }

  if (
    business.includes("ecommerce") ||
    business.includes("e-commerce") ||
    business.includes("marketplace")
  ) {
    competitionRiskScore += 15;
  }

  if (
    business.includes("ai") ||
    business.includes("software")
  ) {
    competitionRiskScore += 5;
  }

  competitionRiskScore = Math.max(
    20,
    Math.min(competitionRiskScore, 95)
  );

  // -----------------------------------
  // OPERATIONAL RISK
  // -----------------------------------

  let operationalRiskScore = 40;

  if (
    business.includes("delivery") ||
    business.includes("food") ||
    business.includes("restaurant")
  ) {
    operationalRiskScore += 20;
  }

  if (
    business.includes("health") ||
    business.includes("medical")
  ) {
    operationalRiskScore += 10;
  }

  if (
    business.includes("software") ||
    business.includes("ai") ||
    business.includes("saas")
  ) {
    operationalRiskScore -= 5;
  }

  operationalRiskScore = Math.max(
    20,
    Math.min(operationalRiskScore, 90)
  );

  // -----------------------------------
  // REGULATORY RISK
  // -----------------------------------

  let regulatoryRiskScore = 35;

  if (
    business.includes("health") ||
    business.includes("medical") ||
    business.includes("clinic") ||
    business.includes("doctor")
  ) {
    regulatoryRiskScore += 25;
  }

  if (
    business.includes("bank") ||
    business.includes("banking") ||
    business.includes("finance") ||
    business.includes("fintech") ||
    business.includes("payment")
  ) {
    regulatoryRiskScore += 30;
  }

  if (
    business.includes("food") ||
    business.includes("restaurant")
  ) {
    regulatoryRiskScore += 5;
  }

  regulatoryRiskScore = Math.max(
    20,
    Math.min(regulatoryRiskScore, 95)
  );

  // -----------------------------------
  // RISK LEVEL FUNCTION
  // -----------------------------------

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

  // -----------------------------------
  // RISK EXPLANATIONS
  // -----------------------------------

  const marketRisk: RiskItem = {
    name: "Market Risk",
    score: marketRiskScore,
    level: getRiskLevel(marketRiskScore),
    explanation:
      marketRiskScore < 40
        ? "The selected market shows relatively favorable conditions for this venture."
        : "The venture may face uncertainty around market demand and customer adoption.",
  };

  const financialRisk: RiskItem = {
    name: "Financial Risk",
    score: financialRiskScore,
    level: getRiskLevel(financialRiskScore),
    explanation:
      financialRiskScore < 40
        ? "The business model may provide relatively predictable revenue economics."
        : "Cash flow, operating expenses and capital requirements should be monitored carefully.",
  };

  const competitionRisk: RiskItem = {
    name: "Competition Risk",
    score: competitionRiskScore,
    level: getRiskLevel(competitionRiskScore),
    explanation:
      competitionRiskScore >= 60
        ? "The category contains strong competitors or significant market pressure."
        : "Competitive pressure appears relatively manageable.",
  };

  const operationalRisk: RiskItem = {
    name: "Operational Risk",
    score: operationalRiskScore,
    level: getRiskLevel(operationalRiskScore),
    explanation:
      operationalRiskScore >= 60
        ? "The business may require complex operations, logistics or specialized execution."
        : "The operating model appears relatively straightforward.",
  };

  const regulatoryRisk: RiskItem = {
    name: "Regulatory Risk",
    score: regulatoryRiskScore,
    level: getRiskLevel(regulatoryRiskScore),
    explanation:
      regulatoryRiskScore >= 60
        ? "The venture may face meaningful regulatory, licensing or compliance requirements."
        : "The venture appears to have relatively limited regulatory exposure.",
  };

  // -----------------------------------
  // OVERALL RISK
  // -----------------------------------

  const overallRisk = Math.round(
    (
      marketRiskScore +
      financialRiskScore +
      competitionRiskScore +
      operationalRiskScore +
      regulatoryRiskScore
    ) / 5
  );

  const overallLevel = getRiskLevel(overallRisk);

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