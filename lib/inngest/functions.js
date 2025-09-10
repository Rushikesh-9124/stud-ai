import { db } from "../prisma";
import { inngest } from "./client";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure the GoogleGenerativeAI is instantiated correctly.
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateIndustryInsights = inngest.createFunction(
  { name: "Generate Industry Insights" },
  { cron: "0 0 * * 0" },
  async ({ step }) => {
    const industries = await step.run("Fetch Industries", async () => {
      return await db.industryInsight.findMany({
        select: { industry: true },
      });
    });

    for (const { industry } of industries) {
      const prompt = `
        Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
        {
          "salaryRanges": [
            { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
          ],
          "growthRate": number,
          "demandLevel": "HIGH" | "MEDIUM" | "LOW",
          "topSkills": ["skill1", "skill2"],
          "marketOutlook": "POSITIVE" | "NEGATIVE" | "NEUTRAL",
          "keyTrends": ["trend1", "trend2"],
          "recommendedSkills": ["skill1", "skill2"]
        }

        IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
        Include at least 5 common roles for salary ranges.
        For topSkills just write the skill names, no explanation.
        Growth rate should be a percentage.
        Include at least 5 skills and trends.
      `;

      const res = await step.run("Generate AI Content", async () => {
        const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
      
        const text = result.response.text();
        if (!text) {
          console.warn(`Gemini returned empty text for industry: ${industry}`);
          return "{}"; 
        }
        return text;
      });
      
      const cleanedText = res.replace(/```json|```/g, "").trim();
      let data;
      try {
        data = JSON.parse(cleanedText);
      } catch (err) {
        console.error(`Failed to parse Gemini response for ${industry}`);
        console.error("Raw text:", res);
        throw err;
      }      

      await step.run(`Update ${industry} insights`, async () => {
        await db.industryInsight.update({
          where: { industry },
          data: {
            ...data, 
            lastUpdated: new Date(),
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
      });
    }
  }
);