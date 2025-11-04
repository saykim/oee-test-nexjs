'use client';

import * as React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { OEEData } from '@/lib/types';
import { getOEEGrade } from '@/lib/oee-calculator';

interface OEETableProps {
  data: OEEData[];
  onEdit: (data: OEEData) => void;
  onDelete: (id: string) => void;
}

export function OEETable({ data, onEdit, onDelete }: OEETableProps) {
  if (data.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-12 text-center">
        <p className="text-muted-foreground text-lg">등록된 OEE 데이터가 없습니다.</p>
        <p className="text-muted-foreground text-sm mt-2">상단 폼을 사용하여 데이터를 등록해주세요.</p>
      </div>
    );
  }

  // 최신 날짜 우선 정렬 (내림차순)
  const sortedData = [...data].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                설비명
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                날짜
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                가동률
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                성능률
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                양품률
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                OEE
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                등급
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedData.map((item) => {
              const grade = getOEEGrade(item.oee);
              return (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    {item.equipmentName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                    {item.date}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm">
                    <span className="font-semibold">{item.availability}%</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm">
                    <span className="font-semibold">{item.performance}%</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm">
                    <span className="font-semibold">{item.quality}%</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-bold ${
                      item.oee >= 85 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      item.oee >= 60 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                      item.oee >= 40 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {item.oee}%
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm">
                    <span className={`font-semibold ${grade.color}`}>
                      {grade.grade}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
                        aria-label="수정"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`"${item.equipmentName}" 데이터를 삭제하시겠습니까?`)) {
                            onDelete(item.id);
                          }
                        }}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-destructive hover:text-destructive-foreground h-8 w-8"
                        aria-label="삭제"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

