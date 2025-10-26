import React from 'react';

interface CompatibilityGaugeProps {
  score: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  label?: string;
  showPercentage?: boolean;
}

export function CompatibilityGauge({ 
  score, 
  size = 'md', 
  color, 
  label,
  showPercentage = true 
}: CompatibilityGaugeProps) {
  
  // Determine color based on score if not provided
  const gaugeColor = color || (
    score >= 85 ? '#10b981' : // green
    score >= 75 ? '#3b82f6' : // blue
    score >= 65 ? '#eab308' : // yellow
    score >= 50 ? '#f97316' : // orange
    '#ef4444' // red
  );
  
  // Size configurations
  const sizeConfig = {
    sm: { width: 80, height: 80, strokeWidth: 6, fontSize: '16px', labelSize: '12px' },
    md: { width: 120, height: 120, strokeWidth: 8, fontSize: '24px', labelSize: '14px' },
    lg: { width: 160, height: 160, strokeWidth: 10, fontSize: '32px', labelSize: '16px' }
  };
  
  const config = sizeConfig[size];
  const radius = (config.width - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: config.width, height: config.height }}>
        <svg
          width={config.width}
          height={config.height}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={config.width / 2}
            cy={config.height / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={config.strokeWidth}
          />
          
          {/* Progress circle */}
          <circle
            cx={config.width / 2}
            cy={config.height / 2}
            r={radius}
            fill="none"
            stroke={gaugeColor}
            strokeWidth={config.strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Percentage text */}
        {showPercentage && (
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ fontSize: config.fontSize, fontWeight: 'bold', color: gaugeColor }}
          >
            {score}%
          </div>
        )}
      </div>
      
      {/* Label */}
      {label && (
        <div 
          className="text-center text-gray-700 dark:text-gray-300 font-medium"
          style={{ fontSize: config.labelSize }}
        >
          {label}
        </div>
      )}
    </div>
  );
}
