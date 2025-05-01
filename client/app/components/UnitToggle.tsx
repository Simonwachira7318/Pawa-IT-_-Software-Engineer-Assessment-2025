'use client';

import { UnitType } from '../types/weather';

interface UnitToggleProps {
  unit: UnitType;
  onToggle: () => void;
}

export default function UnitToggle({ unit, onToggle }: UnitToggleProps) {
  return (
    <button 
      onClick={onToggle}
      className="flex items-center justify-center w-20 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
    >
      <span className="font-mono text-sm">
        °{unit === 'celsius' ? 'C' : 'F'}
      </span>
    </button>
  );
}