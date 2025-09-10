"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const PerformanceChart = ({ assessments }) => {
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    if (assessments) {
      const formattedData = assessments.map((item, idx) => ({
        date: format(new Date(item.createdAt), "MMM dd"),
        score: item.quizScore,
      }));

      setChartData(formattedData);
    }
  }, [assessments]);
  return (
    <Card className={'rounded-xl rotating-shadow'}>
      <CardHeader>
        <CardTitle className={"gradient-title text-3xl lg:text-4xl"}>
          Performance Trend
        </CardTitle>
        <CardDescription className={"text-muted-foreground"}>
          Your quiz scores over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] ">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const point = payload[0].payload;
                    return (
                      <div className="bg-background border rounded-lg p-2 shadow-md">
                        <p className="text-sm font-medium">
                          Score: {point.score}%
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {point.date}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgb(255,0,0)" /> 
                  <stop offset="100%" stopColor="rgb(0,0,255)" /> 
                </linearGradient>
              </defs>
              <Line
                type="monotone"
                dataKey="score"
                stroke="url(#lineGradient)"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
