import React, { useState, useEffect } from 'react';
import { Clipboard, Check, Plus, Code } from 'lucide-react';
import MealSection from './components/MealSection';
import TotalsCard from './components/TotalsCard';
import { menuData } from './data/menuData';
import { systemPrompt } from './data/systemPrompt';

export default function App() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [includeSystemPrompt, setIncludeSystemPrompt] = useState(false);
  const [isJsonMode, setIsJsonMode] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [copied, setCopied] = useState(false);
  const [openSections, setOpenSections] = useState({ Breakfast: true });

  const totals = selectedItems.reduce((acc, item) => {
    if (item.nutrition) {
      Object.entries(item.nutrition).forEach(([key, val]) => {
        acc[key] = (acc[key] || 0) + val;
      });
    }
    return acc;
  }, {});

  useEffect(() => {
    if (isJsonMode) {
      const roundToOneDecimal = (num) => Math.round((num || 0) * 10) / 10;
      const today = new Date().toISOString().slice(0, 10);
      const jsonData = {
        date: today,
        calories_kcal: roundToOneDecimal(totals.calories_kcal),
        protein_g: roundToOneDecimal(totals.protein_g),
        carbs_g: roundToOneDecimal(totals.carbs_g),
        fat_g: roundToOneDecimal(totals.fat_g),
        fiber_g: roundToOneDecimal(totals.fiber_g),
        sugar_g: roundToOneDecimal(totals.sugar_g),
        cholesterol_mg: roundToOneDecimal(totals.cholesterol_mg),
        sat_fat_g: roundToOneDecimal(totals.sat_fat_g),
      };
      setGeneratedText(JSON.stringify(jsonData, null, 2));
    } else {
      let text = '';
      if (includeSystemPrompt) text += systemPrompt.trim() + '\n\n';
      const groupedByMeal = Object.keys(menuData).reduce((acc, meal) => {
        const itemsInMeal = selectedItems.filter(si => menuData[meal].some(mi => mi.id === si.id));
        if (itemsInMeal.length) acc[meal] = itemsInMeal;
        return acc;
      }, {});
      const mealTexts = Object.entries(groupedByMeal).map(([meal, items]) =>
        `${meal}:\n${items.map(item => item.text).join('\n')}`
      );
      setGeneratedText(text + mealTexts.join('\n\n'));
    }
  }, [selectedItems, includeSystemPrompt, isJsonMode, totals]);

  const toggleItem = item => {
    setSelectedItems(prev =>
      prev.some(i => i.id === item.id) ? prev.filter(i => i.id !== item.id) : [...prev, item]
    );
  };

  const toggleSystemPrompt = () => {
    if (!includeSystemPrompt) setIsJsonMode(false);
    setIncludeSystemPrompt(prev => !prev);
  };

  const handleJsonToggle = () => {
    const next = !isJsonMode;
    setIsJsonMode(next);
    if (next) setIncludeSystemPrompt(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  const toggleSection = section => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="bg-gray-900 min-h-dvh font-sans text-gray-200 flex flex-col items-center px-4 sm:px-6 pb-safe">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center pt-6 pb-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-gray-300">
            Macro
            <span className="h-1 w-1 rounded-full bg-gray-500" />
            Prompt Builder
          </div>
        </header>

        <TotalsCard totals={totals} />

        <div className="mb-6">
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-gray-800/60 p-1 backdrop-blur">
            <button
              onClick={toggleSystemPrompt}
              aria-pressed={includeSystemPrompt}
              className={[
                'flex items-center justify-center rounded-xl py-3 text-sm font-semibold transition-all touch-manipulation',
                includeSystemPrompt
                  ? 'bg-indigo-600 text-white shadow ring-1 ring-white/10'
                  : 'bg-transparent text-gray-300 hover:bg-white/5'
              ].join(' ')}
            >
              <span className="inline-flex items-center">
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                  {includeSystemPrompt ? <Check size={18} /> : <Plus size={18} />}
                </span>
                System Prompt
              </span>
            </button>
            <button
              onClick={handleJsonToggle}
              aria-pressed={isJsonMode}
              className={[
                'flex items-center justify-center rounded-xl py-3 text-sm font-semibold transition-all touch-manipulation',
                isJsonMode
                  ? 'bg-teal-600 text-white shadow ring-1 ring-white/10'
                  : 'bg-transparent text-gray-300 hover:bg-white/5'
              ].join(' ')}
            >
              <span className="inline-flex items-center">
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                  <Code size={18} />
                </span>
                Generate JSON
              </span>
            </button>
          </div>
        </div>

        <div className="mb-6 space-y-3">
          {Object.entries(menuData).map(([meal, items]) => (
            <MealSection
              key={meal}
              title={meal}
              items={items}
              selectedItems={selectedItems}
              onToggleItem={toggleItem}
              isOpen={!!openSections[meal]}
              onToggleOpen={() => toggleSection(meal)}
            />
          ))}
        </div>

        {generatedText && (
          <div className="bg-gray-800 rounded-2xl shadow-xl border border-white/10 overflow-hidden">
            <div className="sticky top-0 z-10 flex items-center justify-between p-3 sm:p-4 bg-gray-800/80 backdrop-blur">
              <h3 className="font-semibold text-base text-gray-100">{isJsonMode ? 'Generated JSON' : 'Your Prompt'}</h3>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-3 py-2 text-sm font-semibold text-white transition active:scale-[0.98] hover:bg-indigo-600"
              >
                {copied ? <Check size={18} /> : <Clipboard size={18} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="px-3 sm:px-4 pb-4">
              <pre className="whitespace-pre-wrap text-gray-200 text-sm bg-gray-900 rounded-xl p-3 sm:p-4 max-h-[44vh] overflow-y-auto leading-relaxed">
                {generatedText}
              </pre>
            </div>
          </div>
        )}

        {generatedText && (
          <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-2xl px-4 pb-safe">
            <div className="mb-3 rounded-2xl bg-gray-800/80 backdrop-blur border border-white/10 shadow-lg">
              <div className="p-2">
                <button
                  onClick={handleCopy}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-base font-semibold text-white active:scale-[0.99]"
                >
                  {copied ? <Check size={20} /> : <Clipboard size={20} />}
                  {copied ? 'Copied' : 'Copy to Clipboard'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
