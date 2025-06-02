import { getIndustryInsights } from '@/actions/dashboard';
import { getUserOnboardingStatus } from '@/actions/user';
import { redirect } from 'next/navigation';
import React from 'react'
import DashboardView from './_components/dashboard-view';
import ResetInsightsButton from './_components/reset-insights-button';

// Add dynamic configuration
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const IndustryInsightsPage = async () => {
  const {isOnboarded} = await getUserOnboardingStatus();

  if(!isOnboarded){
    redirect("/onboarding");
  }

  const insights = await getIndustryInsights();
  
  return (
    <div className='container mx-auto'>
      <ResetInsightsButton />
      <DashboardView insights={insights}/>
    </div>
  )
}

export default IndustryInsightsPage