'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  searchNameTransliterations, 
  getNameDisplayLabel, 
  type NameMatch 
} from '../data/nameTransliterations';

interface NameAutocompleteProps {
  /** Current Latin input value */
  value: string;
  /** Callback when Latin input changes */
  onChange: (value: string) => void;
  /** Callback when Arabic name is selected */
  onArabicSelect: (arabic: string, latin: string) => void;
  /** Placeholder text (optional - uses translation if not provided) */
  placeholder?: string;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show helper text */
  showHelper?: boolean;
}

export default function NameAutocomplete({
  value,
  onChange,
  onArabicSelect,
  placeholder,
  className = '',
  showHelper = true,
}: NameAutocompleteProps) {
  const { t } = useLanguage();
  const [showDropdown, setShowDropdown] = useState(false);
  const [matches, setMatches] = useState<NameMatch[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Search for matches when input changes
  useEffect(() => {
    if (value.trim().length > 0) {
      const results = searchNameTransliterations(value);
      setMatches(results);
      setShowDropdown(results.length > 0);
      setSelectedIndex(-1);
    } else {
      setMatches([]);
      setShowDropdown(false);
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSelectName = (item: NameMatch) => {
    onChange(item.matchedVariation);
    onArabicSelect(item.arabic, item.matchedVariation);
    setShowDropdown(false);
    inputRef.current?.blur();
  };

  const handleClearInput = () => {
    onChange('');
    setMatches([]);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || matches.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < matches.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < matches.length) {
          handleSelectName(matches[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && dropdownRef.current) {
      const selectedElement = dropdownRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }
    }
  }, [selectedIndex]);

  return (
    <div className={`relative ${className}`}>
      {/* Input Field */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Search className="w-4 h-4 text-slate-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (matches.length > 0) setShowDropdown(true);
          }}
          placeholder={placeholder || t?.ilmHuruf?.namePlaceholderEn}
          className="w-full pl-10 pr-10 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          autoComplete="off"
        />
        {value && (
          <button
            onClick={handleClearInput}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded transition-colors"
            aria-label="Clear input"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>

      {/* Helper Text */}
      {showHelper && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {matches.length > 0 
            ? t?.ilmHuruf?.nameHelperTextSuggestions 
            : t?.ilmHuruf?.nameHelperText}
        </p>
      )}

      {/* Dropdown */}
      {showDropdown && matches.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {matches.map((item, index) => (
            <button
              key={`${item.arabic}-${index}`}
              onClick={() => handleSelectName(item)}
              className={`w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 last:border-b-0 ${
                index === selectedIndex
                  ? 'bg-blue-50 dark:bg-blue-900/20'
                  : ''
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                  {getNameDisplayLabel(item)}
                </div>
                <div className="text-xl font-arabic text-slate-900 dark:text-slate-100 mt-1" dir="rtl">
                  {item.arabic}
                </div>
              </div>
              {index === selectedIndex && (
                <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* No matches message */}
      {showDropdown && matches.length === 0 && value.trim().length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg px-4 py-3">
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
            {t?.ilmHuruf?.noMatchesFound}
          </p>
        </div>
      )}
    </div>
  );
}
