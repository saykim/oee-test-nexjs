'use client';

import * as React from 'react';
import { OEEFormData, OEEData } from '@/lib/types';
import { calculateOEE } from '@/lib/oee-calculator';
import { validateOEEForm, ValidationError } from '@/lib/validation';

interface OEEFormProps {
  onSubmit: (data: OEEData) => void;
  editData?: OEEData;
  onCancel?: () => void;
}

export function OEEForm({ onSubmit, editData, onCancel }: OEEFormProps) {
  // 입력 중 빈 문자열을 허용하기 위한 별도 상태
  const [inputValues, setInputValues] = React.useState<{
    plannedProductionTime: string;
    actualOperatingTime: string;
    idealCycleTime: string;
    totalProduced: string;
    goodProducts: string;
  }>({
    plannedProductionTime: editData?.plannedProductionTime?.toString() || '',
    actualOperatingTime: editData?.actualOperatingTime?.toString() || '',
    idealCycleTime: editData?.idealCycleTime?.toString() || '',
    totalProduced: editData?.totalProduced?.toString() || '',
    goodProducts: editData?.goodProducts?.toString() || '',
  });

  const [formData, setFormData] = React.useState<OEEFormData>({
    equipmentName: editData?.equipmentName || '',
    date: editData?.date || new Date().toISOString().split('T')[0],
    plannedProductionTime: editData?.plannedProductionTime || 0,
    actualOperatingTime: editData?.actualOperatingTime || 0,
    idealCycleTime: editData?.idealCycleTime || 0,
    totalProduced: editData?.totalProduced || 0,
    goodProducts: editData?.goodProducts || 0,
  });

  const [errors, setErrors] = React.useState<ValidationError[]>([]);

  // editData가 변경될 때 inputValues 업데이트
  React.useEffect(() => {
    if (editData) {
      setInputValues({
        plannedProductionTime: editData.plannedProductionTime?.toString() || '',
        actualOperatingTime: editData.actualOperatingTime?.toString() || '',
        idealCycleTime: editData.idealCycleTime?.toString() || '',
        totalProduced: editData.totalProduced?.toString() || '',
        goodProducts: editData.goodProducts?.toString() || '',
      });
      setFormData({
        equipmentName: editData.equipmentName || '',
        date: editData.date || new Date().toISOString().split('T')[0],
        plannedProductionTime: editData.plannedProductionTime || 0,
        actualOperatingTime: editData.actualOperatingTime || 0,
        idealCycleTime: editData.idealCycleTime || 0,
        totalProduced: editData.totalProduced || 0,
        goodProducts: editData.goodProducts || 0,
      });
    }
  }, [editData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 제출 전 빈 문자열을 0으로 변환하여 formData 업데이트
    const finalFormData: OEEFormData = {
      ...formData,
      plannedProductionTime: inputValues.plannedProductionTime === '' ? 0 : parseFloat(inputValues.plannedProductionTime) || 0,
      actualOperatingTime: inputValues.actualOperatingTime === '' ? 0 : parseFloat(inputValues.actualOperatingTime) || 0,
      idealCycleTime: inputValues.idealCycleTime === '' ? 0 : parseFloat(inputValues.idealCycleTime) || 0,
      totalProduced: inputValues.totalProduced === '' ? 0 : parseFloat(inputValues.totalProduced) || 0,
      goodProducts: inputValues.goodProducts === '' ? 0 : parseFloat(inputValues.goodProducts) || 0,
    };

    // 검증 실행
    const validationErrors = validateOEEForm(finalFormData);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      // 첫 번째 에러 필드로 스크롤
      const firstErrorField = document.getElementById(validationErrors[0].field);
      firstErrorField?.focus();
      return;
    }

    // 검증 통과 시 에러 초기화
    setErrors([]);

    const calculatedData = calculateOEE(finalFormData);
    const finalData: OEEData = {
      id: editData?.id || Date.now().toString(),
      ...calculatedData,
    };

    onSubmit(finalData);

    if (!editData) {
      // 신규 등록 시에만 폼 초기화
      setInputValues({
        plannedProductionTime: '',
        actualOperatingTime: '',
        idealCycleTime: '',
        totalProduced: '',
        goodProducts: '',
      });
      setFormData({
        equipmentName: '',
        date: new Date().toISOString().split('T')[0],
        plannedProductionTime: 0,
        actualOperatingTime: 0,
        idealCycleTime: 0,
        totalProduced: 0,
        goodProducts: 0,
      });
    }
  };

  // 숫자 입력 필드의 값 변경 처리 (입력 중 빈 문자열 허용)
  const handleNumberInputChange = (field: 'plannedProductionTime' | 'actualOperatingTime' | 'idealCycleTime' | 'totalProduced' | 'goodProducts', value: string) => {
    // 입력값을 문자열로 저장 (빈 문자열 허용)
    setInputValues(prev => ({
      ...prev,
      [field]: value,
    }));

    // 숫자로 변환하여 formData 업데이트 (빈 문자열이면 0)
    const numValue = value === '' ? 0 : parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      [field]: numValue,
    }));

    // 입력 시 해당 필드 에러 제거
    if (errors.length > 0) {
      setErrors(errors.filter(err => err.field !== field));
    }
  };

  // 숫자 입력 필드 blur 처리 (빈 문자열이면 0으로 변환)
  const handleNumberInputBlur = (field: 'plannedProductionTime' | 'actualOperatingTime' | 'idealCycleTime' | 'totalProduced' | 'goodProducts') => {
    const currentValue = inputValues[field];
    if (currentValue === '' || currentValue.trim() === '') {
      setInputValues(prev => ({
        ...prev,
        [field]: '0',
      }));
      setFormData(prev => ({
        ...prev,
        [field]: 0,
      }));
    } else {
      // 유효한 숫자로 정규화
      const numValue = parseFloat(currentValue) || 0;
      setInputValues(prev => ({
        ...prev,
        [field]: numValue.toString(),
      }));
      setFormData(prev => ({
        ...prev,
        [field]: numValue,
      }));
    }
  };

  const handleChange = (field: keyof OEEFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // 입력 시 해당 필드 에러 제거
    if (errors.length > 0) {
      setErrors(errors.filter(err => err.field !== field));
    }
  };

  // 특정 필드의 에러 메시지 가져오기
  const getFieldError = (field: string) => {
    return errors.find(err => err.field === field)?.message;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border border-border shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 설비명 */}
        <div className="space-y-2">
          <label htmlFor="equipmentName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            설비명 <span className="text-red-500">*</span>
          </label>
          <input
            id="equipmentName"
            type="text"
            required
            value={formData.equipmentName}
            onChange={(e) => handleChange('equipmentName', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="예: 사출기 #1"
          />
        </div>

        {/* 날짜 */}
        <div className="space-y-2">
          <label htmlFor="date" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            날짜 <span className="text-red-500">*</span>
          </label>
          <input
            id="date"
            type="date"
            required
            max={new Date().toISOString().split('T')[0]}
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* 계획 생산 시간 */}
        <div className="space-y-2">
          <label htmlFor="plannedProductionTime" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            계획 생산 시간 (분) <span className="text-red-500">*</span>
          </label>
          <input
            id="plannedProductionTime"
            type="number"
            required
            min="0"
            step="1"
            value={inputValues.plannedProductionTime}
            onChange={(e) => handleNumberInputChange('plannedProductionTime', e.target.value)}
            onBlur={() => handleNumberInputBlur('plannedProductionTime')}
            onFocus={(e) => e.target.select()}
            onClick={(e) => e.currentTarget.select()}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="480 (1교대 8시간)"
          />
        </div>

        {/* 실제 가동 시간 */}
        <div className="space-y-2">
          <label htmlFor="actualOperatingTime" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            실제 가동 시간 (분) <span className="text-red-500">*</span>
          </label>
          <input
            id="actualOperatingTime"
            type="number"
            required
            min="0"
            step="1"
            value={inputValues.actualOperatingTime}
            onChange={(e) => handleNumberInputChange('actualOperatingTime', e.target.value)}
            onBlur={() => handleNumberInputBlur('actualOperatingTime')}
            onFocus={(e) => e.target.select()}
            onClick={(e) => e.currentTarget.select()}
            className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              getFieldError('actualOperatingTime') ? 'border-red-500 focus-visible:ring-red-500' : 'border-input bg-background'
            }`}
            placeholder="420 (정지시간 제외)"
          />
          {getFieldError('actualOperatingTime') && (
            <p className="text-sm text-red-500 font-medium">{getFieldError('actualOperatingTime')}</p>
          )}
        </div>

        {/* 이상 사이클 타임 */}
        <div className="space-y-2">
          <label htmlFor="idealCycleTime" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            이상 사이클 타임 (초/개) <span className="text-red-500">*</span>
          </label>
          <input
            id="idealCycleTime"
            type="number"
            required
            min="0"
            step="0.1"
            value={inputValues.idealCycleTime}
            onChange={(e) => handleNumberInputChange('idealCycleTime', e.target.value)}
            onBlur={() => handleNumberInputBlur('idealCycleTime')}
            onFocus={(e) => e.target.select()}
            onClick={(e) => e.currentTarget.select()}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="1.2"
          />
          <p className="text-xs text-muted-foreground">
            💡 설비 최고 성능 시 1개당 소요 시간 (예: 분당 50개 생산 → 60÷50 = 1.2초/개)
          </p>
        </div>

        {/* 총 생산량 */}
        <div className="space-y-2">
          <label htmlFor="totalProduced" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            총 생산량 (개) <span className="text-red-500">*</span>
          </label>
          <input
            id="totalProduced"
            type="number"
            required
            min="0"
            step="0.1"
            value={inputValues.totalProduced}
            onChange={(e) => handleNumberInputChange('totalProduced', e.target.value)}
            onBlur={() => handleNumberInputBlur('totalProduced')}
            onFocus={(e) => e.target.select()}
            onClick={(e) => e.currentTarget.select()}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="800 (양품+불량 전체)"
          />
        </div>

        {/* 양품 수량 */}
        <div className="space-y-2">
          <label htmlFor="goodProducts" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            양품 수량 (개) <span className="text-red-500">*</span>
          </label>
          <input
            id="goodProducts"
            type="number"
            required
            min="0"
            step="0.1"
            value={inputValues.goodProducts}
            onChange={(e) => handleNumberInputChange('goodProducts', e.target.value)}
            onBlur={() => handleNumberInputBlur('goodProducts')}
            onFocus={(e) => e.target.select()}
            onClick={(e) => e.currentTarget.select()}
            className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              getFieldError('goodProducts') ? 'border-red-500 focus-visible:ring-red-500' : 'border-input bg-background'
            }`}
            placeholder="750 (불량 제외)"
          />
          {getFieldError('goodProducts') && (
            <p className="text-sm text-red-500 font-medium">{getFieldError('goodProducts')}</p>
          )}
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            취소
          </button>
        )}
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          {editData ? '수정' : '등록'}
        </button>
      </div>
    </form>
  );
}

