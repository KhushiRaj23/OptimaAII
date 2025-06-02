"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI= new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log("✅ Loaded Gemini API Key:", process.env.GEMINI_API_KEY);

const model=genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
})
export const generateAIsights=async (industry)=>{
    if (!industry || typeof industry !== "string" || industry.trim() === "") {
        throw new Error("Please select a valid industry before generating insights.");
      }
      
      const prompt = `
  Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
  {
    "salaryRanges": [
      { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
    ],
    "growthRate": number,
    "demandLevel": "High" | "Medium" | "Low",
    "topSkills": ["skill1", "skill2"],
    "marketOutlook": "Positive" | "Neutral" | "Negative",
    "keyTrends": ["trend1", "trend2"],
    "recommendedSkills": ["skill1", "skill2"]
  }

  IMPORTANT:
  - Populate the JSON fields with realistic values specific to the "${industry}" industry.
  - Include at least 5 job roles in "salaryRanges" with realistic salary numbers and locations.
  - "growthRate" must be a percentage between 0 and 20.
  - Fill in at least 5 "topSkills" and 5 "keyTrends".
  - "recommendedSkills" should align with the current job market.
  - Return ONLY the JSON object. Do NOT include markdown or explanations.
`;

      

        console.log("Prompt sent to Gemini:\n", prompt);

        const result=await model.generateContent(prompt);

        const responseText= result?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        console.log("🔍 Raw Gemini Output:", responseText);

        if (!responseText || responseText.trim() === "") {
            throw new Error("Gemini AI returned an empty or invalid response.");
        }

        // Improved JSON extraction
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            console.error("Could not find JSON object in AI response:", responseText);
            throw new Error("AI response did not contain a valid JSON object.");
        }

        const jsonString = jsonMatch[0]
        console.log("Attempting to parse JSON string:", jsonString);

        // Original cleaning (might still be useful, but less critical with extraction)
        const cleanedJsonString = jsonString
        .replace(/,\s*}/g, "}")
        .replace(/,\s*]/g, "]");


        try {
            return JSON.parse(cleanedJsonString);
        } catch (error) {
            console.error("Error parsing AI-generated JSON:", cleanedJsonString);
            throw new Error("Invalid JSON format received from AI.");
        }


    };
export async function getIndustryInsights(){
     const {userId}=await auth();
        if(!userId) throw new Error("Unauthorized");
    
        const user=await db.user.findUnique({
            where: {
                clerkUserId: userId,
            },
            select: {
                id: true,
                industry: true,
            },
        });
    
        if(!user) throw new Error("User not found");
        if(!user.industry) throw new Error("User industry is missing. Please complete onboarding.");

        let industryInsight = await db.industryInsight.findUnique({
            where: { industry: user.industry },
        });

        if(!industryInsight){
            let industryInsightCreationError = null;
            try{
                // Convert slug to human-readable for AI
                const industryHuman = user.industry
                  .split('-')
                  .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(' ');
                const insights= await generateAIsights(industryHuman);

                await db.industryInsight.create({
                    data:{
                        industry:user.industry,
                        ...insights,
                        nextUpdate: new Date(Date.now()+7*24*60*60*1000),
                    }
                });
            }catch(error){
                console.error("⚠️ AI insights generation failed from getIndustryInsights:", error.message);
                // Fallback: Try with the main industry only
                const mainIndustry = user.industry.split('-')[0];
                const mainIndustryHuman = mainIndustry.charAt(0).toUpperCase() + mainIndustry.slice(1);
                try {
                  const fallbackInsights = await generateAIsights(mainIndustryHuman);
                  await db.industryInsight.create({
                    data: {
                      industry: user.industry,
                      ...fallbackInsights,
                      nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    },
                  });
                } catch (fallbackError) {
                  console.error("⚠️ Fallback AI insights generation failed from getIndustryInsights:", fallbackError.message);
                  industryInsightCreationError = error.message + ' | Fallback: ' + fallbackError.message;
                }
            }

            // Ensure visibility after creation/fallback
            industryInsight = await db.industryInsight.findUnique({
                where: { industry: user.industry },
            });

            // Hardcoded fallback if all AI attempts failed
            if (!industryInsight) {
                await db.industryInsight.create({
                  data: {
                    industry: user.industry,
                    salaryRanges: [],
                    growthRate: 0,
                    demandLevel: "Medium",
                    topSkills: [],
                    marketOutlook: "Neutral",
                    keyTrends: [],
                    recommendedSkills: [],
                    nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                  },
                });
                industryInsight = await db.industryInsight.findUnique({
                  where: { industry: user.industry },
                });
                 if (!industryInsight) {
                   throw new Error("IndustryInsight creation failed even after hardcoded fallback: " + (industryInsightCreationError || "Unknown error"));
                 }
            }
           return industryInsight; 
        }
        return industryInsight;
}

export async function resetIndustryInsights() {
    "use server";

    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId,
        },
        select: {
            industry: true,
        },
    });

    if (!user || !user.industry) {
        console.warn("User or user industry not found for reset.");
        // Optionally throw an error or return a status
         throw new Error("Could not reset insights: User or industry not found.");
    }

    try {
        // Attempt to delete the industry insight for the user's industry
        const deletedInsight = await db.industryInsight.delete({
            where: {
                industry: user.industry,
            },
        });
        console.log(`✅ Successfully deleted industry insight for industry: ${user.industry}`, deletedInsight);
        return { success: true, industry: user.industry };
    } catch (error) {
        // Handle the case where the record doesn't exist (P2025)
        if (error.code === 'P2025') {
            console.log(`ℹ️ No industry insight found for deletion for industry: ${user.industry}`);
             return { success: false, industry: user.industry, message: "No existing insights to reset." };
        } else {
            console.error("❌ Failed to delete industry insight:", error);
            throw new Error("Failed to reset insights due to a database error.");
        }
    }
}

