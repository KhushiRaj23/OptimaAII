"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { generateAIsights } from "./dashboard";


export const updateUser=async (data)=>{
    try {
        const { userId } = await auth();
        if (!userId) return { success: false, error: "Unauthorized: No user ID found." };

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) return { success: false, error: "User not found in database." };

        console.log("Received Data in updateUser:", data);

        if (!data || typeof data !== "object" || !data.industry) {
            return { success: false, error: "Industry field is missing or invalid." };
        }

        // Validate required fields
        const formattedData = {
            industry: data.industry, // this is the slug
            experience: data.experience || 0, // Default experience if not provided
            skills: Array.isArray(data.skills) 
                ? data.skills.filter((skill) => typeof skill === "string") 
                : [],
            bio: data.bio || "", // Ensure bio is a string
        };

        // 1. Ensure IndustryInsight exists BEFORE updating user
        let industryInsight = await db.industryInsight.findUnique({
            where: { industry: formattedData.industry },
        });

        let industryInsightCreationError = null;
        if (!industryInsight) {
            try {
                // Convert slug to human-readable for AI
                const industryHuman = data.industry
                  .split('-')
                  .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(' ');
                const insights = await generateAIsights(industryHuman);
                await db.industryInsight.create({
                    data: {
                        industry: formattedData.industry,
                        ...insights,
                        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    },
                });
            } catch (error) {
                console.error("⚠️ AI insights generation failed:", error.message);
                // Fallback: Try with the main industry only
                const mainIndustry = data.industry.split('-')[0];
                const mainIndustryHuman = mainIndustry.charAt(0).toUpperCase() + mainIndustry.slice(1);
                try {
                    const fallbackInsights = await generateAIsights(mainIndustryHuman);
                    await db.industryInsight.create({
                        data: {
                            industry: formattedData.industry,
                            ...fallbackInsights,
                            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                        },
                    });
                } catch (fallbackError) {
                    console.error("⚠️ Fallback AI insights generation failed:", fallbackError.message);
                    industryInsightCreationError = error.message + ' | Fallback: ' + fallbackError.message;
                }
            }
        }

        // **Extra read to ensure visibility**
        industryInsight = await db.industryInsight.findUnique({
            where: { industry: formattedData.industry },
        });

        // Hardcoded fallback if both AI and fallback fail
        if (!industryInsight) {
            await db.industryInsight.create({
                data: {
                    industry: formattedData.industry,
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
                where: { industry: formattedData.industry },
            });
            if (!industryInsight) {
                return { success: false, error: "IndustryInsight creation failed: AI and hardcoded fallback both failed." };
            }
        }

        // 2. Now update the user
        console.log("Updating user industry to:", formattedData.industry);
        const result = await db.user.update({
            where: { id: user.id },
            data: formattedData,
        });
        console.log("User update result:", result);

        return { success: true, result:result};
    } catch (error) {
        console.error("Error updating user and industry:", error.message);
        return { success: false, error: error.message };
    }
};


export async function getUserOnboardingStatus(){
    



    try{
        const {userId}=await auth();
        if(!userId) throw new Error("Unauthorized");
        
        const user=await db.user.findUnique({
            where: {
                clerkUserId: userId,
            },
            select: {
                industry:true,
            },
        });
        return {
            isOnboarded: !!user?.industry,
        };

    }catch(error){
        console.error("Error checking onboarding status: ",error.message);
        throw new Error("Failed to check onboarding status"+error.message);
        
    }

}