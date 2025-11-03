'use client';

import * as React from 'react';
import { OEEData } from '@/lib/types';
import { TrendingUp, Activity, CheckCircle, AlertCircle } from 'lucide-react';

interface OEEStatisticsProps {
  data: OEEData[];
}

export function OEEStatistics({ data }: OEEStatisticsProps) {
  const stats = React.useMemo(() => {
    if (data.length === 0) {
      return {
        avgOEE: 0,
        avgAvailability: 0,
        avgPerformance: 0,
        avgQuality: 0,
        totalRecords: 0,
        worldClassCount: 0,
      };
    }

    const sum = data.reduce(
      (acc, item) => ({
        oee: acc.oee + item.oee,
        availability: acc.availability + item.availability,
        performance: acc.performance + item.performance,
        quality: acc.quality + item.quality,
      }),
      { oee: 0, availability: 0, performance: 0, quality: 0 }
    );

    const count = data.length;
    const worldClassCount = data.filter(item => item.oee >= 85).length;

    return {
      avgOEE: parseFloat((sum.oee / count).toFixed(2)),
      avgAvailability: parseFloat((sum.availability / count).toFixed(2)),
      avgPerformance: parseFloat((sum.performance / count).toFixed(2)),
      avgQuality: parseFloat((sum.quality / count).toFixed(2)),
      totalRecords: count,
      worldClassCount,
    };
  }, [data]);

  const StatCard = ({ 
    icon: Icon, 
    label, 
    value, 
    color 
  }: { 
    icon: React.ElementType; 
    label: string; 
    value: string | number; 
    color: string;
  }) => (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className={`text-3xl font-bold mt-2 ${color}`}>
            {typeof value === 'number' ? `${value}%` : value}
          </p>
        </div>
        <div className={`rounded-full p-3 ${color.replace('text-', 'bg-').replace('dark:', 'dark:bg-')} bg-opacity-10 dark:bg-opacity-20`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp}
          label="평균 OEE"
          value={stats.avgOEE}
          color="text-purple-600 dark:text-purple-400"
        />
        <StatCard
          icon={Activity}
          label="평균 가동률"
          value={stats.avgAvailability}
          color="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          icon={TrendingUp}
          label="평균 성능률"
          value={stats.avgPerformance}
          color="text-green-600 dark:text-green-400"
        />
        <StatCard
          icon={CheckCircle}
          label="평균 양품률"
          value={stats.avgQuality}
          color="text-orange-600 dark:text-orange-400"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full p-3 bg-indigo-100 dark:bg-indigo-900/30">
              <AlertCircle className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">총 데이터 수</p>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {stats.totalRecords}건
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full p-3 bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">세계 수준 달성</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.worldClassCount}건 ({stats.totalRecords > 0 ? Math.round((stats.worldClassCount / stats.totalRecords) * 100) : 0}%)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

