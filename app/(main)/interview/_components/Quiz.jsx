"use client";
import { generateQuiz, saveQuizResult } from "@/actions/interview";
import useFetch from "@/hooks/use-fetch";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarLoader } from "react-spinners";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import QuizResult from "./QuizResult";

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);


  const {
    loading: generatingQuiz,
    fn: generateQuizFn,
    data: quizData,
  } = useFetch(generateQuiz);

  const {
    loading: savingQuiz,
    fn: saveQuizResultFn,
    data: resultData,
    setData: setResultData,
  } = useFetch(saveQuizResult);
  useEffect(() => {
    if (quizData) {
      setAnswers(new Array(quizData.length).fill(null));
    }
  }, [quizData]);

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((item, idx) => {
      if (item === quizData[idx].correctAnswer) {
        correct++;
      }
    });

    return (correct / quizData.length) * 100;
  };

  const finishQuiz = async () => {
    const score = calculateScore();
    try {
      await saveQuizResultFn(quizData, answers, score);
      toast.success("Quiz Completed!");
    } catch (error) {
      toast.error(error.message || "Failed to save quiz resut.");
    }
  };

  if (generatingQuiz) {
    return <BarLoader className="mt-4 " width={"100%"} color="gray" />;
  }

  const startNewQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowExplanation(false);
    generateQuizFn(), setResultData();
  };

  if (resultData) {
    return (
      <div className="mx-2">
        <QuizResult result={resultData} onStartNew={startNewQuiz} />
      </div>
    );
  }

  if (!quizData) {
    return (
      <Card className={"mx-2 "}>
        <CardHeader>
          <CardTitle>Reacy to test your knowledge?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This quiz contains 10 questions specific to your industry and
            skills. Take your time and choose the best answer for each question.
          </p>
        </CardContent>
        <CardFooter>
          <Button className={"w-full"} onClick={generateQuizFn}>
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const question = quizData[currentQuestion];
  return (
    <Card className={"mx-2 "}>
      <CardHeader>
        <CardTitle>
          Question {currentQuestion + 1} of {quizData.length}
        </CardTitle>
      </CardHeader>
      <CardContent className={"space-y-4"}>
        <p className="text-lg font-medium mb-4">{question.question}</p>
        <RadioGroup
          onValueChange={handleAnswer}
          value={answers[currentQuestion]}
        >
          {question.options.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <RadioGroupItem value={item} id={`option-${idx}`} />
              <Label htmlFor={`option-${idx}`}>{item}</Label>
            </div>
          ))}
        </RadioGroup>
        {showExplanation && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="font-medium">Explanation</p>
            <p className="text-muted-foreground">{question.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {!showExplanation && (
          <Button
            disabled={!answers[currentQuestion]}
            onClick={()=>setShowExplanation(true)}
            variant={"outline"}
          >
            Show Explanation
          </Button>
        )}

        <Button
          disabled={!answers[currentQuestion] || savingQuiz}
          onClick={handleNext}
          className={"ml-auto flex items-center justify-center "}
        >
          {savingQuiz ? (
            <Loader2
              className="mt-4 animate-spin"
              color="gray"
              width={"100%"}
            />
          ) : (currentQuestion < quizData.length - 1 
            ? "Next Question"
            : "Finish Quiz")}
          
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Quiz;
