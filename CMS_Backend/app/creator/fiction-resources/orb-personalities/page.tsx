'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface OrbPersonality {
  id: string;
  orb_number: number;
  orb_name: string;
  archetype: string;
  personality_traits: string[];
  communication_style: string;
  dialogue_patterns: string;
  voice_tone: string;
  interaction_dynamics: string;
  fiction_role: string;
}

export default function OrbPersonalitiesPage() {
  const [orbs, setOrbs] = useState<OrbPersonality[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOrb, setEditingOrb] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<OrbPersonality>>({
    orb_number: 1,
    orb_name: '',
    archetype: '',
    personality_traits: [],
    communication_style: '',
    dialogue_patterns: '',
    voice_tone: '',
    interaction_dynamics: '',
    fiction_role: '',
  });

  useEffect(() => {
    loadOrbs();
  }, []);

  async function loadOrbs() {
    try {
      const response = await fetch('/api/fiction-resources/orb-personalities');
      const data = await response.json();
      setOrbs(data.orb_personalities || []);
    } catch (err) {
      console.error('Error loading orb personalities:', err);
    } finally {
      setLoading(false);
    }
  }

  function startEdit(orb: OrbPersonality) {
    setEditingOrb(orb.id);
    setFormData(orb);
    setShowAddForm(false);
  }

  function startAdd() {
    setShowAddForm(true);
    setEditingOrb(null);
    setFormData({
      orb_number: 1,
      orb_name: '',
      archetype: '',
      personality_traits: [],
      communication_style: '',
      dialogue_patterns: '',
      voice_tone: '',
      interaction_dynamics: '',
      fiction_role: '',
    });
  }

  function cancelEdit() {
    setEditingOrb(null);
    setShowAddForm(false);
    setFormData({
      orb_number: 1,
      orb_name: '',
      archetype: '',
      personality_traits: [],
      communication_style: '',
      dialogue_patterns: '',
      voice_tone: '',
      interaction_dynamics: '',
      fiction_role: '',
    });
  }

  async function saveOrb() {
    try {
      const method = editingOrb ? 'PUT' : 'POST';
      const url = '/api/fiction-resources/orb-personalities';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingOrb ? { id: editingOrb, ...formData } : formData),
      });

      if (response.ok) {
        await loadOrbs();
        cancelEdit();
      }
    } catch (err) {
      console.error('Error saving orb:', err);
    }
  }

  async function deleteOrb(id: string) {
    if (!confirm('Delete this Orb personality?')) return;

    try {
      const response = await fetch('/api/fiction-resources/orb-personalities', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        await loadOrbs();
      }
    } catch (err) {
      console.error('Error deleting orb:', err);
    }
  }

  const getOrbColor = (orbNum: number) => {
    if (orbNum <= 4) return 'deep-gold';
    if (orbNum <= 8) return 'cosmic-blue';
    if (orbNum <= 12) return 'electric-green';
    return 'creamy-white';
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
                Orb Personalities
              </h1>
              <p className="text-creamy-white/60 text-lg">
                The 13 Orbs as living intelligence in &quot;Future Primitive&quot;
              </p>
            </div>
            <button
              onClick={startAdd}
              className="px-6 py-3 bg-cosmic-blue/20 border border-cosmic-blue rounded-lg text-cosmic-blue hover:bg-cosmic-blue/30 transition-colors font-medium"
            >
              + Add Orb Personality
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || editingOrb) && (
          <div className="mb-8 bg-deep-navy/80 backdrop-blur-sm rounded-2xl p-6 border border-cosmic-blue/30">
            <h2 className="text-2xl font-bold text-creamy-white mb-6">
              {editingOrb ? 'Edit Orb Personality' : 'Add New Orb Personality'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-creamy-white/80 text-sm mb-2">Orb Number (1-13)</label>
                <input
                  type="number"
                  min="1"
                  max="13"
                  value={formData.orb_number}
                  onChange={(e) => setFormData({ ...formData, orb_number: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-deep-navy border border-cosmic-blue/30 rounded-lg text-creamy-white focus:outline-none focus:border-cosmic-blue"
                />
              </div>

              <div>
                <label className="block text-creamy-white/80 text-sm mb-2">Orb Name</label>
                <input
                  type="text"
                  value={formData.orb_name}
                  onChange={(e) => setFormData({ ...formData, orb_name: e.target.value })}
                  className="w-full px-4 py-2 bg-deep-navy border border-cosmic-blue/30 rounded-lg text-creamy-white focus:outline-none focus:border-cosmic-blue"
                  placeholder="e.g., Origin Intelligence"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-creamy-white/80 text-sm mb-2">Archetype</label>
                <input
                  type="text"
                  value={formData.archetype}
                  onChange={(e) => setFormData({ ...formData, archetype: e.target.value })}
                  className="w-full px-4 py-2 bg-deep-navy border border-cosmic-blue/30 rounded-lg text-creamy-white focus:outline-none focus:border-cosmic-blue"
                  placeholder="e.g., The Seeker / The Witness"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-creamy-white/80 text-sm mb-2">Personality Traits (comma-separated)</label>
                <input
                  type="text"
                  value={formData.personality_traits?.join(', ')}
                  onChange={(e) => setFormData({ ...formData, personality_traits: e.target.value.split(',').map(t => t.trim()) })}
                  className="w-full px-4 py-2 bg-deep-navy border border-cosmic-blue/30 rounded-lg text-creamy-white focus:outline-none focus:border-cosmic-blue"
                  placeholder="e.g., curious, open, vulnerable, authentic"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-creamy-white/80 text-sm mb-2">Communication Style</label>
                <textarea
                  value={formData.communication_style}
                  onChange={(e) => setFormData({ ...formData, communication_style: e.target.value })}
                  className="w-full px-4 py-2 bg-deep-navy border border-cosmic-blue/30 rounded-lg text-creamy-white focus:outline-none focus:border-cosmic-blue h-24"
                  placeholder="Describe how this Orb communicates..."
                />
              </div>

              <div>
                <label className="block text-creamy-white/80 text-sm mb-2">Voice Tone</label>
                <textarea
                  value={formData.voice_tone}
                  onChange={(e) => setFormData({ ...formData, voice_tone: e.target.value })}
                  className="w-full px-4 py-2 bg-deep-navy border border-cosmic-blue/30 rounded-lg text-creamy-white focus:outline-none focus:border-cosmic-blue h-24"
                  placeholder="Describe the voice tone..."
                />
              </div>

              <div>
                <label className="block text-creamy-white/80 text-sm mb-2">Dialogue Patterns</label>
                <textarea
                  value={formData.dialogue_patterns}
                  onChange={(e) => setFormData({ ...formData, dialogue_patterns: e.target.value })}
                  className="w-full px-4 py-2 bg-deep-navy border border-cosmic-blue/30 rounded-lg text-creamy-white focus:outline-none focus:border-cosmic-blue h-24"
                  placeholder="Describe typical dialogue patterns..."
                />
              </div>

              <div>
                <label className="block text-creamy-white/80 text-sm mb-2">Interaction Dynamics</label>
                <textarea
                  value={formData.interaction_dynamics}
                  onChange={(e) => setFormData({ ...formData, interaction_dynamics: e.target.value })}
                  className="w-full px-4 py-2 bg-deep-navy border border-cosmic-blue/30 rounded-lg text-creamy-white focus:outline-none focus:border-cosmic-blue h-24"
                  placeholder="How this Orb interacts with others..."
                />
              </div>

              <div>
                <label className="block text-creamy-white/80 text-sm mb-2">Fiction Role</label>
                <textarea
                  value={formData.fiction_role}
                  onChange={(e) => setFormData({ ...formData, fiction_role: e.target.value })}
                  className="w-full px-4 py-2 bg-deep-navy border border-cosmic-blue/30 rounded-lg text-creamy-white focus:outline-none focus:border-cosmic-blue h-24"
                  placeholder="Role in the fiction narrative..."
                />
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={saveOrb}
                className="px-6 py-3 bg-cosmic-blue border border-cosmic-blue rounded-lg text-white hover:bg-cosmic-blue/80 transition-colors font-medium"
              >
                {editingOrb ? 'Save Changes' : 'Create Orb Personality'}
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

        {/* Orbs List */}
        {loading ? (
          <div className="text-center py-12 text-creamy-white/60">Loading orb personalities...</div>
        ) : orbs.length === 0 ? (
          <div className="text-center py-12 text-creamy-white/60">No orb personalities found</div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {orbs.map((orb) => {
              const orbColor = getOrbColor(orb.orb_number);
              return (
                <div
                  key={orb.id}
                  className={`bg-deep-navy/60 backdrop-blur-sm rounded-2xl p-6 border border-${orbColor}/30`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-10 h-10 rounded-full bg-${orbColor}/20 border-2 border-${orbColor} flex items-center justify-center`}>
                          <span className={`text-${orbColor} font-bold`}>{orb.orb_number}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-creamy-white">
                          {orb.orb_name}
                        </h2>
                      </div>
                      <p className={`text-${orbColor} font-medium text-sm`}>{orb.archetype}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEdit(orb)}
                        className="px-4 py-2 bg-cosmic-blue/20 border border-cosmic-blue/30 rounded-lg text-cosmic-blue hover:bg-cosmic-blue/30 transition-colors text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteOrb(orb.id)}
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
                      {/* Personality Traits */}
                      {orb.personality_traits && orb.personality_traits.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold text-creamy-white/60 mb-2">Personality Traits</h3>
                          <div className="flex flex-wrap gap-2">
                            {orb.personality_traits.map((trait, idx) => (
                              <span
                                key={idx}
                                className={`px-3 py-1 rounded-full text-xs bg-${orbColor}/10 text-creamy-white`}
                              >
                                {trait}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Communication Style */}
                      {orb.communication_style && (
                        <div>
                          <h3 className="text-sm font-semibold text-creamy-white/60 mb-2">Communication Style</h3>
                          <p className="text-creamy-white/80 text-sm">{orb.communication_style}</p>
                        </div>
                      )}

                      {/* Voice Tone */}
                      {orb.voice_tone && (
                        <div>
                          <h3 className="text-sm font-semibold text-creamy-white/60 mb-2">Voice Tone</h3>
                          <p className="text-creamy-white/80 text-sm">{orb.voice_tone}</p>
                        </div>
                      )}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      {/* Dialogue Patterns */}
                      {orb.dialogue_patterns && (
                        <div>
                          <h3 className="text-sm font-semibold text-creamy-white/60 mb-2">Dialogue Patterns</h3>
                          <p className="text-creamy-white/80 text-sm">{orb.dialogue_patterns}</p>
                        </div>
                      )}

                      {/* Interaction Dynamics */}
                      {orb.interaction_dynamics && (
                        <div>
                          <h3 className="text-sm font-semibold text-creamy-white/60 mb-2">Interaction Dynamics</h3>
                          <p className="text-creamy-white/80 text-sm">{orb.interaction_dynamics}</p>
                        </div>
                      )}

                      {/* Fiction Role */}
                      {orb.fiction_role && (
                        <div>
                          <h3 className="text-sm font-semibold text-creamy-white/60 mb-2">Fiction Role</h3>
                          <p className="text-creamy-white/80 text-sm">{orb.fiction_role}</p>
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
