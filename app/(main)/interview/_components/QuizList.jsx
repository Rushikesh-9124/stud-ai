"use client";
import React, { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import QuizResult from "./QuizResult";

const QuizList = ({ assessments }) => {
  const router = useRouter();
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  return (
    <>
      <Card>
        <CardHeader className={"flex flex-row items-center justify-between"}>
          <div className="">
            <CardTitle
              className={"font-bold gradient-title text-3xl md:text-4xl"}
            >
              Recent Quizzes
            </CardTitle>
            <CardDescription>
              Review your past quiz performances.
            </CardDescription>
          </div>
          <Button onClick={() => router.push("/interview/mock")}>
            Start New Quiz
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assessments.map((item, idx) => (
              <Card
                key={idx}
                className={
                  "cursor-pointer hover:bg-muted/50 hover:scale-102 transition-all duration-300 "
                }
                onClick={() => setSelectedQuiz(item)}
              >
                <CardHeader>
                  <CardTitle>Quiz {idx + 1}</CardTitle>
                  <CardDescription className={"flex justify-between w-full"}>
                    <div className="">score: {item.quizScore.toFixed(1)}%</div>
                    <div className="">
                      {format(new Date(item.createdAt), "MMMM dd, yyyy HH:mm")}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {item.improvementTip}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/*  dialog */}
      <Dialog  open={!!selectedQuiz} onOpenChange={()=>setSelectedQuiz(null)}>
        <DialogContent className='overflow-auto  md:min-w-3xl max-h-[90vh] '>
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <QuizResult hideStartNew result={selectedQuiz} onStartNew={()=>router.push('/interview/mock')}/>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuizList;
