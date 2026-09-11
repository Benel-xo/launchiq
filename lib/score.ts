export type VentureInputs = {
  business: string;
  country: string;
  market: string;
  investment: string;
  model: string;
};

export type VentureScore = {
  market: number;
  competition: number;
  economics: number;
  regulation: number;
  risk: number;
  total: number;
  verdict: string;
};

export function calculateVentureScore(
  inputs: VentureInputs
): VentureScore {
  let marketScore = 70;
  let competitionScore = 70;
  let economicsScore = 70;
  let regulationScore = 70;
  let riskScore = 70;

  const business = inputs.business.toLowerCase();
  const market = inputs.market.toLowerCase();
  const model = inputs.model.toLowerCase();

  // -----------------------------
  // MARKET SCORE
  // -----------------------------

  if (
    business.includes("ai") ||
    business.includes("health") ||
    business.includes("technology") ||
    business.includes("software")
  ) {
    marketScore += 8;
  }

  if (
    market.includes("student") ||
    market.includes("consumer") ||
    market.includes("business")
  ) {
    marketScore += 5;
  }

  marketScore = Math.min(marketScore, 95);

  // -----------------------------
  // COMPETITION SCORE
  // -----------------------------

  if (
    business.includes("delivery") ||
    business.includes("food") ||
    business.includes("banking") ||
    business.includes("ecommerce")
  ) {
    competitionScore -= 15;
  }

  if (
    business.includes("ai") ||
    business.includes("software")
  ) {
    competitionScore += 5;
  }

  competitionScore = Math.max(
    40,
    Math.min(competitionScore, 90)
  );

  // -----------------------------
  // ECONOMICS SCORE
  // -----------------------------

  if (
    model.includes("subscription") ||
    model.includes("saas")
  ) {
    economicsScore += 10;
  }

  if (model.includes("marketplace")) {
    economicsScore += 5;
  }

  economicsScore = Math.min(
    economicsScore,
    95
  );

  // -----------------------------
  // REGULATION SCORE
  // -----------------------------

  if (
    business.includes("health") ||
    business.includes("finance") ||
    business.includes("banking")
  ) {
    regulationScore -= 15;
  }

  regulationScore = Math.max(
    40,
    regulationScore
  );

  // -----------------------------
  // RISK SCORE
  // -----------------------------

  if (
    business.includes("health") ||
    business.includes("finance")
  ) {
    riskScore -= 15;
  }

  if (
    model.includes("subscription") ||
    model.includes("saas")
  ) {
    riskScore += 5;
  }

  riskScore = Math.max(
    35,
    Math.min(riskScore, 90)
  );

  // -----------------------------
  // TOTAL SCORE
  // -----------------------------

  const total = Math.round(
    (
      marketScore +
      competitionScore +
      economicsScore +
      regulationScore +
      riskScore
    ) / 5
  );

  // -----------------------------
  // VERDICT
  // -----------------------------

  let verdict = "";

  if (total >= 80) {
    verdict = "Excellent Potential";
  } else if (total >= 70) {
    verdict = "Good Potential";
  } else if (total >= 60) {
    verdict = "Moderate Potential";
  } else {
    verdict = "High Risk";
  }

  return {
    market: marketScore,
    competition: competitionScore,
    economics: economicsScore,
    regulation: regulationScore,
    risk: riskScore,
    total,
    verdict,
  };
}