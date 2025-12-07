"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { difficultyBarConfig } from "../lib/chart-configs";

interface DifficultyBarChartProps {
  data: Array<{ difficulty: string; averagePercentage: number; fill: string }>;
}

export default function DifficultyBarChart({ data }: DifficultyBarChartProps) {
  return (
    <ChartContainer config={difficultyBarConfig} className="h-[280px] w-full">
      <BarChart
        data={data}
        accessibilityLayer
        margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="difficulty"
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
        <Bar dataKey="averagePercentage" radius={[6, 6, 0, 0]} maxBarSize={80}>
          {data.map((entry) => (
            <Cell key={entry.difficulty} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
