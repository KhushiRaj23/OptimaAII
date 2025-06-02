import {getAssessments } from '@/actions/interview'
import React from 'react'
import StatsCards from './_components/stats-cards'
import PerformanceChart from './_components/performance-chart'
import QuizList from './_components/quiz-list'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Add dynamic configuration
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const InterviewPage = async() => {
  const assessments=await getAssessments();
  console.log("Assessments for current user:", assessments);
  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex flex-col md:flex-row gap-2 items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">My Interviews</h1>
        <Link href="/interview/mock">
          <Button asChild>
            <div className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Start New Mock Interview
            </div>
          </Button>
        </Link>
      </div>
      <div>
        <h1 className='text-6xl font-bold gradient-title mb-5'>Interview Preparation</h1>

        <div className='space-y-6 '>
          <StatsCards assessments={assessments}/>
          <PerformanceChart assessments={assessments}/>
          <QuizList assessments={assessments}/>
        </div>
      </div>
    </div>
  )
}

export default InterviewPage