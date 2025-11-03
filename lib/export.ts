import { OEEData } from './types';

/**
 * OEE 데이터를 CSV로 변환
 */
export function exportToCSV(data: OEEData[]): string {
  if (data.length === 0) return '';

  const headers = [
    '설비명',
    '날짜',
    '계획 생산 시간(분)',
    '실제 가동 시간(분)',
    '이상 사이클 타임(초)',
    '총 생산량(개)',
    '양품 수량(개)',
    '가동률(%)',
    '성능률(%)',
    '양품률(%)',
    'OEE(%)',
  ];

  const rows = data.map((item) => [
    item.equipmentName,
    item.date,
    item.plannedProductionTime,
    item.actualOperatingTime,
    item.idealCycleTime,
    item.totalProduced,
    item.goodProducts,
    item.availability,
    item.performance,
    item.quality,
    item.oee,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  return '\uFEFF' + csvContent; // UTF-8 BOM 추가
}

/**
 * CSV 파일 다운로드
 */
export function downloadCSV(data: OEEData[], filename: string = 'oee-data.csv'): void {
  const csv = exportToCSV(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * OEE 데이터를 JSON으로 내보내기
 */
export function exportToJSON(data: OEEData[]): string {
  return JSON.stringify(data, null, 2);
}

/**
 * JSON 파일 다운로드
 */
export function downloadJSON(data: OEEData[], filename: string = 'oee-data.json'): void {
  const json = exportToJSON(data);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

