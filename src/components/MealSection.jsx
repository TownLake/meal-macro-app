// src/components/MealSection.jsx
import React, { useMemo } from 'react';
import { ChevronDown } from 'lucide-react';

export default function MealSection({ title, items, selectedItems, onToggleItem, isOpen, onToggleOpen }) {
  const sectionId = `section-${title.replace(/\s+/g, '-').toLowerCase()}`;
  const selectedSet = useMemo(() => new Set(selectedItems.map(i => i.id)), [selectedItems]);
  const selectedCount = useMemo(() => items.reduce((n, i) => n + (selectedSet.has(i.id) ? 1 : 0), 0), [items, selectedSet]);

  return (
    <section className="rounded-2xl border border-white/10 overflow-hidden bg-white/5 backdrop-blur">
      <button
        onClick={onToggleOpen}
        aria-expanded={isOpen}
        aria-controls={sectionId}
        className="w-full flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <h2 className="text-lg sm:text-xl font-semibold text-white">{title}</h2>
          {selectedCount > 0 && (
            <span className="inline-flex items-center rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-semibold px-2 py-0.5">
              {selectedCount}
            </span>
          )}
        </div>
        <ChevronDown size={22} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <div
        id={sectionId}
        className={[
          'grid transition-[grid-template-rows] duration-300',
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        ].join(' ')}
        aria-hidden={!isOpen}
      >
        <div className={['overflow-hidden px-3 pb-3 sm:px-4 sm:pb-4 transition-opacity duration-300', isOpen ? 'opacity-100' : 'opacity-0'].join(' ')}>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 sm:gap-3">
            {items.map(item => {
              const active = selectedSet.has(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => onToggleItem(item)}
                  aria-pressed={active}
                  className={[
                    'group relative rounded-xl border border-white/10 touch-manipulation',
                    'transition-[background-color,transform,box-shadow] duration-200 ease-out',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50',
                    active
                      ? 'bg-emerald-500/10 text-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-400/40'
                      : 'bg-gray-800/60 text-gray-200 hover:bg-white/5 active:scale-[0.98]'
                  ].join(' ')}
                  style={{ aspectRatio: '1 / 1' }}
                >
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 p-2">
                    <span className="text-3xl leading-none">{item.icon}</span>
                    <span className="text-[13px] sm:text-sm font-medium truncate max-w-[90%]">{item.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
