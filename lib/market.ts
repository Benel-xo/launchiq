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


export function calculateMarketIntelligence(
  inputs: MarketInputs
): MarketIntelligence {

  const countryKey =
    inputs.country
      .toLowerCase()
      .trim();

  const profile =
    marketDatabase[countryKey] ||
    marketDatabase["india"];


  /*
   * BASE MARKET OPPORTUNITY
   */

  let opportunity = 60;


  /*
   * INTERNET PENETRATION
   */

  if (
    profile.internetPenetration >= 90
  ) {
    opportunity += 10;
  } else if (
    profile.internetPenetration >= 70
  ) {
    opportunity += 7;
  } else if (
    profile.internetPenetration >= 50
  ) {
    opportunity += 4;
  }


  /*
   * DIGITAL ADOPTION
   */

  if (
    profile.digitalAdoption >= 90
  ) {
    opportunity += 10;
  } else if (
    profile.digitalAdoption >= 80
  ) {
    opportunity += 7;
  } else {
    opportunity += 4;
  }


  /*
   * MARKET GROWTH
   */

  if (
    profile.marketGrowth >= 7
  ) {
    opportunity += 10;
  } else if (
    profile.marketGrowth >= 4
  ) {
    opportunity += 7;
  } else if (
    profile.marketGrowth >= 2
  ) {
    opportunity += 4;
  }


  /*
   * BUSINESS CATEGORY
   */

  const business =
    inputs.business.toLowerCase();

  if (
    business.includes("ai") ||
    business.includes("software") ||
    business.includes("technology") ||
    business.includes("digital")
  ) {
    opportunity += 5;
  }


  opportunity = Math.min(
    95,
    opportunity
  );


  /*
   * GROWTH OUTLOOK
   */

  let growthOutlook = "";

  if (
    profile.marketGrowth >= 7
  ) {
    growthOutlook =
      "High-growth market";
  } else if (
    profile.marketGrowth >= 4
  ) {
    growthOutlook =
      "Strong growth outlook";
  } else if (
    profile.marketGrowth >= 2
  ) {
    growthOutlook =
      "Moderate growth outlook";
  } else {
    growthOutlook =
      "Slow-growth market";
  }


  /*
   * OPPORTUNITY LEVEL
   */

  let opportunityLevel = "";

  if (
    opportunity >= 85
  ) {
    opportunityLevel =
      "Excellent Opportunity";
  } else if (
    opportunity >= 75
  ) {
    opportunityLevel =
      "Strong Opportunity";
  } else if (
    opportunity >= 65
  ) {
    opportunityLevel =
      "Moderate Opportunity";
  } else {
    opportunityLevel =
      "Challenging Opportunity";
  }


  return {
    country: inputs.country,
    population: profile.population,
    gdp: profile.gdp,
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