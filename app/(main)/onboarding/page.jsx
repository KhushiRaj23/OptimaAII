import { getUserOnboardingStatus } from '@/actions/user'
import { redirect } from 'next/navigation';
import React from 'react'
import OnboardingForm from './_components/onboarding-form';
import { industries } from '@/data/industries';

// Add dynamic configuration
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const OnboardingPage = async () => {
  const {isOnboarded}=await getUserOnboardingStatus();

  if(isOnboarded){
    redirect("/dashboard");
  }
  return (
    <main>
      <OnboardingForm industries ={industries} />
    </main>
  )
}

export default OnboardingPage