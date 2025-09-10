"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

export const generateAIInsights = async(industry) => {
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
          For topSkills just write the skill names no explanation like using brackets.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      const Text = response.text
      const cleanedText = Text.trim().replace(/^```json/, "").replace(/```$/, "");
      const data = JSON.parse(cleanedText)
      return data
}

export async function getIndustryInsights(){
    const {userId} = await auth()
    if(!userId){
        throw new Error('Unauthorized')
    }
    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        },
        include: {
            industryInsight: true
        }
    })
    if(!user) throw new Error("User not found!")
    if(!user.industryInsight){
        const insights = await generateAIInsights(user.industry)
        const industryInsight = await db.industryInsight.create({
            data: {
                industry: user.industry,
                ...insights,
                nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        })
        return industryInsight
    }
    return user.industryInsight
}