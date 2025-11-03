'use client';

import * as React from 'react';
import { Factory, Plus, X } from 'lucide-react';
import { OEEData } from '@/lib/types';
import { loadOEEData, saveOEEData } from '@/lib/oee-calculator';
import { OEEForm } from '@/components/oee-form';
import { OEETable } from '@/components/oee-table';
import { OEEStatistics } from '@/components/oee-statistics';
import { ThemeToggle } from '@/components/theme-toggle';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { ExportButtons } from '@/components/export-buttons';

export default function Home() {
  const [oeeData, setOeeData] = React.useState<OEEData[]>([]);
  const [editingData, setEditingData] = React.useState<OEEData | undefined>(undefined);
  const [showForm, setShowForm] = React.useState(true);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const data = loadOEEData();
    setOeeData(data);
  }, []);

  const handleSubmit = React.useCallback((data: OEEData) => {
    setOeeData((prev) => {
      let newData: OEEData[];
      
      if (editingData) {
        // 수정
        newData = prev.map((item) => (item.id === data.id ? data : item));
      } else {
        // 신규 등록
        newData = [...prev, data];
      }
      
      saveOEEData(newData);
      return newData;
    });
    
    setEditingData(undefined);
    setShowForm(false);
    
    // 성공 메시지
    setTimeout(() => {
      alert(editingData ? '데이터가 수정되었습니다.' : '데이터가 등록되었습니다.');
    }, 100);
  }, [editingData]);

  const handleEdit = React.useCallback((data: OEEData) => {
    setEditingData(data);
    setShowForm(true);
    // 폼으로 스크롤
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }, []);

  const handleDelete = React.useCallback((id: string) => {
    setOeeData((prev) => {
      const newData = prev.filter((item) => item.id !== id);
      saveOEEData(newData);
      return newData;
    });
    alert('데이터가 삭제되었습니다.');
  }, []);

  const handleCancel = React.useCallback(() => {
    setEditingData(undefined);
    setShowForm(false);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-muted p-2 w-10 h-10 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-6 bg-muted rounded w-40 animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
              </div>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <LoadingSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary p-2">
                <Factory className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">OEE 관리 시스템</h1>
                <p className="text-sm text-muted-foreground">설비 종합 효율 실시간 모니터링</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* 통계 대시보드 */}
        <section>
          <h2 className="text-xl font-semibold mb-4">📊 통계 대시보드</h2>
          <OEEStatistics data={oeeData} />
        </section>

        {/* 데이터 입력 폼 */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {editingData ? '📝 데이터 수정' : '➕ 데이터 등록'}
            </h2>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                <Plus className="h-4 w-4" />
                새 데이터 등록
              </button>
            )}
            {showForm && !editingData && oeeData.length > 0 && (
              <button
                onClick={() => setShowForm(false)}
                className="inline-flex items-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                <X className="h-4 w-4" />
                폼 숨기기
              </button>
            )}
          </div>
          
          {showForm && (
            <OEEForm
              onSubmit={handleSubmit}
              editData={editingData}
              onCancel={editingData || oeeData.length > 0 ? handleCancel : undefined}
            />
          )}
        </section>

        {/* 데이터 테이블 */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">📋 OEE 데이터 목록</h2>
            <ExportButtons data={oeeData} />
          </div>
          <OEETable data={oeeData} onEdit={handleEdit} onDelete={handleDelete} />
        </section>

        {/* OEE 설명 */}
        <section className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-3">📖 OEE란?</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">OEE (Overall Equipment Effectiveness)</strong>는 
              설비 종합 효율로, 제조 설비의 성능을 측정하는 핵심 지표입니다.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">가동률 (Availability)</h4>
                <p className="text-xs">실제 가동 시간 ÷ 계획 생산 시간 × 100</p>
              </div>
              <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2">성능률 (Performance)</h4>
                <p className="text-xs">(이상 사이클 타임 × 총 생산량) ÷ (실제 가동 시간 × 60) × 100</p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                <h4 className="font-semibold text-orange-900 dark:text-orange-300 mb-2">양품률 (Quality)</h4>
                <p className="text-xs">양품 수량 ÷ 총 생산량 × 100</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
              <p className="font-semibold text-purple-900 dark:text-purple-300">
                OEE = 가동률 × 성능률 × 양품률 ÷ 10,000
              </p>
              <ul className="mt-2 space-y-1 text-xs">
                <li><strong className="text-green-600 dark:text-green-400">85% 이상:</strong> 세계 수준 (World Class)</li>
                <li><strong className="text-blue-600 dark:text-blue-400">60~85%:</strong> 양호 (개선 여지 있음)</li>
                <li><strong className="text-yellow-600 dark:text-yellow-400">40~60%:</strong> 보통 (개선 필요)</li>
                <li><strong className="text-red-600 dark:text-red-400">40% 미만:</strong> 미흡 (즉시 개선 필요)</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Produced by BDK AI
          </p>
        </div>
      </footer>
    </div>
  );
}
