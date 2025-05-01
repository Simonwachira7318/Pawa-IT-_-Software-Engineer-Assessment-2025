'use client';

import { FiBattery } from 'react-icons/fi';

interface BatteryStatusProps {
  level: number;
}

export default function BatteryStatus({ level }: BatteryStatusProps) {
  const getColor = () => {
    if (level > 70) return 'text-green-400';
    if (level > 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="flex items-center gap-1">
      <FiBattery className={`text-lg ${getColor()}`} />
      <span className="text-xs font-mono">{level}%</span>
    </div>
  );
}