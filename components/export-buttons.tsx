'use client';

import * as React from 'react';
import { Download, FileJson, FileSpreadsheet } from 'lucide-react';
import { OEEData } from '@/lib/types';
import { downloadCSV, downloadJSON } from '@/lib/export';

interface ExportButtonsProps {
  data: OEEData[];
}

export function ExportButtons({ data }: ExportButtonsProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleExportCSV = () => {
    if (data.length === 0) {
      alert('내보낼 데이터가 없습니다.');
      return;
    }
    const timestamp = new Date().toISOString().split('T')[0];
    downloadCSV(data, `oee-data-${timestamp}.csv`);
    setIsOpen(false);
  };

  const handleExportJSON = () => {
    if (data.length === 0) {
      alert('내보낼 데이터가 없습니다.');
      return;
    }
    const timestamp = new Date().toISOString().split('T')[0];
    downloadJSON(data, `oee-data-${timestamp}.json`);
    setIsOpen(false);
  };

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
      >
        <Download className="h-4 w-4" />
        데이터 내보내기
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-2 w-48 rounded-md border border-border bg-popover p-1 shadow-md">
            <button
              onClick={handleExportCSV}
              className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent transition-colors"
            >
              <FileSpreadsheet className="h-4 w-4" />
              CSV로 내보내기
            </button>
            <button
              onClick={handleExportJSON}
              className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent transition-colors"
            >
              <FileJson className="h-4 w-4" />
              JSON으로 내보내기
            </button>
          </div>
        </>
      )}
    </div>
  );
}

