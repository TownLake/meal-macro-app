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

  // Calculate running totals
  const totals = selectedItems.reduce((acc, item) => {
    if (item.nutrition) {
      Object.entries(item.nutrition).forEach(([key, val]) => {
        acc[key] = (acc[key] || 0) + val;
      });
    }
    return acc;
  }, {});

  // This effect runs whenever the selection or modes change to update the output
  useEffect(() => {
    if (isJsonMode) {
      // --- Rounding function ---
      const roundToOneDecimal = (num) => Math.round((num || 0) * 10) / 10;

      // If in JSON mode, generate and set the JSON string with rounded numbers
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
      // If not in JSON mode, build the prompt text
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

  // Toggle a food item
  const toggleItem = item => {
    setSelectedItems(prev =>
      prev.some(i => i.id === item.id) ? prev.filter(i => i.id !== item.id) : [...prev, item]
    );
  };

  // Toggle the system prompt on/off (this disables JSON mode)
  const toggleSystemPrompt = () => {
    if (!includeSystemPrompt) setIsJsonMode(false); // Deactivate JSON mode if activating prompt
    setIncludeSystemPrompt(prev => !prev);
  }

  // Toggle JSON mode on/off
  const handleJsonToggle = () => {
    const newJsonMode = !isJsonMode;
    setIsJsonMode(newJsonMode);
    if (newJsonMode) setIncludeSystemPrompt(false); // Deactivate prompt mode if activating JSON
  };

  // Handle copying text to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    });
  };

  const toggleSection = section => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="bg-gray-900 min-h-screen font-sans text-gray-200 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">Macro Prompt Builder</h1>
          <p className="text-gray-400 mt-2">Select meals, then generate a prompt or a JSON summary.</p>
        </header>

        <TotalsCard totals={totals} />

        {/* --- Control Buttons Row --- */}
        <div className="flex gap-4 mb-8">
          {/* System Prompt Button */}
          <button
            onClick={toggleSystemPrompt}
            className={`flex-1 flex items-center justify-center text-center p-4 rounded-xl transition-all duration-300 transform ${includeSystemPrompt ? 'bg-indigo-600 text-white shadow-lg scale-105' : 'bg-gray-800 shadow-md hover:bg-gray-700'}`}
          >
            <h2 className="font-bold text-lg">System Prompt</h2>
            <div className={`ml-3 w-7 h-7 rounded-full flex items-center justify-center text-sm ${includeSystemPrompt ? 'bg-white text-indigo-600' : 'bg-gray-600 text-gray-300'}`}>
              {includeSystemPrompt ? <Check size={18} /> : <Plus size={18} />}
            </div>
          </button>
          
          {/* Generate JSON Button */}
          <button
            onClick={handleJsonToggle}
            className={`flex-1 flex items-center justify-center text-center p-4 rounded-xl transition-all duration-300 transform ${isJsonMode ? 'bg-teal-600 text-white shadow-lg scale-105' : 'bg-gray-800 shadow-md hover:bg-gray-700'}`}
          >
            <h2 className="font-bold text-lg">Generate JSON</h2>
            <div className={`ml-3 w-7 h-7 rounded-full flex items-center justify-center ${isJsonMode ? 'bg-white text-teal-600' : 'bg-gray-600 text-gray-300'}`}>
              <Code size={18} />
            </div>
          </button>
        </div>

        {/* --- Meal Sections --- */}
        <div className="mb-8">
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

        {/* --- Output Box --- */}
        {generatedText && (
          <div className="bg-gray-800 rounded-xl shadow-lg">
            <div className="flex justify-between items-center p-4">
              <h3 className="font-bold text-lg text-gray-200">{isJsonMode ? 'Generated JSON:' : 'Your Prompt:'}</h3>
              <button
                onClick={handleCopy}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-3 rounded-lg flex items-center transition-transform transform hover:scale-105"
              >
                {copied ? <Check size={18} className="mr-1" /> : <Clipboard size={18} className="mr-1" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="px-4 pb-4">
              <pre className="whitespace-pre-wrap text-gray-300 text-sm bg-gray-900 p-4 rounded-lg">{generatedText}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}