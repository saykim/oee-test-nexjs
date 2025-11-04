'use client';

import * as React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { BarChart3, LineChart as LineChartIcon } from 'lucide-react';
import { OEEData } from '@/lib/types';

interface OEEChartProps {
  data: OEEData[];
}

export function OEEChart({ data }: OEEChartProps) {
  const [chartType, setChartType] = React.useState<'bar' | 'line'>('bar');

  // 차트 데이터 준비 (날짜순 정렬)
  const chartData = React.useMemo(() => {
    return [...data]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((item) => ({
        name: `${item.equipmentName}`,
        date: item.date,
        OEE: Number(item.oee.toFixed(1)),
        가동률: Number(item.availability.toFixed(1)),
        성능률: Number(item.performance.toFixed(1)),
        양품률: Number(item.quality.toFixed(1)),
      }));
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-8 shadow-sm text-center">
        <p className="text-muted-foreground">데이터가 없습니다. 먼저 OEE 데이터를 등록해주세요.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm space-y-4">
      {/* 차트 타입 선택 버튼 */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">OEE 차트</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setChartType('bar')}
            className={`inline-flex items-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring h-9 px-3 ${
              chartType === 'bar'
                ? 'bg-primary text-primary-foreground'
                : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Bar
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`inline-flex items-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring h-9 px-3 ${
              chartType === 'line'
                ? 'bg-primary text-primary-foreground'
                : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <LineChartIcon className="h-4 w-4" />
            Line
          </button>
        </div>
      </div>

      {/* 차트 */}
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="name"
                className="text-xs"
                tick={{ fill: 'hsl(var(--foreground))' }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: 'hsl(var(--foreground))' }}
                domain={[0, 100]}
                label={{ value: '(%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="OEE" fill="hsl(280, 70%, 50%)" />
              <Bar dataKey="가동률" fill="hsl(210, 70%, 50%)" />
              <Bar dataKey="성능률" fill="hsl(142, 70%, 45%)" />
              <Bar dataKey="양품률" fill="hsl(30, 80%, 55%)" />
            </BarChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="name"
                className="text-xs"
                tick={{ fill: 'hsl(var(--foreground))' }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: 'hsl(var(--foreground))' }}
                domain={[0, 100]}
                label={{ value: '(%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="OEE"
                stroke="hsl(280, 70%, 50%)"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="가동률"
                stroke="hsl(210, 70%, 50%)"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="성능률"
                stroke="hsl(142, 70%, 45%)"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="양품률"
                stroke="hsl(30, 80%, 55%)"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* 범례 설명 */}
      <div className="text-xs text-muted-foreground border-t border-border pt-4">
        <p>💡 <strong>OEE</strong>는 가동률, 성능률, 양품률을 곱한 종합 효율입니다. 85% 이상이면 세계 수준입니다.</p>
      </div>
    </div>
  );
}
