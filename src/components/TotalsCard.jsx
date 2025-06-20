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
  protein_g:   { label: '💪 Protein', unit: 'g' },
  carbs_g:     { label: '🍞 Carbs', unit: 'g' },
  fat_g:       { label: '🥑 Fat', unit: 'g' },
  fiber_g:     { label: '🌾 Fiber', unit: 'g' },
  sugar_g:     { label: '🍭 Sugar', unit: 'g' },
  cholesterol_mg: { label: '🧈 Cholesterol', unit: 'mg' },
  sat_fat_g:   { label: '🧀 Sat. Fat', unit: 'g' },
};

function CompactNutrientBadge({ nutrientKey, consumed, goal, label, unit }) {
  const percentage = (consumed / goal) * 100;
  const isOverGoal = consumed > goal;
  const emoji = label.split(' ')[0]; // Extract emoji from label
  
  return (
    <div className={`flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium ${
      isOverGoal 
        ? 'bg-red-500/20 text-red-300' 
        : percentage > 80 
          ? 'bg-yellow-500/20 text-yellow-300'
          : 'bg-green-500/20 text-green-300'
    }`}>
      <span className="mr-1">{emoji}</span>
      <span>{Math.round(percentage)}%</span>
    </div>
  );
}

// Demo data for visualization
const demoTotals = {
  calories_kcal: 1650,
  protein_g: 125,
  carbs_g: 180,
  fat_g: 45,
  fiber_g: 22,
  sugar_g: 35,
  cholesterol_mg: 220,
  sat_fat_g: 15,
};

function NutrientCard({ nutrientKey, consumed, goal, label, unit }) {
  const percentage = (consumed / goal) * 100;
  const isOverGoal = consumed > goal;
  
  return (
    <div className="group relative bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20">
      {/* Progress bar background */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <div 
          className={`absolute top-0 left-0 h-full transition-all duration-500 ${
            isOverGoal 
              ? 'bg-gradient-to-r from-red-500/10 to-red-400/10' 
              : 'bg-gradient-to-r from-blue-500/10 to-green-500/10'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
            {label}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            isOverGoal 
              ? 'bg-red-500/20 text-red-300' 
              : percentage > 80 
                ? 'bg-yellow-500/20 text-yellow-300'
                : 'bg-green-500/20 text-green-300'
          }`}>
            {Math.round(percentage)}%
          </span>
        </div>
        
        <div className="flex items-end gap-1">
          <span className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
            {consumed.toFixed(consumed % 1 === 0 ? 0 : 1)}
          </span>
          <span className="text-sm text-gray-400 mb-0.5">{unit}</span>
        </div>
      </div>
    </div>
  );
}

export default function TotalsCard({ totals = demoTotals }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 mb-8 border border-gray-700/50">
      <button 
        onClick={toggleExpanded}
        className="w-full flex items-center justify-between mb-4 hover:bg-white/5 rounded-lg p-2 -m-2 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-green-500 rounded-full"></div>
          <h2 className="text-2xl font-bold text-white">Daily Progress</h2>
        </div>
        <div className="text-gray-400 hover:text-white transition-colors">
          {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
      </button>
      
      {!isExpanded ? (
        <div className="grid grid-cols-4 gap-2">
          {Object.keys(GOALS).map((key) => (
            <CompactNutrientBadge
              key={key}
              nutrientKey={key}
              consumed={totals[key] || 0}
              goal={GOALS[key]}
              label={LABELS[key].label}
              unit={LABELS[key].unit}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {Object.keys(GOALS).map((key) => (
            <NutrientCard
              key={key}
              nutrientKey={key}
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