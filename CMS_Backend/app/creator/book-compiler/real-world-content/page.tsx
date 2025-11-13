'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/backend/Button';
import { Card } from '@/components/backend/Card';
import { Input, Textarea } from '@/components/backend/Input';
import { PageHeader } from '@/components/backend/Layout';

export default function RealWorldContentPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    type: 'anecdote' as 'anecdote' | 'scenario' | 'observation' | 'field_activation',
    content: '',
    location: '',
    book_type: 'both' as 'non_fiction' | 'fiction' | 'both',
    sausalito_location: '',
    character_associations: [] as string[],
    field_report_notes: '',
    orb_associations: [] as number[],
    tags: [] as string[],
  });

  const [newCharacter, setNewCharacter] = useState('');
  const [newTag, setNewTag] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/real-world-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status: 'pending',
        }),
      });

      if (response.ok) {
        router.push('/creator/book-compiler');
      } else {
        console.error('Failed to create content');
      }
    } catch (err) {
      console.error('Error creating content:', err);
    } finally {
      setSubmitting(false);
    }
  }

  function handleOrbToggle(orbNum: number) {
    if (formData.orb_associations.includes(orbNum)) {
      setFormData({
        ...formData,
        orb_associations: formData.orb_associations.filter(o => o !== orbNum),
      });
    } else {
      setFormData({
        ...formData,
        orb_associations: [...formData.orb_associations, orbNum].sort((a, b) => a - b),
      });
    }
  }

  function handleAddTag() {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag],
      });
      setNewTag('');
    }
  }

  function handleRemoveTag(tag: string) {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag),
    });
  }

  function handleAddCharacter() {
    if (newCharacter && !formData.character_associations.includes(newCharacter)) {
      setFormData({
        ...formData,
        character_associations: [...formData.character_associations, newCharacter],
      });
      setNewCharacter('');
    }
  }

  function handleRemoveCharacter(character: string) {
    setFormData({
      ...formData,
      character_associations: formData.character_associations.filter(c => c !== character),
    });
  }

  return (
    <div className="min-h-screen bg-backend-secondary">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link
            href="/creator/book-compiler"
            className="text-backend-secondary hover:text-backend-primary mb-4 inline-block"
          >
            ← Back to Book Compiler
          </Link>

          <PageHeader
            title="Add Real-World Content"
            subtitle="Capture anecdotes, scenarios, observations, and field activations as they happen"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Book Type */}
          <Card title="Book Destination">
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'non_fiction', label: 'Non-Fiction', color: 'yellow' },
                { value: 'fiction', label: 'Fiction', color: 'blue' },
                { value: 'both', label: 'Both Books', color: 'green' },
              ].map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, book_type: type.value as any })}
                  className={`px-4 py-3 rounded-lg border-2 transition-all font-medium ${
                    formData.book_type === type.value
                      ? type.color === 'yellow'
                        ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                        : type.color === 'blue'
                        ? 'bg-blue-100 text-blue-700 border-blue-300'
                        : 'bg-green-100 text-green-700 border-green-300'
                      : 'bg-white text-backend-primary border-backend-default hover:border-backend-hover'
                  }`}
                >
                  <div className="text-sm font-medium">{type.label}</div>
                </button>
              ))}
            </div>
          </Card>

          {/* Content Type */}
          <Card title="Content Type">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: 'anecdote', label: 'Anecdote' },
                { value: 'scenario', label: 'Scenario' },
                { value: 'observation', label: 'Observation' },
                { value: 'field_activation', label: 'Field Activation' },
              ].map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: type.value as any })}
                  className={`px-4 py-3 rounded-lg border transition-all font-medium ${
                    formData.type === type.value
                      ? 'bg-backend-primary text-white border-backend-primary'
                      : 'bg-white text-backend-primary border-backend-default hover:border-backend-hover'
                  }`}
                >
                  <div className="text-sm font-medium">{type.label}</div>
                </button>
              ))}
            </div>
          </Card>

          {/* Content */}
          <Card title="Content">
            <Textarea
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              placeholder="Describe what happened, what you observed, or the story you want to tell..."
              rows={8}
              required
            />
          </Card>

          {/* Location */}
          <Card title="General Location (optional)">
            <Input
              type="text"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., San Francisco, Marin County, California"
            />
          </Card>

          {/* Fiction-Specific Fields */}
          {(formData.book_type === 'fiction' || formData.book_type === 'both') && (
            <>
              {/* Sausalito Location */}
              <Card title="Sausalito Location (Fiction)" className="bg-blue-50">
                <Input
                  type="text"
                  value={formData.sausalito_location}
                  onChange={e => setFormData({ ...formData, sausalito_location: e.target.value })}
                  placeholder="e.g., Boardwalk, Hurricane Gulch, No Name Bar, Houseboats"
                />
              </Card>

              {/* Characters */}
              <Card title="Characters (Fiction)" className="bg-blue-50">
                <div className="flex space-x-2 mb-3">
                  <Input
                    type="text"
                    value={newCharacter}
                    onChange={e => setNewCharacter(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCharacter();
                      }
                    }}
                    placeholder="e.g., Maya, Mike, Protagonist"
                  />
                  <Button
                    type="button"
                    onClick={handleAddCharacter}
                    variant="secondary"
                  >
                    Add
                  </Button>
                </div>
                {formData.character_associations.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.character_associations.map(character => (
                      <span
                        key={character}
                        className="px-3 py-1 bg-blue-100 text-blue-700 border border-blue-200 rounded-full text-sm flex items-center space-x-2"
                      >
                        <span>{character}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCharacter(character)}
                          className="hover:text-blue-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </Card>

              {/* Field Report Notes */}
              <Card title="Field Report Notes (Fiction)" className="bg-blue-50">
                <Textarea
                  value={formData.field_report_notes}
                  onChange={e => setFormData({ ...formData, field_report_notes: e.target.value })}
                  placeholder="Additional notes about the field activation, transmission quality, or story development..."
                  rows={5}
                />
              </Card>
            </>
          )}

          {/* Orb Associations */}
          <Card title="Orb Associations">
            <div className="grid grid-cols-7 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(orb => (
                <button
                  key={orb}
                  type="button"
                  onClick={() => handleOrbToggle(orb)}
                  className={`aspect-square rounded-lg border-2 transition-all font-bold ${
                    formData.orb_associations.includes(orb)
                      ? 'bg-backend-primary text-white border-backend-primary'
                      : 'bg-white text-backend-primary border-backend-default hover:border-backend-hover'
                  }`}
                >
                  <div className="text-lg font-bold">{orb}</div>
                </button>
              ))}
            </div>
          </Card>

          {/* Tags */}
          <Card title="Tags">
            <div className="flex space-x-2 mb-3">
              <Input
                type="text"
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add a tag..."
              />
              <Button
                type="button"
                onClick={handleAddTag}
                variant="secondary"
              >
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 text-blue-700 border border-blue-200 rounded-full text-sm flex items-center space-x-2"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </Card>

          {/* Submit */}
          <div className="flex space-x-4">
            <Button
              type="submit"
              disabled={submitting || !formData.content}
              variant="primary"
              fullWidth
            >
              {submitting ? 'Saving...' : 'Add Content'}
            </Button>
            <Link href="/creator/book-compiler">
              <Button variant="secondary">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
