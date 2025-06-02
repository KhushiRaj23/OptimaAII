"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI= new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model=genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
})

export async function generateQuiz(){
    const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      industry: true,
      skills: true,
    },
  });

  if (!user) throw new Error("User not found");

  console.log("Generating quiz for user:", user);

  // Convert industry slug to human-readable for AI
  const industryHuman = user.industry
    ? user.industry.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : '';

  const prompt = `
    Generate 10 technical interview questions for a ${
      industryHuman
    } professional${
    user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
  }.
    
    Each question should be multiple choice with 4 options.
    
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

  console.log("Quiz prompt:", prompt);

  try{
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const quiz = JSON.parse(cleanedText);

  return quiz.questions;
}catch(error){
    console.error("Error generating quiz:" ,error);
    throw new Error("Failed to generate quiz questions");
    
}
}

export async function saveQuizResult(questions,answers,score) {
    const { userId } = await auth();
    console.log("Authenticated User ID:", userId);
    
    if (!userId) throw new Error("Unauthorized");
    
    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        select: {
            id:true,
          industry: true,
          skills: true,
        },
      });
    
      if (!user || !user.id) {
        console.error("User not found or missing ID:", user);
        throw new Error("User not found");
    }

    console.log("Saving assessment for user:", user);
    console.log("Assessment userId:", user.id);

      const questionResults=questions.map((q,index)=>({
        question:q.question,
        answer:q.correctAnswer,
        userAnswer:answers[index],
        isCorrect:q.correctAnswer === answers[index],
        explanation:q.explanation
       
      }));


     const wrongAnswers=questionResults.filter((q)=>!q.isCorrect);
      let improvementTip=null;

     if(wrongAnswers.length>0){
        const wrongQuestionsText=wrongAnswers.map(
            (q)=>
                 `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
        )
        .join("\n\n")

        // Convert industry slug to human-readable for AI
        const industryHuman = user.industry
          ? user.industry.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
          : '';

        const improvementPrompt = `
      The user got the following ${industryHuman} technical interview questions wrong:

      ${wrongQuestionsText}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `;


    try{
        const result=await model.generateContent(improvementPrompt);
        improvementTip = result?.response?.text().trim() || "";



    
    }catch(error){
        console.error("Error generating improvement Tip: ",error);
    }
    
    
     }

     try {
        const assessment=await db.assessment.create({
            data:{
                userId:user.id,
                quizScore:score,
                questions:questionResults,
                category:"Technical",
                improvementTip,
            }
        })


        return assessment;
        
     } catch (error) {
        console.error("Error saving quiz result: ",error);
        throw new Error("Failed to save quiz result");
        
     }


    
}

export async function getAssessments(){

    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
  
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        id: true,
        industry: true,
        skills: true,
      },
    });
  
    if (!user) throw new Error("User not found");


    try {
        const assessments= await db.assessment.findMany({
            where:{
                userId:user.id,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
        return assessments
    } catch (error) {
        console.error("Error fetching assessments: ", error);
        throw new Error("Failed to fetch assessments");
        
    }
}