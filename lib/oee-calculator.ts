import { OEEData, OEEFormData } from './types';

/**
 * OEE 지표 계산 함수
 */
export function calculateOEE(formData: OEEFormData): Omit<OEEData, 'id'> {
  const {
    equipmentName,
    date,
    plannedProductionTime,
    actualOperatingTime,
    idealCycleTime,
    totalProduced,
    goodProducts,
  } = formData;

  // 1. 가동률 (Availability) = (실제 가동 시간 / 계획 생산 시간) × 100
  const availability = plannedProductionTime > 0
    ? (actualOperatingTime / plannedProductionTime) * 100
    : 0;

  // 2. 성능률 (Performance) = (이상 사이클 타임 × 총 생산량) / (실제 가동 시간 × 60) × 100
  const performance = actualOperatingTime > 0
    ? ((idealCycleTime * totalProduced) / (actualOperatingTime * 60)) * 100
    : 0;

  // 3. 양품률 (Quality) = (양품 수량 / 총 생산량) × 100
  const quality = totalProduced > 0
    ? (goodProducts / totalProduced) * 100
    : 0;

  // 4. OEE = 가동률 × 성능률 × 양품률 / 10000
  const oee = (availability * performance * quality) / 10000;

  return {
    equipmentName,
    date,
    plannedProductionTime,
    actualOperatingTime,
    idealCycleTime,
    totalProduced,
    goodProducts,
    availability: parseFloat(availability.toFixed(2)),
    performance: parseFloat(performance.toFixed(2)),
    quality: parseFloat(quality.toFixed(2)),
    oee: parseFloat(oee.toFixed(2)),
  };
}

/**
 * OEE 등급 판정 함수
 */
export function getOEEGrade(oee: number): {
  grade: string;
  color: string;
  description: string;
} {
  if (oee >= 85) {
    return {
      grade: '세계 수준',
      color: 'text-green-600 dark:text-green-400',
      description: '매우 우수',
    };
  } else if (oee >= 60) {
    return {
      grade: '양호',
      color: 'text-blue-600 dark:text-blue-400',
      description: '개선 여지 있음',
    };
  } else if (oee >= 40) {
    return {
      grade: '보통',
      color: 'text-yellow-600 dark:text-yellow-400',
      description: '개선 필요',
    };
  } else {
    return {
      grade: '미흡',
      color: 'text-red-600 dark:text-red-400',
      description: '즉시 개선 필요',
    };
  }
}

/**
 * LocalStorage에서 OEE 데이터 로드
 */
export function loadOEEData(): OEEData[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem('oee-data');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load OEE data:', error);
    return [];
  }
}

/**
 * LocalStorage에 OEE 데이터 저장
 */
export function saveOEEData(data: OEEData[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('oee-data', JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save OEE data:', error);
  }
}

