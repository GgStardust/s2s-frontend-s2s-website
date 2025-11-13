'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Edit2, Check, X as Cancel } from 'lucide-react';

interface EditableTagListProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  className?: string;
  label?: string;
  disabled?: boolean;
}

export default function EditableTagList({
  tags,
  onTagsChange,
  placeholder = "Add a tag...",
  maxTags = 10,
  className = "",
  label,
  disabled = false
}: EditableTagListProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const handleAddTag = () => {
    if (newTag.trim() && tags.length < maxTags && !tags.includes(newTag.trim())) {
      onTagsChange([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (index: number) => {
    if (!disabled) {
      onTagsChange(tags.filter((_, i) => i !== index));
    }
  };

  const handleEditTag = (index: number) => {
    if (!disabled) {
      setEditingIndex(index);
      setEditingValue(tags[index]);
    }
  };

  const handleSaveEdit = () => {
    if (editingValue.trim() && !tags.includes(editingValue.trim())) {
      const newTags = [...tags];
      newTags[editingIndex!] = editingValue.trim();
      onTagsChange(newTags);
    }
    setEditingIndex(null);
    setEditingValue('');
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-900">{label}</label>
          {!disabled && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Edit2 className="w-3 h-3" />
              {isEditing ? 'Done' : 'Edit'}
            </button>
          )}
        </div>
      )}

      {/* Tags Display */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center gap-1 bg-gray-100 text-gray-900 px-2 py-1 rounded-md text-sm"
          >
            {editingIndex === index ? (
              <input
                type="text"
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                onKeyDown={handleEditKeyPress}
                className="bg-transparent border-none outline-none text-sm min-w-0 flex-1 text-gray-900"
                autoFocus
              />
            ) : (
              <span className="truncate max-w-32">{tag}</span>
            )}
            
            {isEditing && !disabled && (
              <div className="flex items-center gap-1">
                {editingIndex === index ? (
                  <>
                    <button
                      onClick={handleSaveEdit}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Cancel className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditTag(index)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleRemoveTag(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add New Tag */}
      {isEditing && !disabled && tags.length < maxTags && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
          />
          <button
            onClick={handleAddTag}
            disabled={!newTag.trim() || tags.includes(newTag.trim())}
            className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Helper Text */}
      <div className="text-xs text-gray-600">
        {tags.length}/{maxTags} tags
        {tags.length >= maxTags && (
          <span className="text-red-600 ml-2">Maximum tags reached</span>
        )}
      </div>
    </div>
  );
}
