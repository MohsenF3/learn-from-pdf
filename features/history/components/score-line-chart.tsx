"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { scoreOverTimeConfig } from "../lib/chart-configs";

interface ScoreLineChartProps {
  data: Array<{ date: string; scorePercentage: number }>;
}

export default function ScoreLineChart({ data }: ScoreLineChartProps) {
  return (
    <ChartContainer config={scoreOverTimeConfig} className="h-[280px] w-full">
      <LineChart
        data={data}
        accessibilityLayer
        margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          domain={[0, 100]}
          tickFormatter={(v) => `${v}%`}
          tickLine={false}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          type="monotone"
          dataKey="scorePercentage"
          stroke="var(--color-chart-primary)"
          strokeWidth={2.5}
          dot={{ fill: "var(--color-chart-primary)", strokeWidth: 2, r: 4 }}
          activeDot={{
            r: 6,
            fill: "var(--color-chart-primary)",
            stroke: "var(--background)",
            strokeWidth: 2,
          }}
        />
      </LineChart>
    </ChartContainer>
  );
}
