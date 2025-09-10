import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Trophy } from 'lucide-react';
import React from 'react'

const StatsCard = ({assessments}) => {

  const getAverage = () => {
    if(!assessments.length) return 0;
    const total = assessments.reduce((sum, assessment) => sum + assessment.quizScore, 0)
    return (total/ assessments.length ).toFixed(1);
  }

  const getLatestAssessment = () => {
    if(!assessments.length) return null;
    const lastAssessment = assessments.length -1
    return assessments[lastAssessment]
  }

  const getTotalQuestions = () => {
    if(!assessments.length) return 0;
    return assessments.reduce((sum, assessment)=> sum + assessment.questions.length, 0)
  }
  return (
    <div className='grid gap-4  md:grid-cols-3'>
      <Card className={"gap-2 drop-shadow-[0_2px_4px_rgba(255,255,255,0.2)]"}>
          <CardHeader
            className={"flex flex-row  items-center justify-between space-y-0 "}
          >
            <CardTitle className={"text-sm font-medium"}>
              Average Score
            </CardTitle>
            <Trophy className={`h-4 w-4 text-muted-foreground`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getAverage()}%</div>
            <p className="text-xs text-muted-foreground">Across all assessments</p>
          </CardContent>
        </Card>

        <Card className={"gap-2 drop-shadow-[0_2px_4px_rgba(255,255,255,0.2)]"}>
          <CardHeader
            className={"flex flex-row  items-center justify-between space-y-0 "}
          >
            <CardTitle className={"text-sm font-medium"}>
              Questions Practiced
            </CardTitle>
            <Brain className={`h-4 w-4 text-muted-foreground`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalQuestions()}</div>
            <p className="text-xs text-muted-foreground">Across all assessments</p>
          </CardContent>
        </Card>

        <Card className={"gap-2 drop-shadow-[0_2px_4px_rgba(255,255,255,0.2)]"}>
          <CardHeader
            className={"flex flex-row  items-center justify-between space-y-0 "}
          >
            <CardTitle className={"text-sm font-medium"}>
              Latest Score
            </CardTitle>
            <Trophy className={`h-4 w-4 text-muted-foreground`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getLatestAssessment()?.quizScore.toFixed(1) || 0}%</div>
            <p className="text-xs text-muted-foreground">Most recent quiz</p>
          </CardContent>
        </Card>
    </div>
  )
}

export default StatsCard
