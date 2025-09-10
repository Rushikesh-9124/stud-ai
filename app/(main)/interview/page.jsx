import { getAssessment } from "@/actions/interview";
import React from "react";
import StatsCard from "./_components/StatsCard";
import PerformanceChart from "./_components/PerformanceChart";
import QuizList from "./_components/QuizList";

const InterviewPage = async() => {
  const assessments = await getAssessment()
  return (
    <div>
      <div className="">
        <h1 className="text-6xl gradient-title font-bold mb-5">
          Interview Preparation
        </h1>
        <div className="flex flex-col space-y-6">
          <StatsCard assessments={assessments}/>
          <PerformanceChart assessments={assessments}/>
          <QuizList assessments={assessments}/>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
