import React from 'react';
import { ChevronDown } from 'lucide-react';

const MealSection = ({ title, items, selectedItems, onToggleItem, isOpen, onToggleOpen }) => {
  return (
    <div className="mb-4">
      <button
        onClick={onToggleOpen}
        className="w-full flex justify-between items-center text-left p-4 rounded-t-xl bg-gray-800 hover:bg-gray-700 transition-colors"
      >
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <ChevronDown 
          size={24} 
          className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      {isOpen && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 bg-gray-800 rounded-b-xl">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => onToggleItem(item)}
              className={`p-4 rounded-xl text-center transition-all duration-300 transform ${selectedItems.some(i => i.id === item.id) ? 'bg-emerald-500 text-white shadow-lg scale-105' : 'bg-gray-700 shadow-md hover:bg-gray-600'}`}
            >
              <div className="text-4xl mb-2">{item.icon}</div>
              <p className="font-semibold text-sm">{item.name}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MealSection;
