'use client';

import * as React from 'react';
import { OEEFormData, OEEData } from '@/lib/types';
import { calculateOEE } from '@/lib/oee-calculator';

interface OEEFormProps {
  onSubmit: (data: OEEData) => void;
  editData?: OEEData;
  onCancel?: () => void;
}

export function OEEForm({ onSubmit, editData, onCancel }: OEEFormProps) {
  const [formData, setFormData] = React.useState<OEEFormData>({
    equipmentName: editData?.equipmentName || '',
    date: editData?.date || new Date().toISOString().split('T')[0],
    plannedProductionTime: editData?.plannedProductionTime || 0,
    actualOperatingTime: editData?.actualOperatingTime || 0,
    idealCycleTime: editData?.idealCycleTime || 0,
    totalProduced: editData?.totalProduced || 0,
    goodProducts: editData?.goodProducts || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const calculatedData = calculateOEE(formData);
    const finalData: OEEData = {
      id: editData?.id || Date.now().toString(),
      ...calculatedData,
    };
    
    onSubmit(finalData);
    
    if (!editData) {
      // 신규 등록 시에만 폼 초기화
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

  const handleChange = (field: keyof OEEFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
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
            value={formData.plannedProductionTime || ''}
            onChange={(e) => handleChange('plannedProductionTime', e.target.value === '' ? 0 : parseFloat(e.target.value))}
            onFocus={(e) => e.target.select()}
            onClick={(e) => e.currentTarget.select()}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="480"
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
            value={formData.actualOperatingTime || ''}
            onChange={(e) => handleChange('actualOperatingTime', e.target.value === '' ? 0 : parseFloat(e.target.value))}
            onFocus={(e) => e.target.select()}
            onClick={(e) => e.currentTarget.select()}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="420"
          />
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
            value={formData.idealCycleTime || ''}
            onChange={(e) => handleChange('idealCycleTime', e.target.value === '' ? 0 : parseFloat(e.target.value))}
            onFocus={(e) => e.target.select()}
            onClick={(e) => e.currentTarget.select()}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="30"
          />
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
            value={formData.totalProduced || ''}
            onChange={(e) => handleChange('totalProduced', e.target.value === '' ? 0 : parseFloat(e.target.value))}
            onFocus={(e) => e.target.select()}
            onClick={(e) => e.currentTarget.select()}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="800"
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
            value={formData.goodProducts || ''}
            onChange={(e) => handleChange('goodProducts', e.target.value === '' ? 0 : parseFloat(e.target.value))}
            onFocus={(e) => e.target.select()}
            onClick={(e) => e.currentTarget.select()}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="750"
          />
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

