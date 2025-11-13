'use client';

import { useState, useEffect } from 'react';
import { Settings, FileText, Hash, Filter } from 'lucide-react';

interface GenerationParams {
  max_words: number;
  include_scrollstreams: boolean;
  include_notes: boolean;
  linked_orbs_only: boolean;
}

interface GenerationControlsProps {
  params: GenerationParams;
  onParamsChange: (params: GenerationParams) => void;
  onGenerate: () => void;
  isGenerating?: boolean;
  className?: string;
}

export default function GenerationControls({
  params,
  onParamsChange,
  onGenerate,
  isGenerating = false,
  className = ""
}: GenerationControlsProps) {
  const [localParams, setLocalParams] = useState<GenerationParams>(params);

  useEffect(() => {
    setLocalParams(params);
  }, [params]);

  const handleParamChange = (key: keyof GenerationParams, value: any) => {
    const newParams = { ...localParams, [key]: value };
    setLocalParams(newParams);
    onParamsChange(newParams);
  };

  const wordLimitOptions = [
    { value: 1000, label: '1,000' },
    { value: 2000, label: '2,000' },
    { value: 3000, label: '3,000' },
    { value: 5000, label: '5,000' },
    { value: 10000, label: '10,000' }
  ];

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-900">Generation Controls</h3>
      </div>

      <div className="space-y-4">
        {/* Word Limit */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
            <FileText className="w-4 h-4" />
            Max Word Count
          </label>
          <select
            value={localParams.max_words}
            onChange={(e) => handleParamChange('max_words', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {wordLimitOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label} words
              </option>
            ))}
          </select>
        </div>

        {/* Include Options */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-900">
            <Hash className="w-4 h-4" />
            Include Content
          </label>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={localParams.include_scrollstreams}
                onChange={(e) => handleParamChange('include_scrollstreams', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-900">Scrollstreams</span>
            </label>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={localParams.include_notes}
                onChange={(e) => handleParamChange('include_notes', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-900">Notes</span>
            </label>
          </div>
        </div>

        {/* Orb Filter */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
            <Filter className="w-4 h-4" />
            Orb Focus
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={localParams.linked_orbs_only}
              onChange={(e) => handleParamChange('linked_orbs_only', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-900">Primary Orb only</span>
          </label>
        </div>

        {/* Generate Button */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Generate Chapter Draft
              </>
            )}
          </button>
        </div>

        {/* Validation Messages */}
        {localParams.max_words > 5000 && (
          <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
            ⚠️ Large word counts may result in longer generation times
          </div>
        )}
      </div>
    </div>
  );
}
