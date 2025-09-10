"use client";
import {
  Brain,
  BriefcaseIcon,
  LineChart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import React from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DashboardView = ({ insights }) => {
  const salaryData = insights.salaryRanges.map((item, idx) => ({
    name: item.role,
    min: item.min / 1000,
    max: item.max / 1000,
    median: item.median / 1000,
  }));

  const getDemandLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getMarketOutlookInfo = (outlook) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-green-500" };
      case "neutral":
        return { icon: LineChart, color: "bg-yellow-500" };
      case "negative":
        return { icon: TrendingDown, color: "bg-red-500" };
      default:
        return { icon: LineChart, color: "bg-gray-500" };
    }
  };

  const OutlookIcon = getMarketOutlookInfo(insights.marketOutlook).icon;
  const outlookColor = getMarketOutlookInfo(insights.marketOutlook).color;

  const lastUpdated = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
  const nextUpdate = format(new Date(insights.nextUpdate), "dd/MM/yyyy");
  const nextUpdateDistance = formatDistanceToNow(
    new Date(insights.nextUpdate),
    { addSuffix: true }
  );
  console.log(nextUpdateDistance);

  return (
    <div className="space-y-3">
      <div className="flex  justify-between items-center">
        <Badge variant={"outline"}>Last updated: {lastUpdated}</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className={"gap-2 drop-shadow-[0_2px_4px_rgba(255,255,255,0.2)]  "}>
          <CardHeader
            className={"flex flex-row  items-center justify-between space-y-0 "}
          >
            <CardTitle className={"text-sm font-medium"}>
              Market Outlook
            </CardTitle>
            <OutlookIcon className={`h-4 w-4 ${outlookColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.marketOutlook}</div>
            <p className="text-xs text-muted-foreground">
              Next update in {nextUpdateDistance}
            </p>
          </CardContent>
        </Card>

        <Card className={"gap-2 drop-shadow-[0_2px_4px_rgba(255,255,255,0.2)]"}>
          <CardHeader
            className={"flex flex-row  items-center justify-between space-y-0 "}
          >
            <CardTitle className={"text-sm font-medium"}>
              Industry Growth
            </CardTitle>
            <TrendingUp className={`h-4 w-4 text-muted-foreground`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights.growthRate.toFixed(1)}%
            </div>
            <Progress value={insights.growthRate} className={"mt-2"} />
          </CardContent>
        </Card>

        <Card className={"gap-2 drop-shadow-[0_2px_4px_rgba(255,255,255,0.2)]"}>
          <CardHeader
            className={"flex flex-row  items-center justify-between space-y-0 "}
          >
            <CardTitle className={"text-sm font-medium"}>
              Demand Level
            </CardTitle>
            <BriefcaseIcon className={`h-4 w-4 text-muted-foreground`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights.demandLevel.charAt(0).toUpperCase() +
                insights.demandLevel.slice(1).toLowerCase()}
            </div>
            <div
              className={`h-2 w-full rounded-full mt-2 ${getDemandLevelColor(
                insights.demandLevel
              )}`}
            />
          </CardContent>
        </Card>

        <Card className={"gap-2 drop-shadow-[0_2px_4px_rgba(255,255,255,0.2)]"}>
          <CardHeader
            className={"flex flex-row  items-center justify-between space-y-0 "}
          >
            <CardTitle className={"text-sm font-medium"}>Top Skills</CardTitle>
            <Brain className={`h-4 w-4 text-muted-foreground`} />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1 space-y-1 overflow-ellipsis truncate">
              {insights.topSkills.slice(0, 5).map((item, idx) => (
                <Badge key={item} variant={"secondary"}>
                  {item}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className={"gap-2  rounded-xl rotating-shadow"}>
        <CardHeader>
          <CardTitle>Salary Ranges by Role</CardTitle>
          <CardDescription>
            Dislaying minimum, median and maximum salaries (in thousands)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] md:h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background rounded-lg border p-2 shadow-md">
                          <p className="font-medium">{label}</p>
                          {payload.map((item, idx) => (
                            <p key={item.name} className="text-sm">
                              {item.name}: ${item.value}K
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey={"min"} fill="#94a3b8" name={"Min Salary (K)"} />
                <Bar
                  dataKey={"median"}
                  fill="#64748b"
                  name={"Median Salary (K)"}
                />
                <Bar
                  dataKey={"max"}
                  fill="#475569"
                  name={"Maximum Salary (K)"}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className={"gap-2 drop-shadow-[0_2px_4px_rgba(255,255,255,0.2)]"}>
          <CardHeader>
            <CardTitle className={"text-md font-medium"}>
              Key Industry Trends
            </CardTitle>
            <CardDescription className={"text-sm"}>
              Current Trends shaping the industry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4 ">
              {insights.keyTrends.map((item, idx) => (
                <li key={idx} className="flex items-start text-sm space-x-2">
                  <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                  <span className="">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className={"gap-2 drop-shadow-[0_2px_4px_rgba(255,255,255,0.2)]"}>
          <CardHeader>
            <CardTitle className={"text-md  font-medium"}>
              Recommended Skills
            </CardTitle>
            <CardDescription className={"text-sm"}>
              Skills to consider developing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.recommendedSkills.map((item, idx) => (
                <p key={idx} className="border text-sm px-2 bg-muted-foreground/10 py-0.5 rounded-lg">
                    {item}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;
