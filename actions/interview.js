"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

export async function generateQuiz() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) throw new Error("User not found!");
  try {
    const prompt = `
    Generate 10 technical interview questions for a ${
      user.industry
    } professional${
      user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
    }.
    
    Each question should be multiple choice with 4 options. The generated question should be from easy to medium level.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const text = response.text;
    const cleanedText = text
      .trim()
      .replace(/^```json/, "")
      .replace(/```$/, "");
    const data = JSON.parse(cleanedText);
    return data.questions;
  } catch (error) {
    console.log("Error Generating Quiz ");
    throw new Error("Failed to generate quiz questions " + error.messae);
  }
}

export async function saveQuizResult(questions, answers, score) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) throw new Error("User not found!");

  const questionResults = questions.map((item, idx) => ({
    question: item.question,
    answer: item.correctAnswer,
    userAnswer: answers[idx],
    isCorrect: item.correctAnswer === answers[idx],
    explanation: item.explanation,
  }));

  let improvementTip = null;
  const wrongAnswers = questionResults.filter((q) => !q.isCorrect);
  if (wrongAnswers.length > 0) {
    const wrongQuestionsText = wrongAnswers
      .map(
        (item) =>
          `Question: "${item.question}" \n Correct Answer: "${item.answer}" \nUser Answer: "${item.userAnswer}"`
      )
      .join("\n\n");

    const improvementPrompt = `
      The user got the following ${user.industry} technical interview questions wrong:

      ${wrongQuestionsText}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: improvementPrompt,
      });
      improvementTip = response.text;
    } catch (error) {
      console.log("Error Generating improvement tip", error.message);
    }
  }

  try {
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: questionResults,
        category: "Technical",
        improvementTip,
      },
    });
    return assessment;
  } catch (error) {
    console.log("Error saving quiz result! ", error.message);
    throw new Error("Failed to save quiz result");
  }
}

export async function getAssessment() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) throw new Error("User not found!");

  try {
    const assessments = await db.assessment.findMany({
        where: {
            userId: user.id
        },
        orderBy: {
            createdAt: "asc"
        }
    })
    return assessments
  } catch (error) {
    console.log('Error Fetching Assessments, ', error.message)
    throw new Error("Failed to fetch assessments.")
  }
}
