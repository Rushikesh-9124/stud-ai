"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

export async function saveResume(content){
    const {userId} = await auth()
    if(!userId) throw new Error('Unauthorized!')

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        }
    })
    if(!user) throw new Error("User not found!");

    try {
        const resume = await db.resume.upsert({
            where: {
                userId: user.id
            },
            update: {
                content
            },
            create: {
                userId: user.id,
                content
            }
        })

        revalidatePath('/resume')
        return resume
    } catch (error) {
        console.log('Error saving resume ', error.message)
        throw new Error('Failed to save resume')
    }
}

export async function getResume() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
  
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
  
    if (!user) throw new Error("User not found");
  
    return await db.resume.findUnique({
      where: {
        userId: user.id,
      },
    });
  }

export async function improveWithAI({current, type, company, title}){
    const {userId} = await auth()
    if(!userId) throw new Error("Unauthorized")

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        },
        include: {
            industryInsight: true
        }
    })

    const prompt = `
    As an expert resume writer, improve the following ${type} description for a ${user.industry} professional where he/she worked as ${title} at ${company}.
    Make it more impactful, quantifiable, and aligned with industry standards.
    Current content: "${current}"

    Requirements:
    1. Use action verbs
    2. Include metrics and results where possible
    3. Highlight relevant technical skills
    4. Keep it concise but detailed
    5. Focus on achievements over responsibilities
    6. Use industry-specific keywords
    7. Must mention role and company/organization name.
    
    Format the response as a single paragraph without any additional text or explanations.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const improvedText = response.text.trim();
    return improvedText;
  } catch (error) {
    console.log("Error improving the content", error);
    throw new Error("Failed to improve content");
  }
}