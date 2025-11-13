'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Character {
  id: string;
  name: string;
  role: string;
  arc: string;
  orb_associations: number[];
  personality_traits: string[];
  appearance_notes: string;
  backstory: string;
  development_status: string;
  character_type: string;
}

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingChar, setEditingChar] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Character>>({
    name: '',
    role: '',
    arc: '',
    orb_associations: [],
    personality_traits: [],
    appearance_notes: '',
    backstory: '',
    development_status: 'outlined',
    character_type: 'supporting',
  });

  useEffect(() => {
    loadCharacters();
  }, []);

  async function loadCharacters() {
    try {
      const response = await fetch('/api/fiction-resources/characters');
      const data = await response.json();
      setCharacters(data.characters || []);
    } catch (err) {
      console.error('Error loading characters:', err);
    } finally {
      setLoading(false);
    }
  }

  function startEdit(character: Character) {
    setEditingChar(character.id);
    setFormData(character);
    setShowAddForm(false);
  }

  function startAdd() {
    setShowAddForm(true);
    setEditingChar(null);
    setFormData({
      name: '',
      role: '',
      arc: '',
      orb_associations: [],
      personality_traits: [],
      appearance_notes: '',
      backstory: '',
      development_status: 'outlined',
      character_type: 'supporting',
    });
  }

  function cancelEdit() {
    setEditingChar(null);
    setShowAddForm(false);
  }

  async function saveCharacter() {
    try {
      const method = editingChar ? 'PUT' : 'POST';
      const response = await fetch('/api/fiction-resources/characters', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingChar ? { id: editingChar, ...formData } : formData),
      });

      if (response.ok) {
        await loadCharacters();
        cancelEdit();
      }
    } catch (err) {
      console.error('Error saving character:', err);
    }
  }

  async function deleteCharacter(id: string) {
    if (!confirm('Delete this character?')) return;

    try {
      const response = await fetch('/api/fiction-resources/characters', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        await loadCharacters();
      }
    } catch (err) {
      console.error('Error deleting character:', err);
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'protagonist': return 'deep-gold';
      case 'guide': return 'cosmic-blue';
      case 'supporting': return 'electric-green';
      default: return 'creamy-white';
    }
  };

  return (
    <div className="min-h-screen bg-deep-navy">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/creator/fiction-resources"
            className="text-creamy-white/60 hover:text-creamy-white mb-4 inline-block"
          >
            ← Back to Fiction Resources
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-creamy-white mb-4">
                Character Profiles
              </h1>
              <p className="text-creamy-white/60 text-lg">
                Manage characters for &quot;Future Primitive: Field Reports from Sausalito&quot;
              </p>
            </div>
            <button
              onClick={startAdd}
              className="px-6 py-3 bg-cosmic-blue/20 border border-cosmic-blue rounded-lg text-cosmic-blue hover:bg-cosmic-blue/30 transition-colors font-medium"
            >
              + Add Character
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || editingChar) && (
          <div className="mb-8 bg-deep-navy/80 backdrop-blur-sm rounded-2xl p-6 border border-cosmic-blue/30">
            <h2 className="text-2xl font-bold text-creamy-white mb-6">
              {editingChar ? 'Edit Character' : 'Add New Character'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-creamy-white/80 text-sm mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-deep-navy border border-cosmic-blue/30 rounded-lg text-creamy-white focus:outline-none focus:border-cosmic-blue"
                  placeholder="Character name"
                />
              </div>

              <div>
                <label className="block text-creamy-white/80 text-sm mb-2">Role</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 bg-deep-navy border border-cosmic-blue/30 rounded-lg text-creamy-white focus:outline-none focus:border-cosmic-blue"
                  placeholder="e.g., Codex scholar and field guide"
                />
              </div>

              <div>
                <label className="block text-creamy-white/80 text-sm mb-2">Character Type</label>
                <select
                  value={formData.character_type}
                  onChange={(e) => setFormData({ ...formData, character_type: e.target.value })}
                  className="w-full px-4 py-2 bg-deep-navy border border-cosmic-blue/30 rounded-lg text-creamy-white focus:outline-none focus:border-cosmic-blue"
                >
                  <option value="protagonist">Protagonist</option>
                  <option value="guide">Guide</option>
                  <option value="supporting">Supporting</option>
                  <option value="collective">Collective</option>
                </select>
              </div>

              <div>
                <label className="block text-creamy-white/80 text-sm mb-2">Development Status</label>
                <select
                  value={formData.development_status}
                  onChange={(e) => setFormData({ ...formData, development_status: e.target.value })}
                  className="w-full px-4 py-2 bg-deep-navy border border-cosmic-blue/30 rounded-lg text-creamy-white focus:outline-none focus:border-cosmic-blue"
                >
                  <option value="outlined">Outlined</option>
                  <option value="in_development">In Development</option>
                  <option value="established">Established</option>
                  <option value="complete">Complete</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-creamy-white/80 text-sm mb-2">Character Arc</label>
                <textarea
                  value={formData.arc}
                  onChange={(e) => setFormData({ ...formData, arc: e.target.value })}
                  className="w-full px-4 py-2 bg-deep-navy border border-cosmic-blue/30 rounded-lg text-creamy-white focus:outline-none focus:border-cosmic-blue h-24"
                  placeholder="Describe character arc and development..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-creamy-white/80 text-sm mb-2">Personality Traits (comma-separated)</label>
                <input
                  type="text"
                  value={formData.personality_traits?.join(', ')}
                  onChange={(e) => setFormData({ ...formData, personality_traits: e.target.value.split(',').map(t => t.trim()) })}
                  className="w-full px-4 py-2 bg-deep-navy border border-cosmic-blue/30 rounded-lg text-creamy-white focus:outline-none focus:border-cosmic-blue"
                  placeholder="e.g., wise, clear, teaching, grounded"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-creamy-white/80 text-sm mb-2">Orb Associations (comma-separated numbers)</label>
                <input
                  type="text"
                  value={formData.orb_associations?.join(', ')}
                  onChange={(e) => setFormData({ ...formData, orb_associations: e.target.value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n)) })}
                  className="w-full px-4 py-2 bg-deep-navy border border-cosmic-blue/30 rounded-lg text-creamy-white focus:outline-none focus:border-cosmic-blue"
                  placeholder="e.g., 1, 3, 6, 11"
                />
              </div>

              <div>
                <label className="block text-creamy-white/80 text-sm mb-2">Appearance & Presence</label>
                <textarea
                  value={formData.appearance_notes}
                  onChange={(e) => setFormData({ ...formData, appearance_notes: e.target.value })}
                  className="w-full px-4 py-2 bg-deep-navy border border-cosmic-blue/30 rounded-lg text-creamy-white focus:outline-none focus:border-cosmic-blue h-32"
                  placeholder="Physical appearance and energetic presence..."
                />
              </div>

              <div>
                <label className="block text-creamy-white/80 text-sm mb-2">Backstory</label>
                <textarea
                  value={formData.backstory}
                  onChange={(e) => setFormData({ ...formData, backstory: e.target.value })}
                  className="w-full px-4 py-2 bg-deep-navy border border-cosmic-blue/30 rounded-lg text-creamy-white focus:outline-none focus:border-cosmic-blue h-32"
                  placeholder="Character background and history..."
                />
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={saveCharacter}
                className="px-6 py-3 bg-cosmic-blue border border-cosmic-blue rounded-lg text-white hover:bg-cosmic-blue/80 transition-colors font-medium"
              >
                {editingChar ? 'Save Changes' : 'Create Character'}
              </button>
              <button
                onClick={cancelEdit}
                className="px-6 py-3 bg-deep-navy border border-creamy-white/30 rounded-lg text-creamy-white hover:border-creamy-white transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Characters List */}
        {loading ? (
          <div className="text-center py-12 text-creamy-white/60">Loading characters...</div>
        ) : characters.length === 0 ? (
          <div className="text-center py-12 text-creamy-white/60">No characters found</div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {characters.map((character) => {
              const typeColor = getTypeColor(character.character_type);
              return (
                <div
                  key={character.id}
                  className={`bg-deep-navy/60 backdrop-blur-sm rounded-2xl p-6 border border-${typeColor}/30`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h2 className="text-2xl font-bold text-creamy-white">
                          {character.name}
                        </h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${typeColor}/20 text-${typeColor} border border-${typeColor}/30`}>
                          {character.character_type}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-creamy-white/10 text-creamy-white/60">
                          {character.development_status}
                        </span>
                      </div>
                      <p className="text-cosmic-blue font-medium">{character.role}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEdit(character)}
                        className="px-4 py-2 bg-cosmic-blue/20 border border-cosmic-blue/30 rounded-lg text-cosmic-blue hover:bg-cosmic-blue/30 transition-colors text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCharacter(character.id)}
                        className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Content Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      {/* Arc */}
                      {character.arc && (
                        <div>
                          <h3 className="text-sm font-semibold text-creamy-white/60 mb-2">Character Arc</h3>
                          <p className="text-creamy-white text-sm">{character.arc}</p>
                        </div>
                      )}

                      {/* Personality Traits */}
                      {character.personality_traits && character.personality_traits.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold text-creamy-white/60 mb-2">Personality Traits</h3>
                          <div className="flex flex-wrap gap-2">
                            {character.personality_traits.map((trait, idx) => (
                              <span
                                key={idx}
                                className={`px-3 py-1 rounded-full text-xs bg-${typeColor}/10 text-creamy-white`}
                              >
                                {trait}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Orb Associations */}
                      {character.orb_associations && character.orb_associations.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold text-creamy-white/60 mb-2">Orb Associations</h3>
                          <div className="flex flex-wrap gap-2">
                            {character.orb_associations.map((orb) => (
                              <span
                                key={orb}
                                className="px-2 py-1 rounded bg-cosmic-blue/20 text-cosmic-blue text-xs font-bold"
                              >
                                Orb {orb}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      {/* Appearance */}
                      {character.appearance_notes && (
                        <div>
                          <h3 className="text-sm font-semibold text-creamy-white/60 mb-2">Appearance & Presence</h3>
                          <p className="text-creamy-white/80 text-sm">{character.appearance_notes}</p>
                        </div>
                      )}

                      {/* Backstory */}
                      {character.backstory && (
                        <div>
                          <h3 className="text-sm font-semibold text-creamy-white/60 mb-2">Backstory</h3>
                          <p className="text-creamy-white/80 text-sm">{character.backstory}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
