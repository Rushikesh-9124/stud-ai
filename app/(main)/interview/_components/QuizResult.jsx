import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Trophy, XCircle } from "lucide-react";
import React from "react";

const QuizResult = ({ result, hideStartNew = false, onStartNew }) => {
  if (!result) return null;
  return (
    <div className="mx-auto space-y-6">
      <h1 className="flex items-center gap-2 text-3xl gradient-title">
        <Trophy className="h-6 w-6 text-yellow-500" /> Quiz Result
      </h1>

      <CardContent>
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold">
            {result.quizScore.toFixed(1)}%
          </h3>
          <Progress value={result.quizScore} className={'w-full'}/>
        {
            result?.improvementTip && (
                <div className="bg-muted p-4 rounded-lg">
                    <p className="font-medium">Improvement Tip:</p>
                    <p className="text-sm text-muted-foreground">{result?.improvementTip }</p>
                </div>
            )
        }
        </div>

        <div className="space-y-4">
            <h3 className="font-medium mt-3">Question Review</h3>
            {
                result.questions.map((item, idx)=>(
                    <div key={idx} className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                            <p className="">{item.question}</p>
                            {
                                item.isCorrect ? 
                                <CheckCircle2  className="h-5 w-5 text-green-500 flex-shirink-0"/> :
                                <XCircle className="h-5 w-5 text-red-500 flex-shirink-0" />
                            }
                        </div>
                        <div className="text-sm text-muted-foreground">
                            <p className="">Your answer: {item.userAnswer}</p>
                            {
                                !item.isCorrect && <p className="">Correct answer: {item.answer}</p>
                            }
                        </div>

                        <div className="text-sm text-muted-foreground p-2 rounded">
                            <p className="font-medium">Explanation: </p>
                            <p className="">{item.explanation}</p>
                        </div>
                    </div>
                ))
            }
        </div>
      </CardContent>

      {
        !hideStartNew && (
            <CardFooter>
                <Button onClick={onStartNew} className={'w-full'}>
                    Start New Quiz
                </Button>
            </CardFooter>
        )
      }
    </div>
  );
};

export default QuizResult;
