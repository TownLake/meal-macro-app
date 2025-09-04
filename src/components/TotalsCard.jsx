import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const GOALS = {
  calories_kcal: 2200,
  protein_g: 165,
  carbs_g: 248,
  fat_g: 61,
  fiber_g: 30,
  sugar_g: 50,
  cholesterol_mg: 300,
  sat_fat_g: 20,
};

const LABELS = {
  calories_kcal: { label: '🔥 Calories', unit: 'kcal' },
  protein_g: { label: '💪 Protein', unit: 'g' },
  carbs_g: { label: '🍞 Carbs', unit: 'g' },
  fat_g: { label: '🥑 Fat', unit: 'g' },
  fiber_g: { label: '🌾 Fiber', unit: 'g' },
  sugar_g: { label: '🍭 Sugar', unit: 'g' },
  cholesterol_mg: { label: '🧈 Cholesterol', unit: 'mg' },
  sat_fat_g: { label: '🧀 Sat. Fat', unit: 'g' },
};

function CompactNutrientBadge({ consumed = 0, goal, label }) {
  const percentage = Math.min(999, Math.round(((consumed || 0) / goal) * 100));
  const isOverGoal = (consumed || 0) > goal;
  const emoji = label.split(' ')[0];
  return (
    <div
      className={[
        'flex items-center justify-center px-2 py-1 rounded-full text-[11px] font-medium',
        isOverGoal
          ? 'bg-red-500/20 text-red-300'
          : percentage > 80
            ? 'bg-yellow-500/20 text-yellow-200'
            : 'bg-green-500/20 text-green-300'
      ].join(' ')}
    >
      <span className="mr-1">{emoji}</span>
      <span>{percentage}%</span>
    </div>
  );
}

function NutrientCard({ consumed = 0, goal, label, unit }) {
  const percentage = ((consumed || 0) / goal) * 100;
  const isOverGoal = (consumed || 0) > goal;
  return (
    <div className="group relative rounded-xl p-4 border border-white/10 bg-white/5 backdrop-blur hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <div
          className={[
            'absolute top-0 left-0 h-full transition-all duration-500',
            isOverGoal ? 'bg-red-400/10' : 'bg-gradient-to-r from-blue-400/10 to-green-400/10'
          ].join(' ')}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-300 group-hover:text-white">{label}</span>
          <span
            className={[
              'text-xs px-2 py-0.5 rounded-full',
              isOverGoal ? 'bg-red-500/20 text-red-300' : percentage > 80 ? 'bg-yellow-500/20 text-yellow-200' : 'bg-green-500/20 text-green-300'
            ].join(' ')}
          >
            {Math.round(percentage)}%
          </span>
        </div>
        <div className="flex items-end gap-1">
          <span className="text-2xl font-semibold text-white group-hover:text-blue-300">
            {Number.isFinite(consumed) ? (consumed % 1 === 0 ? consumed.toFixed(0) : consumed.toFixed(1)) : '0'}
          </span>
          <span className="text-sm text-gray-400 mb-0.5">{unit}</span>
        </div>
      </div>
    </div>
  );
}

export default function TotalsCard({ totals = {} }) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="rounded-2xl shadow-2xl p-5 sm:p-6 mb-6 border border-gray-700/50 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <button
        onClick={() => setIsExpanded(v => !v)}
        className="w-full flex items-center justify-between mb-3 sm:mb-4 hover:bg-white/5 rounded-lg p-2 -m-2 transition-colors touch-manipulation"
      >
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-green-500 rounded-full" />
          <h2 className="text-xl sm:text-2xl font-bold text-white">Daily Progress</h2>
        </div>
        <div className="text-gray-400">
          {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
      </button>

      {!isExpanded ? (
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {Object.keys(GOALS).map((key) => (
            <CompactNutrientBadge
              key={key}
              consumed={totals[key] || 0}
              goal={GOALS[key]}
              label={LABELS[key].label}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.keys(GOALS).map((key) => (
            <NutrientCard
              key={key}
              consumed={totals[key] || 0}
              goal={GOALS[key]}
              label={LABELS[key].label}
              unit={LABELS[key].unit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
