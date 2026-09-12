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

/*
 * PARSE INVESTMENT
 */

function parseInvestment(
  value: string
): number {
  const text =
    value.toLowerCase().trim();

  const numberMatch =
    text.match(/[\d,.]+/);

  if (!numberMatch) {
    return 500000;
  }

  const number =
    parseFloat(
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

  if (
    text.includes("million")
  ) {
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

/*
 * CLAMP SCORE
 */

function clamp(
  value: number,
  minimum = 35,
  maximum = 95
): number {
  return Math.max(
    minimum,
    Math.min(value, maximum)
  );
}

/*
 * MARKET SCORE
 */

function calculateMarketScore(
  business: string,
  market: string,
  country: string
): number {
  let score = 65;

  /*
   * Business category
   */

  if (
    business.includes("ai") ||
    business.includes("software") ||
    business.includes("saas") ||
    business.includes("technology") ||
    business.includes("digital") ||
    business.includes("app")
  ) {
    score += 8;
  }

  if (
    business.includes("health") ||
    business.includes("medical") ||
    business.includes("education") ||
    business.includes("finance")
  ) {
    score += 4;
  }

  if (
    business.includes("manufacturing") ||
    business.includes("hardware")
  ) {
    score -= 3;
  }

  /*
   * Target market
   */

  if (
    market.includes("consumer") ||
    market.includes("student") ||
    market.includes("students") ||
    market.includes("business") ||
    market.includes("enterprise")
  ) {
    score += 5;
  }

  if (
    market.includes("global") ||
    market.includes("international")
  ) {
    score += 5;
  }

  if (
    market.includes("niche") ||
    market.includes("specialized")
  ) {
    score += 3;
  }

  if (
    market.includes("small") ||
    market.includes("limited")
  ) {
    score -= 6;
  }

  /*
   * Country
   */

  if (
    country.includes("india") ||
    country.includes("indian")
  ) {
    score += 5;
  }

  if (
    country.includes("usa") ||
    country.includes("united states") ||
    country.includes("america")
  ) {
    score += 6;
  }

  if (
    country.includes("singapore") ||
    country.includes("uae") ||
    country.includes("dubai")
  ) {
    score += 4;
  }

  return clamp(score);
}

/*
 * COMPETITION SCORE
 *
 * Higher score = better position.
 * Therefore strong competition reduces the score.
 */

function calculateCompetitionScore(
  business: string,
  market: string
): number {
  let score = 70;

  /*
   * Highly competitive categories
   */

  if (
    business.includes("food") ||
    business.includes("restaurant") ||
    business.includes("delivery")
  ) {
    score -= 18;
  }

  if (
    business.includes("ecommerce") ||
    business.includes("e-commerce") ||
    business.includes("online store")
  ) {
    score -= 16;
  }

  if (
    business.includes("fintech") ||
    business.includes("banking") ||
    business.includes("payment") ||
    business.includes("finance")
  ) {
    score -= 12;
  }

  if (
    business.includes("ai") ||
    business.includes("software") ||
    business.includes("saas")
  ) {
    score -= 8;
  }

  if (
    business.includes("health") ||
    business.includes("medical")
  ) {
    score -= 6;
  }

  /*
   * Market positioning
   */

  if (
    market.includes("niche") ||
    market.includes("specialized")
  ) {
    score += 12;
  }

  if (
    market.includes("enterprise") ||
    market.includes("b2b")
  ) {
    score += 5;
  }

  if (
    market.includes("global") ||
    market.includes("international")
  ) {
    score -= 5;
  }

  return clamp(
    score,
    30,
    92
  );
}

/*
 * ECONOMICS SCORE
 */

function calculateEconomicsScore(
  business: string,
  model: string,
  investment: number
): number {
  let score = 65;

  /*
   * Business model
   */

  if (
    model.includes("subscription") ||
    model.includes("saas")
  ) {
    score += 12;
  }

  if (
    model.includes("freemium")
  ) {
    score += 3;
  }

  if (
    model.includes("direct sales")
  ) {
    score += 5;
  }

  if (
    model.includes("commission")
  ) {
    score += 3;
  }

  if (
    model.includes("marketplace")
  ) {
    score -= 2;
  }

  /*
   * Capital efficiency
   */

  if (investment < 250000) {
    score -= 8;
  } else if (
    investment < 500000
  ) {
    score -= 3;
  } else if (
    investment >= 1000000 &&
    investment < 5000000
  ) {
    score += 5;
  } else if (
    investment >= 5000000
  ) {
    score += 7;
  }

  /*
   * Capital-intensive businesses
   */

  if (
    business.includes("manufacturing") ||
    business.includes("hardware")
  ) {
    score -= 12;
  }

  if (
    business.includes("construction") ||
    business.includes("real estate")
  ) {
    score -= 10;
  }

  if (
    business.includes("delivery") ||
    business.includes("logistics")
  ) {
    score -= 8;
  }

  /*
   * Digital businesses
   */

  if (
    business.includes("software") ||
    business.includes("ai") ||
    business.includes("saas") ||
    business.includes("app")
  ) {
    score += 6;
  }

  return clamp(score);
}

/*
 * REGULATION SCORE
 *
 * Higher score = lower regulatory burden.
 */

function calculateRegulationScore(
  business: string
): number {
  let score = 75;

  /*
   * Healthcare
   */

  if (
    business.includes("health") ||
    business.includes("medical") ||
    business.includes("clinic") ||
    business.includes("hospital") ||
    business.includes("doctor")
  ) {
    score -= 22;
  }

  /*
   * Financial services
   */

  if (
    business.includes("fintech") ||
    business.includes("finance") ||
    business.includes("banking") ||
    business.includes("bank") ||
    business.includes("payment") ||
    business.includes("loan") ||
    business.includes("insurance")
  ) {
    score -= 25;
  }

  /*
   * Food
   */

  if (
    business.includes("food") ||
    business.includes("restaurant")
  ) {
    score -= 7;
  }

  /*
   * Personal data
   */

  if (
    business.includes("personal data") ||
    business.includes("identity") ||
    business.includes("privacy")
  ) {
    score -= 8;
  }

  /*
   * Education
   */

  if (
    business.includes("education") ||
    business.includes("learning")
  ) {
    score -= 3;
  }

  /*
   * Standard software businesses
   */

  if (
    business.includes("software") ||
    business.includes("saas") ||
    business.includes("app")
  ) {
    score += 3;
  }

  return clamp(
    score,
    30,
    92
  );
}

/*
 * RISK SCORE
 *
 * Higher score = lower overall risk.
 */

function calculateRiskScore(
  business: string,
  model: string,
  investment: number
): number {
  let score = 70;

  /*
   * High-risk categories
   */

  if (
    business.includes("health") ||
    business.includes("medical")
  ) {
    score -= 12;
  }

  if (
    business.includes("finance") ||
    business.includes("fintech") ||
    business.includes("banking") ||
    business.includes("payment")
  ) {
    score -= 14;
  }

  if (
    business.includes("manufacturing") ||
    business.includes("hardware")
  ) {
    score -= 10;
  }

  if (
    business.includes("construction") ||
    business.includes("real estate")
  ) {
    score -= 8;
  }

  if (
    business.includes("delivery") ||
    business.includes("logistics")
  ) {
    score -= 7;
  }

  /*
   * Business model
   */

  if (
    model.includes("subscription") ||
    model.includes("saas")
  ) {
    score += 8;
  }

  if (
    model.includes("marketplace")
  ) {
    score -= 5;
  }

  if (
    model.includes("freemium")
  ) {
    score -= 3;
  }

  /*
   * Investment buffer
   */

  if (investment < 250000) {
    score -= 12;
  } else if (
    investment < 500000
  ) {
    score -= 5;
  } else if (
    investment >= 1000000
  ) {
    score += 5;
  }

  /*
   * Digital businesses generally
   * have lower physical execution risk.
   */

  if (
    business.includes("software") ||
    business.includes("ai") ||
    business.includes("saas") ||
    business.includes("digital")
  ) {
    score += 5;
  }

  return clamp(
    score,
    30,
    92
  );
}

/*
 * VERDICT
 */

function getVerdict(
  total: number
): string {
  if (total >= 85) {
    return "Excellent Potential";
  }

  if (total >= 78) {
    return "Strong Potential";
  }

  if (total >= 70) {
    return "Good Potential";
  }

  if (total >= 60) {
    return "Moderate Potential";
  }

  if (total >= 50) {
    return "Needs Validation";
  }

  return "High Risk";
}

/*
 * MAIN VENTURE SCORE ENGINE
 */

export function calculateVentureScore(
  inputs: VentureInputs
): VentureScore {
  const business =
    inputs.business
      .toLowerCase()
      .trim();

  const market =
    inputs.market
      .toLowerCase()
      .trim();

  const country =
    inputs.country
      .toLowerCase()
      .trim();

  const model =
    inputs.model
      .toLowerCase()
      .trim();

  const investment =
    parseInvestment(
      inputs.investment
    );

  /*
   * Calculate individual dimensions
   */

  const marketScore =
    calculateMarketScore(
      business,
      market,
      country
    );

  const competitionScore =
    calculateCompetitionScore(
      business,
      market
    );

  const economicsScore =
    calculateEconomicsScore(
      business,
      model,
      investment
    );

  const regulationScore =
    calculateRegulationScore(
      business
    );

  const riskScore =
    calculateRiskScore(
      business,
      model,
      investment
    );

  /*
   * Weighted Venture Score
   *
   * Market: 25%
   * Competition: 20%
   * Economics: 25%
   * Regulation: 10%
   * Risk: 20%
   */

  const total =
    Math.round(
      marketScore * 0.25 +
      competitionScore * 0.20 +
      economicsScore * 0.25 +
      regulationScore * 0.10 +
      riskScore * 0.20
    );

  /*
   * Final verdict
   */

  const verdict =
    getVerdict(total);

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