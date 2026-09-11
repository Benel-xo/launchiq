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
          error: "GEMINI_API_KEY is missing from .env.local",
        },
        { status: 500 }
      );
    }

    const body = await request.json();

    const {
      business,
      country,
      industry,
      market,
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
You are LaunchIQ's Market Intelligence Research Engine.

Analyze this startup opportunity and provide practical,
structured market intelligence for a founder.

STARTUP INFORMATION

Business idea:
${business}

Country:
${country || "Not specified"}

Industry:
${industry || "Not specified"}

Target market:
${market || "Not specified"}


IMPORTANT

Be realistic.

Do not guarantee success.

Do not invent statistics.

Do not fabricate companies.

Do not fabricate regulations.

Do not invent market sizes.

Clearly distinguish assumptions from established facts.

If exact current information is unavailable, say so.

Focus on practical startup intelligence.


FIRST, PROVIDE AN INTELLIGENCE SNAPSHOT.

Return exactly:

MARKET OPPORTUNITY SCORE: [0-100]

DEMAND STRENGTH SCORE: [0-100]

COMPETITIVE PRESSURE SCORE: [0-100]

MARKET RISK SCORE: [0-100]

CUSTOMER OPPORTUNITY SCORE: [0-100]


Then provide:

KEY MARKET INSIGHT:

Write one concise paragraph explaining the most important
market insight for this startup.


THEN PROVIDE THESE EXACTLY NUMBERED SECTIONS:

1. Market Overview

Explain the market this startup is entering.

2. Market Demand

Explain why customers may want this product or service.

3. Growth Drivers

Identify the major factors that could drive growth.

4. Customer Opportunity

Describe the most promising customer segments.

5. Market Challenges

Explain important barriers and uncertainties.

6. Competitive Landscape

Describe the types of competitors this startup may face.

Do not invent specific competitors.

7. Differentiation Opportunities

Explain how a new startup could differentiate itself.

8. Regulatory Considerations

Mention relevant regulatory considerations when applicable.

9. Investment Perspective

Explain why investors might find the opportunity attractive
or unattractive.

10. Research Conclusion

Give a clear conclusion and the most important next action
for the founder.


OUTPUT RULES

- Keep the report concise.
- Avoid repetition.
- Use plain text headings.
- Do not put the five scores inside the numbered sections.
- Do not guarantee success.
- Clearly communicate uncertainty.
- Prefer practical insights.
`;

    const response = await gemini.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
    });

    const research = response.text;

    if (!research) {
      return Response.json(
        {
          success: false,
          error: "Gemini returned an empty research report.",
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      research,
      model: "Gemini 3.5 Flash-Lite",
      engine: "Google Gemini 3.5 Flash-Lite",
      webResearch: false,
    });
  } catch (error: any) {
    console.error("LaunchIQ Gemini Research Error:", error);

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