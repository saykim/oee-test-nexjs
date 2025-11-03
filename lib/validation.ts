import { OEEFormData } from './types';

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * OEE 폼 데이터 유효성 검증
 */
export function validateOEEForm(data: OEEFormData): ValidationError[] {
  const errors: ValidationError[] = [];

  // 설비명 검증
  if (!data.equipmentName || data.equipmentName.trim().length === 0) {
    errors.push({ field: 'equipmentName', message: '설비명을 입력해주세요.' });
  }

  // 날짜 검증
  if (!data.date) {
    errors.push({ field: 'date', message: '날짜를 선택해주세요.' });
  }

  // 계획 생산 시간 검증
  if (data.plannedProductionTime <= 0) {
    errors.push({ field: 'plannedProductionTime', message: '계획 생산 시간은 0보다 커야 합니다.' });
  }

  // 실제 가동 시간 검증
  if (data.actualOperatingTime < 0) {
    errors.push({ field: 'actualOperatingTime', message: '실제 가동 시간은 0 이상이어야 합니다.' });
  }

  if (data.actualOperatingTime > data.plannedProductionTime) {
    errors.push({ 
      field: 'actualOperatingTime', 
      message: '실제 가동 시간은 계획 생산 시간을 초과할 수 없습니다.' 
    });
  }

  // 이상 사이클 타임 검증
  if (data.idealCycleTime <= 0) {
    errors.push({ field: 'idealCycleTime', message: '이상 사이클 타임은 0보다 커야 합니다.' });
  }

  // 총 생산량 검증
  if (data.totalProduced < 0) {
    errors.push({ field: 'totalProduced', message: '총 생산량은 0 이상이어야 합니다.' });
  }

  // 양품 수량 검증
  if (data.goodProducts < 0) {
    errors.push({ field: 'goodProducts', message: '양품 수량은 0 이상이어야 합니다.' });
  }

  if (data.goodProducts > data.totalProduced) {
    errors.push({ 
      field: 'goodProducts', 
      message: '양품 수량은 총 생산량을 초과할 수 없습니다.' 
    });
  }

  return errors;
}

/**
 * 데이터 논리적 검증 및 경고
 */
export function getDataWarnings(data: OEEFormData): string[] {
  const warnings: string[] = [];

  // 가동률이 너무 낮은 경우
  const availability = (data.actualOperatingTime / data.plannedProductionTime) * 100;
  if (availability < 50) {
    warnings.push('가동률이 50% 미만입니다. 설비 가동 시간을 확인해주세요.');
  }

  // 불량률이 높은 경우
  const defectRate = ((data.totalProduced - data.goodProducts) / data.totalProduced) * 100;
  if (defectRate > 10) {
    warnings.push('불량률이 10%를 초과합니다. 품질 관리가 필요합니다.');
  }

  return warnings;
}

