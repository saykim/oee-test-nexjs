export interface OEEData {
  id: string;
  equipmentName: string;
  date: string;
  
  // 가동률 (Availability) 계산 요소
  plannedProductionTime: number; // 계획 생산 시간 (분)
  actualOperatingTime: number;   // 실제 가동 시간 (분)
  
  // 성능률 (Performance) 계산 요소
  idealCycleTime: number;        // 이상 사이클 타임 (초/개)
  totalProduced: number;         // 총 생산량 (개)
  
  // 양품률 (Quality) 계산 요소
  goodProducts: number;          // 양품 수량 (개)
  
  // 계산된 값
  availability: number;          // 가동률 (%)
  performance: number;           // 성능률 (%)
  quality: number;               // 양품률 (%)
  oee: number;                   // OEE (%)
}

export interface OEEFormData {
  equipmentName: string;
  date: string;
  plannedProductionTime: number;
  actualOperatingTime: number;
  idealCycleTime: number;
  totalProduced: number;
  goodProducts: number;
}

