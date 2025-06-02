"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import QuizResult from "./quiz-result";

const QuizList = ({assessments}) => {

  const router = useRouter()
  const [selectedquiz,setSelectedQuiz]=useState(null);

  return (
    <>
    <Card>
    <CardHeader>
          <div className="flex flex-rows items-center justify-between">
            <div>
              <CardTitle className="gradient-title text-3xl md:text-4xl">
                Recent Quizzes
              </CardTitle>
              <CardDescription>
                Review your past quiz performance
              </CardDescription>
            </div>
            <Button onClick={() => router.push("/interview/mock")}>
              Start New Quiz
            </Button>
          </div>
        </CardHeader>
  <CardContent>
    <div className="space-y-4">
    {assessments.map((assessment,i)=>{
        return (
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors" key={assessment.id}
            onClick={()=>setSelectedQuiz(assessment)}
          >
  <CardHeader>
    <CardTitle> Quiz {i + 1}</CardTitle>
    <CardDescription className="flex justify-between w-full">
      <div>
        Score: {assessment.quizScore.toFixed(1)}%
      </div>
      {format(
        new Date(assessment.createdAt),
        "MMMM dd, yyyy HH:mm"
      )}
    </CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-muted-foreground"> {assessment.improvementTip ? assessment.improvementTip : "No improvement tip available."}</p>
  </CardContent>
</Card>

        )
    })}
    </div>
  </CardContent>
  
</Card>

{/* dialog  */}
<Dialog open={!!selectedquiz} onOpenChange={()=> setSelectedQuiz(null)}>
  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle></DialogTitle>
    </DialogHeader>
    <QuizResult
      result={selectedquiz}
      onStartNew={()=>router.push("/interview/mock")}
      hideStartNew
    />
  </DialogContent>
</Dialog>

</>

  )
}

export default QuizList