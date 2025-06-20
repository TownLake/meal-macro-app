import React, { useState, useEffect } from 'react';
import { Clipboard, Check, Plus } from 'lucide-react';
import MealSection from './components/MealSection';
import TotalsCard from './components/TotalsCard';
import { menuData } from './data/menuData';
import { systemPrompt } from './data/systemPrompt';

export default function App() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [includeSystemPrompt, setIncludeSystemPrompt] = useState(false);
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

  useEffect(() => {
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
  }, [selectedItems, includeSystemPrompt]);

  const toggleItem = item => {
    setSelectedItems(prev =>
      prev.some(i => i.id === item.id) ? prev.filter(i => i.id !== item.id) : [...prev, item]
    );
  };

  const toggleSystemPrompt = () => setIncludeSystemPrompt(prev => !prev);

  const handleCopy = () => {
    const textarea = document.createElement('textarea');
    textarea.value = generatedText;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSection = section => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="bg-gray-900 min-h-screen font-sans text-gray-200 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">Macro Prompt Builder</h1>
          <p className="text-gray-400 mt-2">Select your meal items and copy the prompt for your LLM.</p>
        </header>

        {/* Running Totals Card */}
        <TotalsCard totals={totals} />

        {/* System Prompt Toggle */}
        <div className="mb-8">
          <button 
            onClick={toggleSystemPrompt}
            className={`w-full flex items-center justify-center text-left p-4 rounded-xl transition-all duration-300 transform ${includeSystemPrompt ? 'bg-indigo-600 text-white shadow-lg scale-105' : 'bg-gray-800 shadow-md hover:bg-gray-700'}`}
          >
            <div className="flex-1">
              <h2 className="font-bold text-lg">System Prompt</h2>
              <p className={`text-sm mt-1 ${includeSystemPrompt ? 'text-indigo-200' : 'text-gray-400'}`}>Include initial instructions for the AI model.</p>
            </div>
            <div className={`ml-4 w-8 h-8 rounded-full flex items-center justify-center ${includeSystemPrompt ? 'bg-white text-indigo-600' : 'bg-gray-600 text-gray-300'}`}> 
              {includeSystemPrompt ? <Check size={20} /> : <Plus size={20} />}
            </div>
          </button>
        </div>

        {/* Meal Sections */}
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

        {/* Generated Prompt */}
        {generatedText && (
          <div className="bg-gray-800 rounded-xl shadow-lg">
            <div className="flex justify-between items-center p-4">
                 <h3 className="font-bold text-lg text-gray-200">Your Prompt:</h3>
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
