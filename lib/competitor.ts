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
 */

const competitorDatabase: Record<
  string,
  Competitor[]
> = {

  ai: [
    {
      name: "OpenAI",
      category: "AI Platform",
      pricing: "Freemium / Subscription",
      strength: "Strong AI capabilities and brand recognition",
      weakness: "Highly competitive and broad product positioning",
      pressure: 85,
    },

    {
      name: "Google Gemini",
      category: "AI Platform",
      pricing: "Freemium / Subscription",
      strength: "Large ecosystem and strong technology infrastructure",
      weakness: "Broad product focus creates opportunities for specialization",
      pressure: 80,
    },

    {
      name: "Microsoft Copilot",
      category: "AI Productivity",
      pricing: "Subscription",
      strength: "Deep integration with Microsoft products",
      weakness: "Primarily focused on existing enterprise ecosystem",
      pressure: 75,
    },
  ],


  healthcare: [
    {
      name: "Practo",
      category: "Digital Healthcare",
      pricing: "Commission / Service based",
      strength: "Large healthcare network and established brand",
      weakness: "Broad healthcare marketplace positioning",
      pressure: 80,
    },

    {
      name: "Tata 1mg",
      category: "Digital Healthcare",
      pricing: "Transaction / Service based",
      strength: "Strong healthcare ecosystem and brand",
      weakness: "Broad customer base rather than a narrow niche",
      pressure: 82,
    },

    {
      name: "Apollo 24|7",
      category: "Digital Healthcare",
      pricing: "Service based",
      strength: "Large hospital and healthcare network",
      weakness: "Large organization with broad market focus",
      pressure: 78,
    },
  ],


  food: [
    {
      name: "Swiggy",
      category: "Food Delivery",
      pricing: "Commission / Subscription",
      strength: "Large delivery network and customer base",
      weakness: "High operating and delivery costs",
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
      strength: "Large international technology platform",
      weakness: "Less localized than some regional competitors",
      pressure: 75,
    },
  ],


  ecommerce: [
    {
      name: "Amazon",
      category: "E-commerce",
      pricing: "Transaction / Subscription",
      strength: "Massive product selection and logistics network",
      weakness: "Difficult for small sellers to differentiate",
      pressure: 95,
    },

    {
      name: "Flipkart",
      category: "E-commerce",
      pricing: "Transaction",
      strength: "Strong presence in the Indian market",
      weakness: "Highly competitive marketplace environment",
      pressure: 88,
    },

    {
      name: "Meesho",
      category: "Social Commerce",
      pricing: "Transaction",
      strength: "Strong value-focused customer proposition",
      weakness: "Strong competition in price-sensitive segments",
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
      strength: "Strong enterprise customer relationships",
      weakness: "Higher complexity and cost for small businesses",
      pressure: 78,
    },
  ],


  banking: [
    {
      name: "HDFC Bank",
      category: "Banking",
      pricing: "Financial services",
      strength: "Large customer base and strong financial infrastructure",
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
      weakness: "Highly competitive fintech market",
      pressure: 90,
    },
  ],

};


/*
 * FIND THE MOST RELEVANT COMPETITOR CATEGORY
 */

function findCompetitors(
  business: string
): Competitor[] {

  const text =
    business.toLowerCase();


  if (
    text.includes("health") ||
    text.includes("medical") ||
    text.includes("clinic") ||
    text.includes("doctor")
  ) {
    return competitorDatabase.healthcare;
  }


  if (
    text.includes("food") ||
    text.includes("restaurant") ||
    text.includes("delivery")
  ) {
    return competitorDatabase.food;
  }


  if (
    text.includes("ecommerce") ||
    text.includes("e-commerce") ||
    text.includes("online store") ||
    text.includes("marketplace")
  ) {
    return competitorDatabase.ecommerce;
  }


  if (
    text.includes("bank") ||
    text.includes("fintech") ||
    text.includes("payment")
  ) {
    return competitorDatabase.banking;
  }


  if (
    text.includes("ai") ||
    text.includes("artificial intelligence")
  ) {
    return competitorDatabase.ai;
  }


  if (
    text.includes("software") ||
    text.includes("saas") ||
    text.includes("platform") ||
    text.includes("app")
  ) {
    return competitorDatabase.software;
  }


  return competitorDatabase.software;
}


/*
 * CALCULATE COMPETITOR INTELLIGENCE
 */

export function calculateCompetitorIntelligence(
  inputs: CompetitorInputs
): CompetitorIntelligence {

  const competitors =
    findCompetitors(
      inputs.business
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

  let competitionLevel = "";


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

  } else {

    competitionLevel =
      "Low Competition";
  }


  /*
   * COMPETITIVE OPPORTUNITY
   *
   * Lower competition pressure
   * means greater opportunity.
   */

  const competitiveOpportunity =
    Math.max(
      35,
      100 - competitionPressure
    );


  return {
    competitors,
    competitionPressure,
    competitionLevel,
    competitiveOpportunity,
  };
}