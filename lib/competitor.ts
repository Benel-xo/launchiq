export type Competitor = {
  name: string;
  category: string;
  pricing: string;
  strength: string;
  weakness: string;
  pressure: number;
};

export type CompetitorIntelligence = {
  competitors: Competitor[];
  competitionPressure: number;
  competitionLevel: string;
  competitiveOpportunity: number;
};

export type CompetitorInputs = {
  business: string;
  country: string;
  market: string;
};

/*
 * PROTOTYPE COMPETITOR DATABASE
 *
 * These are representative competitors/categories.
 * They are not live competitor data.
 */

const competitorDatabase: Record<string, Competitor[]> = {
  ai: [
    {
      name: "OpenAI",
      category: "AI Platform",
      pricing: "Freemium / Subscription",
      strength: "Strong AI capabilities and global brand recognition",
      weakness: "Broad positioning creates opportunities for specialized products",
      pressure: 85,
    },
    {
      name: "Google Gemini",
      category: "AI Platform",
      pricing: "Freemium / Subscription",
      strength: "Large technology ecosystem and infrastructure",
      weakness: "Broad product focus leaves room for niche solutions",
      pressure: 82,
    },
    {
      name: "Microsoft Copilot",
      category: "AI Productivity",
      pricing: "Subscription",
      strength: "Deep integration with Microsoft products",
      weakness: "Primarily optimized around the Microsoft ecosystem",
      pressure: 78,
    },
  ],

  healthcare: [
    {
      name: "Practo",
      category: "Digital Healthcare",
      pricing: "Commission / Service based",
      strength: "Established healthcare network and strong brand",
      weakness: "Broad healthcare positioning",
      pressure: 80,
    },
    {
      name: "Tata 1mg",
      category: "Digital Healthcare",
      pricing: "Transaction / Service based",
      strength: "Large healthcare ecosystem",
      weakness: "Broad customer positioning",
      pressure: 82,
    },
    {
      name: "Apollo 24|7",
      category: "Digital Healthcare",
      pricing: "Service based",
      strength: "Large healthcare network and institutional presence",
      weakness: "Broad market focus",
      pressure: 78,
    },
  ],

  food: [
    {
      name: "Swiggy",
      category: "Food Delivery",
      pricing: "Commission / Subscription",
      strength: "Large delivery network and customer base",
      weakness: "High delivery and operating costs",
      pressure: 90,
    },
    {
      name: "Zomato",
      category: "Food Delivery",
      pricing: "Commission / Subscription",
      strength: "Strong brand and restaurant network",
      weakness: "Highly competitive category",
      pressure: 90,
    },
    {
      name: "Uber Eats",
      category: "Food Delivery",
      pricing: "Commission",
      strength: "Large technology and delivery platform",
      weakness: "Less localized in some markets",
      pressure: 75,
    },
  ],

  ecommerce: [
    {
      name: "Amazon",
      category: "E-commerce",
      pricing: "Transaction / Subscription",
      strength: "Massive product selection and logistics network",
      weakness: "Difficult for smaller businesses to differentiate",
      pressure: 95,
    },
    {
      name: "Flipkart",
      category: "E-commerce",
      pricing: "Transaction",
      strength: "Strong Indian marketplace presence",
      weakness: "Highly competitive marketplace environment",
      pressure: 88,
    },
    {
      name: "Meesho",
      category: "Social Commerce",
      pricing: "Transaction",
      strength: "Strong value-focused proposition",
      weakness: "Heavy competition in price-sensitive segments",
      pressure: 80,
    },
  ],

  software: [
    {
      name: "Microsoft",
      category: "Enterprise Software",
      pricing: "Subscription",
      strength: "Huge enterprise ecosystem",
      weakness: "Products can be complex for smaller customers",
      pressure: 85,
    },
    {
      name: "Google",
      category: "Cloud / Software",
      pricing: "Subscription / Usage",
      strength: "Strong technology infrastructure",
      weakness: "Broad product portfolio",
      pressure: 80,
    },
    {
      name: "Salesforce",
      category: "Business Software",
      pricing: "Subscription",
      strength: "Strong enterprise relationships",
      weakness: "Higher complexity and cost for smaller businesses",
      pressure: 78,
    },
  ],

  banking: [
    {
      name: "HDFC Bank",
      category: "Banking",
      pricing: "Financial services",
      strength: "Large customer base and financial infrastructure",
      weakness: "Traditional banking structure",
      pressure: 88,
    },
    {
      name: "ICICI Bank",
      category: "Banking",
      pricing: "Financial services",
      strength: "Large digital banking ecosystem",
      weakness: "Broad customer positioning",
      pressure: 85,
    },
    {
      name: "PhonePe",
      category: "Fintech",
      pricing: "Transaction based",
      strength: "Large digital payments user base",
      weakness: "Highly competitive fintech environment",
      pressure: 90,
    },
  ],

  education: [
    {
      name: "Coursera",
      category: "Online Education",
      pricing: "Subscription / Course based",
      strength: "Large global learning platform",
      weakness: "Broad course marketplace",
      pressure: 78,
    },
    {
      name: "Udemy",
      category: "Online Education",
      pricing: "Course based",
      strength: "Large course catalog",
      weakness: "Highly fragmented content marketplace",
      pressure: 76,
    },
    {
      name: "BYJU'S",
      category: "EdTech",
      pricing: "Subscription",
      strength: "Strong historical brand awareness in education",
      weakness: "Complex operating model and competitive market",
      pressure: 72,
    },
  ],

  travel: [
    {
      name: "Booking.com",
      category: "Travel Marketplace",
      pricing: "Commission",
      strength: "Large global inventory and customer base",
      weakness: "Broad marketplace positioning",
      pressure: 88,
    },
    {
      name: "Expedia",
      category: "Travel Platform",
      pricing: "Commission / Transaction",
      strength: "Large travel ecosystem",
      weakness: "Strong competition across travel categories",
      pressure: 84,
    },
    {
      name: "Airbnb",
      category: "Travel Marketplace",
      pricing: "Commission",
      strength: "Strong global brand and unique inventory",
      weakness: "Regulatory and supply-side challenges",
      pressure: 86,
    },
  ],

  fitness: [
    {
      name: "Cult.fit",
      category: "Fitness Platform",
      pricing: "Subscription",
      strength: "Recognized fitness and wellness brand",
      weakness: "Requires significant operational infrastructure",
      pressure: 76,
    },
    {
      name: "Fitbit",
      category: "Fitness Technology",
      pricing: "Hardware / Subscription",
      strength: "Established fitness technology ecosystem",
      weakness: "Hardware and platform competition",
      pressure: 72,
    },
    {
      name: "Nike Training Club",
      category: "Fitness App",
      pricing: "Freemium",
      strength: "Strong global brand and fitness content",
      weakness: "Broad fitness positioning",
      pressure: 70,
    },
  ],

  logistics: [
    {
      name: "DHL",
      category: "Logistics",
      pricing: "Service based",
      strength: "Global logistics infrastructure",
      weakness: "Large-scale operating structure",
      pressure: 88,
    },
    {
      name: "FedEx",
      category: "Logistics",
      pricing: "Service based",
      strength: "Large logistics network",
      weakness: "High infrastructure requirements",
      pressure: 84,
    },
    {
      name: "Delhivery",
      category: "Logistics Technology",
      pricing: "Transaction / Service based",
      strength: "Strong Indian logistics network",
      weakness: "Capital-intensive operations",
      pressure: 82,
    },
  ],

  realestate: [
    {
      name: "Zillow",
      category: "Real Estate Platform",
      pricing: "Advertising / Services",
      strength: "Large property discovery platform",
      weakness: "Highly competitive property marketplace",
      pressure: 80,
    },
    {
      name: "Housing.com",
      category: "Real Estate Platform",
      pricing: "Advertising / Services",
      strength: "Strong Indian property marketplace",
      weakness: "Competitive online property category",
      pressure: 78,
    },
    {
      name: "MagicBricks",
      category: "Real Estate Platform",
      pricing: "Advertising / Services",
      strength: "Established Indian real estate platform",
      weakness: "Broad marketplace positioning",
      pressure: 80,
    },
  ],
};

/*
 * NORMALIZE TEXT
 */

function normalize(value: string): string {
  return value
    .toLowerCase()
    .trim();
}

/*
 * FIND THE MOST RELEVANT COMPETITOR CATEGORY
 */

function findCompetitorCategory(
  business: string
): string {
  const text = normalize(business);

  /*
   * More specific categories are checked first.
   */

  if (
    text.includes("health") ||
    text.includes("medical") ||
    text.includes("clinic") ||
    text.includes("doctor") ||
    text.includes("hospital") ||
    text.includes("medicine")
  ) {
    return "healthcare";
  }

  if (
    text.includes("restaurant") ||
    text.includes("food delivery") ||
    text.includes("meal delivery") ||
    text.includes("food")
  ) {
    return "food";
  }

  if (
    text.includes("ecommerce") ||
    text.includes("e-commerce") ||
    text.includes("online store") ||
    text.includes("online shopping")
  ) {
    return "ecommerce";
  }

  if (
    text.includes("bank") ||
    text.includes("banking") ||
    text.includes("fintech") ||
    text.includes("payment") ||
    text.includes("loan") ||
    text.includes("lending")
  ) {
    return "banking";
  }

  if (
    text.includes("education") ||
    text.includes("edtech") ||
    text.includes("learning") ||
    text.includes("course") ||
    text.includes("student")
  ) {
    return "education";
  }

  if (
    text.includes("travel") ||
    text.includes("hotel") ||
    text.includes("tourism") ||
    text.includes("booking")
  ) {
    return "travel";
  }

  if (
    text.includes("fitness") ||
    text.includes("gym") ||
    text.includes("workout") ||
    text.includes("wellness")
  ) {
    return "fitness";
  }

  if (
    text.includes("delivery") ||
    text.includes("logistics") ||
    text.includes("shipping") ||
    text.includes("courier")
  ) {
    return "logistics";
  }

  if (
    text.includes("real estate") ||
    text.includes("property") ||
    text.includes("housing") ||
    text.includes("realestate")
  ) {
    return "realestate";
  }

  if (
    text.includes("ai") ||
    text.includes("artificial intelligence") ||
    text.includes("machine learning") ||
    text.includes("generative ai")
  ) {
    return "ai";
  }

  if (
    text.includes("software") ||
    text.includes("saas") ||
    text.includes("platform") ||
    text.includes("app") ||
    text.includes("technology") ||
    text.includes("tech")
  ) {
    return "software";
  }

  return "software";
}

/*
 * ADJUST COMPETITION PRESSURE
 *
 * The base competitor pressure is adjusted using:
 *
 * - country
 * - target market
 * - business wording
 *
 * This keeps the prototype dynamic instead of returning
 * exactly the same competition score for every venture.
 */

function adjustCompetitionPressure(
  basePressure: number,
  business: string,
  country: string,
  market: string
): number {
  const businessText = normalize(business);
  const countryText = normalize(country);
  const marketText = normalize(market);

  let adjustment = 0;

  /*
   * Niche positioning can reduce direct competition.
   */

  if (
    marketText.includes("niche") ||
    marketText.includes("specialized") ||
    marketText.includes("specific") ||
    marketText.includes("local")
  ) {
    adjustment -= 8;
  }

  /*
   * Enterprise markets usually have fewer direct
   * competitors but longer sales cycles.
   */

  if (
    marketText.includes("enterprise") ||
    marketText.includes("b2b")
  ) {
    adjustment -= 4;
  }

  /*
   * Global markets generally increase competitive pressure.
   */

  if (
    marketText.includes("global") ||
    marketText.includes("international")
  ) {
    adjustment += 6;
  }

  /*
   * Large consumer markets can attract more competitors.
   */

  if (
    marketText.includes("consumer") ||
    marketText.includes("mass market")
  ) {
    adjustment += 5;
  }

  /*
   * Startup differentiation signals.
   */

  if (
    businessText.includes("local") ||
    businessText.includes("regional") ||
    businessText.includes("niche")
  ) {
    adjustment -= 6;
  }

  /*
   * India-specific marketplace pressure.
   */

  if (
    countryText.includes("india") ||
    countryText.includes("indian")
  ) {
    if (
      businessText.includes("ecommerce") ||
      businessText.includes("delivery") ||
      businessText.includes("food") ||
      businessText.includes("fintech")
    ) {
      adjustment += 4;
    }
  }

  /*
   * US/global software categories tend to have
   * strong incumbent competition.
   */

  if (
    countryText.includes("usa") ||
    countryText.includes("united states") ||
    countryText.includes("america")
  ) {
    if (
      businessText.includes("software") ||
      businessText.includes("saas") ||
      businessText.includes("ai")
    ) {
      adjustment += 4;
    }
  }

  return Math.max(
    20,
    Math.min(
      97,
      Math.round(
        basePressure + adjustment
      )
    )
  );
}

/*
 * CREATE DYNAMIC COMPETITOR DATA
 */

function buildCompetitors(
  competitors: Competitor[],
  business: string,
  country: string,
  market: string
): Competitor[] {
  return competitors.map(
    (competitor) => ({
      ...competitor,
      pressure:
        adjustCompetitionPressure(
          competitor.pressure,
          business,
          country,
          market
        ),
    })
  );
}

/*
 * CALCULATE COMPETITOR INTELLIGENCE
 */

export function calculateCompetitorIntelligence(
  inputs: CompetitorInputs
): CompetitorIntelligence {
  const category =
    findCompetitorCategory(
      inputs.business
    );

  const baseCompetitors =
    competitorDatabase[category] ||
    competitorDatabase.software;

  const competitors =
    buildCompetitors(
      baseCompetitors,
      inputs.business,
      inputs.country,
      inputs.market
    );

  /*
   * AVERAGE COMPETITIVE PRESSURE
   */

  const totalPressure =
    competitors.reduce(
      (sum, competitor) =>
        sum + competitor.pressure,
      0
    );

  const competitionPressure =
    Math.round(
      totalPressure /
        competitors.length
    );

  /*
   * COMPETITION LEVEL
   */

  let competitionLevel =
    "Low Competition";

  if (
    competitionPressure >= 85
  ) {
    competitionLevel =
      "Very High Competition";
  } else if (
    competitionPressure >= 75
  ) {
    competitionLevel =
      "High Competition";
  } else if (
    competitionPressure >= 60
  ) {
    competitionLevel =
      "Moderate Competition";
  }

  /*
   * COMPETITIVE OPPORTUNITY
   *
   * Lower competition pressure
   * creates more room for differentiation.
   */

  const competitiveOpportunity =
    Math.max(
      25,
      Math.min(
        95,
        100 - competitionPressure
      )
    );

  return {
    competitors,
    competitionPressure,
    competitionLevel,
    competitiveOpportunity,
  };
}