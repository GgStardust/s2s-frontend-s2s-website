'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface WildlifeObservation {
  id: string;
  species: string;
  common_name: string;
  observed_behaviors: string;
  field_activation_notes: string;
  symbolic_function: string;
  orb_associations: number[];
  story_integration: string;
}

export default function WildlifePage() {
  const [wildlife, setWildlife] = useState<WildlifeObservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingWild, setEditingWild] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<WildlifeObservation>>({
    species: '',
    common_name: '',
    observed_behaviors: '',
    field_activation_notes: '',
    symbolic_function: '',
    orb_associations: [],
    story_integration: '',
  });

  useEffect(() => {
    loadWildlife();
  }, []);

  async function loadWildlife() {
    try {
      const response = await fetch('/api/fiction-resources/wildlife');
      const data = await response.json();
      setWildlife(data.wildlife || []);
    } catch (err) {
      console.error('Error loading wildlife:', err);
    } finally {
      setLoading(false);
    }
  }

  function startEdit(observation: WildlifeObservation) {
    setEditingWild(observation.id);
    setFormData(observation);
    setShowAddForm(false);
  }

  function startAdd() {
    setShowAddForm(true);
    setEditingWild(null);
    setFormData({
      species: '',
      common_name: '',
      observed_behaviors: '',
      field_activation_notes: '',
      symbolic_function: '',
      orb_associations: [],
      story_integration: '',
    });
  }

  function cancelEdit() {
    setEditingWild(null);
    setShowAddForm(false);
  }

  async function saveWildlife() {
    try {
      const method = editingWild ? 'PUT' : 'POST';
      const response = await fetch('/api/fiction-resources/wildlife', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingWild ? { id: editingWild, ...formData } : formData),
      });

      if (response.ok) {
        await loadWildlife();
        cancelEdit();
      }
    } catch (err) {
      console.error('Error saving wildlife:', err);
    }
  }

  async function deleteWildlife(id: string) {
    if (!confirm('Delete this wildlife observation?')) return;

    try {
      const response = await fetch('/api/fiction-resources/wildlife', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        await loadWildlife();
      }
    } catch (err) {
      console.error('Error deleting wildlife:', err);
    }
  }

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
                Wildlife Observations
              </h1>
              <p className="text-creamy-white/60 text-lg">
                Wildlife as transmission nodes in &quot;Future Primitive&quot;
              </p>
            </div>
            <button
              onClick={startAdd}
              className="px-6 py-3 bg-electric-green/20 border border-electric-green rounded-lg text-electric-green hover:bg-electric-green/30 transition-colors font-medium"
            >
              + Add Wildlife Observation
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || editingWild) && (
          <div className="mb-8 bg-deep-navy/80 backdrop-blur-sm rounded-2xl p-6 border border-electric-green/30">
            <h2 className="text-2xl font-bold text-creamy-white mb-6">
              {editingWild ? 'Edit Wildlife Observation' : 'Add New Wildlife Observation'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-creamy-white/80 text-sm mb-2">Common Name</label>
                <input
                  type="text"
                  value={formData.common_name}
                  onChange={(e) => setFormData({ ...formData, common_name: e.target.value })}
                  className="w-full px-4 py-2 bg-deep-navy border border-electric-green/30 rounded-lg text-creamy-white focus:outline-none focus:border-electric-green"
                  placeholder="e.g., Sea Lions"
                />
              </div>

              <div>
                <label className="block text-creamy-white/80 text-sm mb-2">Species</label>
                <input
                  type="text"
                  value={formData.species}
                  onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                  className="w-full px-4 py-2 bg-deep-navy border border-electric-green/30 rounded-lg text-creamy-white focus:outline-none focus:border-electric-green"
                  placeholder="e.g., Zalophus californianus"
                />
              </div>

              <div>
                <label className="block text-creamy-white/80 text-sm mb-2">Observed Behaviors</label>
                <textarea
                  value={formData.observed_behaviors}
                  onChange={(e) => setFormData({ ...formData, observed_behaviors: e.target.value })}
                  className="w-full px-4 py-2 bg-deep-navy border border-electric-green/30 rounded-lg text-creamy-white focus:outline-none focus:border-electric-green h-32"
                  placeholder="Describe observed behaviors..."
                />
              </div>

              <div>
                <label className="block text-creamy-white/80 text-sm mb-2">Field Activation Notes</label>
                <textarea
                  value={formData.field_activation_notes}
                  onChange={(e) => setFormData({ ...formData, field_activation_notes: e.target.value })}
                  className="w-full px-4 py-2 bg-deep-navy border border-electric-green/30 rounded-lg text-creamy-white focus:outline-none focus:border-electric-green h-32"
                  placeholder="Field activation and transmission notes..."
                />
              </div>

              <div>
                <label className="block text-creamy-white/80 text-sm mb-2">Symbolic Function</label>
                <textarea
                  value={formData.symbolic_function}
                  onChange={(e) => setFormData({ ...formData, symbolic_function: e.target.value })}
                  className="w-full px-4 py-2 bg-deep-navy border border-electric-green/30 rounded-lg text-creamy-white focus:outline-none focus:border-electric-green h-32"
                  placeholder="Symbolic meaning and function..."
                />
              </div>

              <div>
                <label className="block text-creamy-white/80 text-sm mb-2">Story Integration</label>
                <textarea
                  value={formData.story_integration}
                  onChange={(e) => setFormData({ ...formData, story_integration: e.target.value })}
                  className="w-full px-4 py-2 bg-deep-navy border border-electric-green/30 rounded-lg text-creamy-white focus:outline-none focus:border-electric-green h-32"
                  placeholder="How this integrates into the story..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-creamy-white/80 text-sm mb-2">Orb Associations (comma-separated numbers)</label>
                <input
                  type="text"
                  value={formData.orb_associations?.join(', ')}
                  onChange={(e) => setFormData({ ...formData, orb_associations: e.target.value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n)) })}
                  className="w-full px-4 py-2 bg-deep-navy border border-electric-green/30 rounded-lg text-creamy-white focus:outline-none focus:border-electric-green"
                  placeholder="e.g., 1, 3, 6, 11"
                />
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={saveWildlife}
                className="px-6 py-3 bg-electric-green border border-electric-green rounded-lg text-white hover:bg-electric-green/80 transition-colors font-medium"
              >
                {editingWild ? 'Save Changes' : 'Create Wildlife Observation'}
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

        {/* Wildlife List */}
        {loading ? (
          <div className="text-center py-12 text-creamy-white/60">Loading wildlife observations...</div>
        ) : wildlife.length === 0 ? (
          <div className="text-center py-12 text-creamy-white/60">No wildlife observations found</div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {wildlife.map((observation) => (
              <div
                key={observation.id}
                className="bg-deep-navy/60 backdrop-blur-sm rounded-2xl p-6 border border-electric-green/30"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h2 className="text-2xl font-bold text-creamy-white">
                        {observation.common_name}
                      </h2>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-electric-green/20 text-electric-green border border-electric-green/30">
                        {observation.species}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEdit(observation)}
                      className="px-4 py-2 bg-electric-green/20 border border-electric-green/30 rounded-lg text-electric-green hover:bg-electric-green/30 transition-colors text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteWildlife(observation.id)}
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
                    {/* Observed Behaviors */}
                    {observation.observed_behaviors && (
                      <div>
                        <h3 className="text-sm font-semibold text-creamy-white/60 mb-2">Observed Behaviors</h3>
                        <p className="text-creamy-white/80 text-sm">{observation.observed_behaviors}</p>
                      </div>
                    )}

                    {/* Field Activation Notes */}
                    {observation.field_activation_notes && (
                      <div>
                        <h3 className="text-sm font-semibold text-creamy-white/60 mb-2">Field Activation Notes</h3>
                        <p className="text-creamy-white/80 text-sm">{observation.field_activation_notes}</p>
                      </div>
                    )}

                    {/* Orb Associations */}
                    {observation.orb_associations && observation.orb_associations.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-creamy-white/60 mb-2">Orb Associations</h3>
                        <div className="flex flex-wrap gap-2">
                          {observation.orb_associations.map((orb) => (
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
                    {/* Symbolic Function */}
                    {observation.symbolic_function && (
                      <div>
                        <h3 className="text-sm font-semibold text-creamy-white/60 mb-2">Symbolic Function</h3>
                        <p className="text-creamy-white/80 text-sm">{observation.symbolic_function}</p>
                      </div>
                    )}

                    {/* Story Integration */}
                    {observation.story_integration && (
                      <div>
                        <h3 className="text-sm font-semibold text-creamy-white/60 mb-2">Story Integration</h3>
                        <p className="text-creamy-white/80 text-sm">{observation.story_integration}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
