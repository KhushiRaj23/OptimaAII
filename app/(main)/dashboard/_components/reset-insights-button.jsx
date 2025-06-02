"use client";

import { resetIndustryInsights } from '@/actions/dashboard';
import { Button } from '@/components/ui/button'; // Assuming you have a Button component

const ResetInsightsButton = () => {
  const handleReset = async () => {
    try {
      await resetIndustryInsights();
      // Optional: Redirect or refresh the page after reset
      window.location.reload();
    } catch (error) {
      console.error("Error resetting insights:", error);
      alert("Failed to reset insights: " + error.message);
    }
  };

  return (
    <Button onClick={handleReset} className="mb-4">Reset Insights</Button>
  );
};

export default ResetInsightsButton; 