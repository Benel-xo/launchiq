import { GoogleGenAI } from "@google/genai";

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        {
          success: false,
          error:
            "GEMINI_API_KEY is missing from .env.local",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const {
      business,
      country,
      market,
      investment,
      model,
      ventureScore,
      marketOpportunity,
      competitionPressure,
      overallRisk,
      monthlyRevenue,
      monthlyExpenses,
      runway,
    } = body;

    if (!business) {
      return Response.json(
        {
          success: false,
          error: "Business idea is required.",
        },
        { status: 400 }
      );
    }

    const prompt = `
You are LaunchIQ, an AI venture intelligence advisor.

Analyze the following startup opportunity and provide
a concise, practical founder assessment.

STARTUP

Business idea:
${business}

Country:
${country || "Not specified"}

Target market:
${market || "Not specified"}

Investment:
${investment || "Not specified"}

Business model:
${model || "Not specified"}


LAUNCHIQ ANALYSIS

Venture Score:
${ventureScore ?? "Not available"}

Market Opportunity:
${marketOpportunity ?? "Not available"}

Competitive Pressure:
${competitionPressure ?? "Not available"}

Overall Risk:
${overallRisk ?? "Not available"}

Estimated Monthly Revenue:
${monthlyRevenue ?? "Not available"}

Estimated Monthly Expenses:
${monthlyExpenses ?? "Not available"}

Estimated Runway:
${runway ?? "Not available"}


IMPORTANT

Be realistic.

Do not guarantee success.

Do not invent statistics.

Do not fabricate competitors.

Do not fabricate regulations.

Do not pretend that estimates are confirmed facts.

Clearly identify assumptions and uncertainty.

Focus on actionable founder advice.


FORMAT YOUR RESPONSE EXACTLY WITH THESE SECTIONS:

1. Executive Summary

Give a concise assessment of the opportunity.

2. Why This Could Work

Give the strongest reasons the venture could succeed.

3. Biggest Risks

Identify the most important risks or weaknesses.

4. Competitive Strategy

Explain how the startup should compete and differentiate.

5. Customer Strategy

Explain which customers to prioritize and how to approach them.

6. Business Model Strategy

Explain how the business model should be improved or tested.

7. Financial Advice

Comment on revenue, expenses, runway and financial discipline.

8. First 3 Actions

Give exactly three practical actions the founder should take next.

9. Final Recommendation

Give a clear recommendation:
Proceed, Proceed With Caution, or Reconsider.

Keep the entire response concise and useful.
Avoid unnecessary repetition.
`;

    const response = await gemini.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
    });

    const advice = response.text;

    if (!advice) {
      return Response.json(
        {
          success: false,
          error:
            "Gemini returned an empty advisor response.",
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      advice,
      model: "Gemini 3.5 Flash-Lite",
      engine: "Google Gemini 3.5 Flash-Lite",
    });
  } catch (error: any) {
    console.error(
      "LaunchIQ Gemini Advisor Error:",
      error
    );

    const errorMessage =
      error?.message ||
      error?.error?.message ||
      "Unknown Gemini API error.";

    return Response.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}