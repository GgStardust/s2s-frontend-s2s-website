'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Location {
  id: string;
  name: string;
  description: string;
  atmospheric_qualities: string;
  field_properties: string;
  appearance_status: string;
  orb_associations: number[];
  story_significance: string;
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLoc, setEditingLoc] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Location>>({
    name: '',
    description: '',
    atmospheric_qualities: '',
    field_properties: '',
    appearance_status: 'mentioned',
    orb_associations: [],
    story_significance: '',
  });

  useEffect(() => {
    loadLocations();
  }, []);

  async function loadLocations() {
    try {
      const response = await fetch('/api/fiction-resources/locations');
      const data = await response.json();
      setLocations(data.locations || []);
    } catch (err) {
      console.error('Error loading locations:', err);
    } finally {
      setLoading(false);
    }
  }

  function startEdit(location: Location) {
    setEditingLoc(location.id);
    setFormData(location);
    setShowAddForm(false);
  }

  function startAdd() {
    setShowAddForm(true);
    setEditingLoc(null);
    setFormData({
      name: '',
      description: '',
      atmospheric_qualities: '',
      field_properties: '',
      appearance_status: 'mentioned',
      orb_associations: [],
      story_significance: '',
    });
  }

  function cancelEdit() {
    setEditingLoc(null);
    setShowAddForm(false);
  }

  async function saveLocation() {
    try {
      const method = editingLoc ? 'PUT' : 'POST';
      const response = await fetch('/api/fiction-resources/locations', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingLoc ? { id: editingLoc, ...formData } : formData),
      });

      if (response.ok) {
        await loadLocations();
        cancelEdit();
      }
    } catch (err) {
      console.error('Error saving location:', err);
    }
  }

  async function deleteLocation(id: string) {
    if (!confirm('Delete this location?')) return;

    try {
      const response = await fetch('/api/fiction-resources/locations', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        await loadLocations();
      }
    } catch (err) {
      console.error('Error deleting location:', err);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'featured': return 'deep-gold';
      case 'recurring': return 'cosmic-blue';
      case 'mentioned': return 'electric-green';
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
                Sausalito Locations
              </h1>
              <p className="text-creamy-white/60 text-lg">
                Field-activated locations in &quot;Future Primitive: Field Reports from Sausalito&quot;
              </p>
            </div>
            <button
              onClick={startAdd}
              className="px-6 py-3 bg-electric-green/20 border border-electric-green rounded-lg text-electric-green hover:bg-electric-green/30 transition-colors font-medium"
            >
              + Add Location
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || editingLoc) && (
          <div className="mb-8 bg-deep-navy/80 backdrop-blur-sm rounded-2xl p-6 border border-electric-green/30">
            <h2 className="text-2xl font-bold text-creamy-white mb-6">
              {editingLoc ? 'Edit Location' : 'Add New Location'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-creamy-white/80 text-sm mb-2">Location Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-deep-navy border border-electric-green/30 rounded-lg text-creamy-white focus:outline-none focus:border-electric-green"
                  placeholder="e.g., Boardwalk"
                />
              </div>

              <div>
                <label className="block text-creamy-white/80 text-sm mb-2">Appearance Status</label>
                <select
                  value={formData.appearance_status}
                  onChange={(e) => setFormData({ ...formData, appearance_status: e.target.value })}
                  className="w-full px-4 py-2 bg-deep-navy border border-electric-green/30 rounded-lg text-creamy-white focus:outline-none focus:border-electric-green"
                >
                  <option value="featured">Featured</option>
                  <option value="recurring">Recurring</option>
                  <option value="mentioned">Mentioned</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-creamy-white/80 text-sm mb-2">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-deep-navy border border-electric-green/30 rounded-lg text-creamy-white focus:outline-none focus:border-electric-green"
                  placeholder="Brief description of the location"
                />
              </div>

              <div>
                <label className="block text-creamy-white/80 text-sm mb-2">Atmospheric Qualities</label>
                <textarea
                  value={formData.atmospheric_qualities}
                  onChange={(e) => setFormData({ ...formData, atmospheric_qualities: e.target.value })}
                  className="w-full px-4 py-2 bg-deep-navy border border-electric-green/30 rounded-lg text-creamy-white focus:outline-none focus:border-electric-green h-32"
                  placeholder="Atmosphere, mood, feeling of the location..."
                />
              </div>

              <div>
                <label className="block text-creamy-white/80 text-sm mb-2">Field Properties</label>
                <textarea
                  value={formData.field_properties}
                  onChange={(e) => setFormData({ ...formData, field_properties: e.target.value })}
                  className="w-full px-4 py-2 bg-deep-navy border border-electric-green/30 rounded-lg text-creamy-white focus:outline-none focus:border-electric-green h-32"
                  placeholder="Field activation qualities..."
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

              <div className="md:col-span-2">
                <label className="block text-creamy-white/80 text-sm mb-2">Story Significance</label>
                <textarea
                  value={formData.story_significance}
                  onChange={(e) => setFormData({ ...formData, story_significance: e.target.value })}
                  className="w-full px-4 py-2 bg-deep-navy border border-electric-green/30 rounded-lg text-creamy-white focus:outline-none focus:border-electric-green h-24"
                  placeholder="Role and significance in the story..."
                />
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={saveLocation}
                className="px-6 py-3 bg-electric-green border border-electric-green rounded-lg text-white hover:bg-electric-green/80 transition-colors font-medium"
              >
                {editingLoc ? 'Save Changes' : 'Create Location'}
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

        {/* Locations List */}
        {loading ? (
          <div className="text-center py-12 text-creamy-white/60">Loading locations...</div>
        ) : locations.length === 0 ? (
          <div className="text-center py-12 text-creamy-white/60">No locations found</div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {locations.map((location) => {
              const statusColor = getStatusColor(location.appearance_status);
              return (
                <div
                  key={location.id}
                  className={`bg-deep-navy/60 backdrop-blur-sm rounded-2xl p-6 border border-${statusColor}/30`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h2 className="text-2xl font-bold text-creamy-white">
                          {location.name}
                        </h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${statusColor}/20 text-${statusColor} border border-${statusColor}/30`}>
                          {location.appearance_status}
                        </span>
                      </div>
                      <p className="text-cosmic-blue font-medium text-sm">{location.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEdit(location)}
                        className="px-4 py-2 bg-electric-green/20 border border-electric-green/30 rounded-lg text-electric-green hover:bg-electric-green/30 transition-colors text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteLocation(location.id)}
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
                      {/* Atmospheric Qualities */}
                      {location.atmospheric_qualities && (
                        <div>
                          <h3 className="text-sm font-semibold text-creamy-white/60 mb-2">Atmospheric Qualities</h3>
                          <p className="text-creamy-white/80 text-sm">{location.atmospheric_qualities}</p>
                        </div>
                      )}

                      {/* Field Properties */}
                      {location.field_properties && (
                        <div>
                          <h3 className="text-sm font-semibold text-creamy-white/60 mb-2">Field Properties</h3>
                          <p className="text-creamy-white/80 text-sm">{location.field_properties}</p>
                        </div>
                      )}

                      {/* Orb Associations */}
                      {location.orb_associations && location.orb_associations.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold text-creamy-white/60 mb-2">Orb Associations</h3>
                          <div className="flex flex-wrap gap-2">
                            {location.orb_associations.map((orb) => (
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
                      {/* Story Significance */}
                      {location.story_significance && (
                        <div>
                          <h3 className="text-sm font-semibold text-creamy-white/60 mb-2">Story Significance</h3>
                          <p className="text-creamy-white/80 text-sm">{location.story_significance}</p>
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
