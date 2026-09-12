export type MarketInputs = {
  business: string;
  country: string;
  market: string;
};

export type MarketIntelligence = {
  country: string;
  population: number;
  gdp: number;
  internetPenetration: number;
  digitalAdoption: number;
  marketGrowth: number;
  marketOpportunity: number;
  marketSize: string;
  growthOutlook: string;
  opportunityLevel: string;
};

type MarketProfile = {
  population: number;
  gdp: number;
  internetPenetration: number;
  digitalAdoption: number;
  marketGrowth: number;
  marketSize: string;
};

/*
 * PROTOTYPE MARKET DATABASE
 *
 * These figures are illustrative market assumptions
 * used by the LaunchIQ prototype.
 *
 * They are NOT live market research.
 */

const marketDatabase: Record<
  string,
  MarketProfile
> = {
  india: {
    population: 1428600000,
    gdp: 3900000000000,
    internetPenetration: 55,
    digitalAdoption: 78,
    marketGrowth: 8,
    marketSize: "Large",
  },

  usa: {
    population: 340000000,
    gdp: 29100000000000,
    internetPenetration: 97,
    digitalAdoption: 92,
    marketGrowth: 3,
    marketSize: "Very Large",
  },

  "united states": {
    population: 340000000,
    gdp: 29100000000000,
    internetPenetration: 97,
    digitalAdoption: 92,
    marketGrowth: 3,
    marketSize: "Very Large",
  },

  uk: {
    population: 69000000,
    gdp: 3900000000000,
    internetPenetration: 97,
    digitalAdoption: 91,
    marketGrowth: 2,
    marketSize: "Large",
  },

  "united kingdom": {
    population: 69000000,
    gdp: 3900000000000,
    internetPenetration: 97,
    digitalAdoption: 91,
    marketGrowth: 2,
    marketSize: "Large",
  },

  singapore: {
    population: 6000000,
    gdp: 550000000000,
    internetPenetration: 96,
    digitalAdoption: 95,
    marketGrowth: 4,
    marketSize: "Medium",
  },

  australia: {
    population: 27000000,
    gdp: 1800000000000,
    internetPenetration: 96,
    digitalAdoption: 90,
    marketGrowth: 2,
    marketSize: "Large",
  },

  canada: {
    population: 41000000,
    gdp: 2200000000000,
    internetPenetration: 94,
    digitalAdoption: 89,
    marketGrowth: 2,
    marketSize: "Large",
  },

  germany: {
    population: 84000000,
    gdp: 4700000000000,
    internetPenetration: 93,
    digitalAdoption: 87,
    marketGrowth: 1,
    marketSize: "Large",
  },

  france: {
    population: 68000000,
    gdp: 3200000000000,
    internetPenetration: 92,
    digitalAdoption: 86,
    marketGrowth: 2,
    marketSize: "Large",
  },

  uae: {
    population: 11000000,
    gdp: 550000000000,
    internetPenetration: 99,
    digitalAdoption: 94,
    marketGrowth: 4,
    marketSize: "Medium",
  },
};

/*
 * COUNTRY ALIASES
 */

function normalizeCountry(
  country: string
): string {
  const text =
    country
      .toLowerCase()
      .trim();

  if (
    text === "us" ||
    text === "usa" ||
    text.includes("united states") ||
    text.includes("america")
  ) {
    return "usa";
  }

  if (
    text === "uk" ||
    text.includes("united kingdom") ||
    text.includes("britain")
  ) {
    return "uk";
  }

  if (
    text.includes("india") ||
    text.includes("indian")
  ) {
    return "india";
  }

  if (
    text.includes("singapore")
  ) {
    return "singapore";
  }

  if (
    text.includes("australia")
  ) {
    return "australia";
  }

  if (
    text.includes("canada")
  ) {
    return "canada";
  }

  if (
    text.includes("germany")
  ) {
    return "germany";
  }

  if (
    text.includes("france")
  ) {
    return "france";
  }

  if (
    text.includes("uae") ||
    text.includes("united arab emirates") ||
    text.includes("dubai")
  ) {
    return "uae";
  }

  return text;
}

/*
 * CLAMP SCORE
 */

function clamp(
  value: number,
  minimum = 20,
  maximum = 95
): number {
  return Math.max(
    minimum,
    Math.min(value, maximum)
  );
}

/*
 * BUSINESS CATEGORY ADJUSTMENT
 */

function calculateBusinessAdjustment(
  business: string
): number {
  const text =
    business.toLowerCase();

  let adjustment = 0;

  /*
   * Digital businesses
   */

  if (
    text.includes("ai") ||
    text.includes("software") ||
    text.includes("saas") ||
    text.includes("technology") ||
    text.includes("digital") ||
    text.includes("app") ||
    text.includes("platform")
  ) {
    adjustment += 7;
  }

  /*
   * Healthcare
   */

  if (
    text.includes("health") ||
    text.includes("medical") ||
    text.includes("clinic") ||
    text.includes("hospital") ||
    text.includes("doctor")
  ) {
    adjustment += 4;
  }

  /*
   * Education
   */

  if (
    text.includes("education") ||
    text.includes("learning") ||
    text.includes("student") ||
    text.includes("training")
  ) {
    adjustment += 4;
  }

  /*
   * Financial technology
   */

  if (
    text.includes("fintech") ||
    text.includes("payment") ||
    text.includes("banking") ||
    text.includes("finance")
  ) {
    adjustment += 5;
  }

  /*
   * Manufacturing / physical businesses
   */

  if (
    text.includes("manufacturing") ||
    text.includes("hardware") ||
    text.includes("factory")
  ) {
    adjustment -= 4;
  }

  /*
   * Local services
   */

  if (
    text.includes("local") ||
    text.includes("neighborhood")
  ) {
    adjustment -= 2;
  }

  return adjustment;
}

/*
 * TARGET MARKET ADJUSTMENT
 */

function calculateMarketAdjustment(
  market: string
): number {
  const text =
    market.toLowerCase();

  let adjustment = 0;

  /*
   * Large addressable markets
   */

  if (
    text.includes("mass market") ||
    text.includes("consumer") ||
    text.includes("retail") ||
    text.includes("general public")
  ) {
    adjustment += 5;
  }

  /*
   * B2B / Enterprise
   */

  if (
    text.includes("b2b") ||
    text.includes("business") ||
    text.includes("enterprise")
  ) {
    adjustment += 5;
  }

  /*
   * Niche markets
   *
   * Niche markets can reduce total size,
   * but may improve focus.
   */

  if (
    text.includes("niche") ||
    text.includes("specialized") ||
    text.includes("specific")
  ) {
    adjustment += 2;
  }

  /*
   * Global markets
   */

  if (
    text.includes("global") ||
    text.includes("international")
  ) {
    adjustment += 5;
  }

  /*
   * Emerging markets
   */

  if (
    text.includes("emerging") ||
    text.includes("new market")
  ) {
    adjustment += 4;
  }

  /*
   * Small market
   */

  if (
    text.includes("small") ||
    text.includes("limited")
  ) {
    adjustment -= 5;
  }

  return adjustment;
}

/*
 * MARKET SIZE ADJUSTMENT
 */

function calculateMarketSizeAdjustment(
  profile: MarketProfile
): number {
  let adjustment = 0;

  if (
    profile.marketSize ===
    "Very Large"
  ) {
    adjustment += 8;
  } else if (
    profile.marketSize ===
    "Large"
  ) {
    adjustment += 5;
  } else if (
    profile.marketSize ===
    "Medium"
  ) {
    adjustment += 2;
  }

  return adjustment;
}

/*
 * DIGITAL ADOPTION ADJUSTMENT
 */

function calculateDigitalAdjustment(
  profile: MarketProfile,
  business: string
): number {
  const text =
    business.toLowerCase();

  const digitalBusiness =
    text.includes("ai") ||
    text.includes("software") ||
    text.includes("saas") ||
    text.includes("app") ||
    text.includes("digital") ||
    text.includes("technology") ||
    text.includes("platform");

  if (!digitalBusiness) {
    return 0;
  }

  if (
    profile.digitalAdoption >= 90
  ) {
    return 8;
  }

  if (
    profile.digitalAdoption >= 80
  ) {
    return 5;
  }

  if (
    profile.digitalAdoption >= 70
  ) {
    return 2;
  }

  return -3;
}

/*
 * INTERNET PENETRATION ADJUSTMENT
 */

function calculateInternetAdjustment(
  profile: MarketProfile,
  business: string
): number {
  const text =
    business.toLowerCase();

  const digitalBusiness =
    text.includes("ai") ||
    text.includes("software") ||
    text.includes("saas") ||
    text.includes("app") ||
    text.includes("digital") ||
    text.includes("online") ||
    text.includes("technology");

  if (!digitalBusiness) {
    return 0;
  }

  if (
    profile.internetPenetration >= 90
  ) {
    return 7;
  }

  if (
    profile.internetPenetration >= 70
  ) {
    return 4;
  }

  if (
    profile.internetPenetration >= 50
  ) {
    return 1;
  }

  return -4;
}

/*
 * MARKET GROWTH ADJUSTMENT
 */

function calculateGrowthAdjustment(
  profile: MarketProfile
): number {
  if (
    profile.marketGrowth >= 7
  ) {
    return 10;
  }

  if (
    profile.marketGrowth >= 5
  ) {
    return 8;
  }

  if (
    profile.marketGrowth >= 4
  ) {
    return 6;
  }

  if (
    profile.marketGrowth >= 2
  ) {
    return 3;
  }

  if (
    profile.marketGrowth >= 1
  ) {
    return 1;
  }

  return -2;
}

/*
 * GROWTH OUTLOOK
 */

function getGrowthOutlook(
  growth: number
): string {
  if (growth >= 7) {
    return "High-growth market";
  }

  if (growth >= 5) {
    return "Strong growth outlook";
  }

  if (growth >= 3) {
    return "Moderate growth outlook";
  }

  if (growth >= 1) {
    return "Stable growth outlook";
  }

  return "Slow-growth market";
}

/*
 * OPPORTUNITY LEVEL
 */

function getOpportunityLevel(
  opportunity: number
): string {
  if (opportunity >= 85) {
    return "Excellent Opportunity";
  }

  if (opportunity >= 75) {
    return "Strong Opportunity";
  }

  if (opportunity >= 65) {
    return "Moderate Opportunity";
  }

  if (opportunity >= 50) {
    return "Selective Opportunity";
  }

  return "Challenging Opportunity";
}

/*
 * MAIN MARKET INTELLIGENCE ENGINE
 */

export function calculateMarketIntelligence(
  inputs: MarketInputs
): MarketIntelligence {
  /*
   * Normalize country
   */

  const countryKey =
    normalizeCountry(
      inputs.country
    );

  /*
   * Select market profile
   */

  const profile =
    marketDatabase[countryKey] ||
    marketDatabase.india;

  /*
   * Base opportunity
   */

  let opportunity = 50;

  /*
   * Market fundamentals
   */

  opportunity +=
    calculateMarketSizeAdjustment(
      profile
    );

  opportunity +=
    calculateInternetAdjustment(
      profile,
      inputs.business
    );

  opportunity +=
    calculateDigitalAdjustment(
      profile,
      inputs.business
    );

  opportunity +=
    calculateGrowthAdjustment(
      profile
    );

  /*
   * Business-specific opportunity
   */

  opportunity +=
    calculateBusinessAdjustment(
      inputs.business
    );

  /*
   * Target-market opportunity
   */

  opportunity +=
    calculateMarketAdjustment(
      inputs.market
    );

  /*
   * Final score
   */

  opportunity =
    Math.round(
      clamp(
        opportunity
      )
    );

  /*
   * Growth outlook
   */

  const growthOutlook =
    getGrowthOutlook(
      profile.marketGrowth
    );

  /*
   * Opportunity level
   */

  const opportunityLevel =
    getOpportunityLevel(
      opportunity
    );

  /*
   * Return intelligence
   */

  return {
    country: inputs.country,

    population:
      profile.population,

    gdp:
      profile.gdp,

    internetPenetration:
      profile.internetPenetration,

    digitalAdoption:
      profile.digitalAdoption,

    marketGrowth:
      profile.marketGrowth,

    marketOpportunity:
      opportunity,

    marketSize:
      profile.marketSize,

    growthOutlook,

    opportunityLevel,
  };
}