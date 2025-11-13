'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Button } from '@/components/backend/Button';
import { Card, CardGrid } from '@/components/backend/Card';
import { Input, Textarea } from '@/components/backend/Input';
import { PageHeader } from '@/components/backend/Layout';

interface Scrollstream {
  id: string;
  content: string;
  source_file_id: string;
  orb_associations: string[];
  tags: string[];
  status: string;
  created_at: string;
  published_to_instagram: boolean;
  published_to_linkedin: boolean;
}

export default function ScrollstreamsPage() {
  const [scrollstreams, setScrollstreams] = useState<Scrollstream[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterOrb, setFilterOrb] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editOrbs, setEditOrbs] = useState<number[]>([]);
  const [publishToSocial, setPublishToSocial] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [updateSourceFile, setUpdateSourceFile] = useState(false); // default unchecked
  const [publishedMap, setPublishedMap] = useState<Record<string, string[]>>({}); // id -> platforms
  const [editedTextMap, setEditedTextMap] = useState<Record<string, string>>({}); // id -> edited text

  useEffect(() => {
    // Apply default filters from URL if present
    try {
      const sp = new URLSearchParams(window.location.search);
      const qs = sp.get('q');
      const st = sp.get('status');
      const ob = sp.get('orb');
      if (qs) setSearchQuery(qs);
      if (st) setFilterStatus(st);
      if (ob && !Number.isNaN(Number(ob))) setFilterOrb(Number(ob));

      // Load persisted publish/edit state
      const storedPublished = localStorage.getItem('scrollstreams_published_map');
      const storedEdits = localStorage.getItem('scrollstreams_edited_text_map');
      if (storedPublished) setPublishedMap(JSON.parse(storedPublished));
      if (storedEdits) setEditedTextMap(JSON.parse(storedEdits));
    } catch {}
    loadScrollstreams();
  }, []);

  // Refetch when orb filter changes to leverage server-side narrowing by orb
  useEffect(() => {
    // Skip initial re-fetch if still loading initial data
    if (!loading) {
      loadScrollstreams();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterOrb]);

  async function loadScrollstreams() {
    try {
      // Hydrate from content library via scrollstream extraction API (hundreds expected)
      const params = new URLSearchParams({ limit: '1000' });
      if (filterOrb) params.set('orb', String(filterOrb));
      const response = await fetch(`/api/scrollstreams/resonance?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to load scrollstreams from content library');
      const data = await response.json();
      const items = (data?.items || []) as any[];

      const normalized: Scrollstream[] = items.map((it: any) => ({
        id: it.id,
        content: it.content,
        source_file_id: it.file_id,
        orb_associations: (it.orb_associations || []).map((n: number | string) => String(n)),
        tags: it.tags || [],
        status: it.status || 'unknown',
        created_at: it.created_at || '',
        published_to_instagram: false,
        published_to_linkedin: false,
      }));

      setScrollstreams(normalized);
    } catch (error) {
      console.error('Error loading content-library scrollstreams:', error);
      setScrollstreams([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredScrollstreams = scrollstreams.filter(scroll => {
    const matchesSearch = scroll.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || scroll.status === filterStatus;
    const matchesOrb = !filterOrb || scroll.orb_associations.includes(String(filterOrb));

    return matchesSearch && matchesStatus && matchesOrb;
  });

  // Keep URL in sync with filters for easy sharing/reloading
  useEffect(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      if (searchQuery) sp.set('q', searchQuery); else sp.delete('q');
      if (filterStatus && filterStatus !== 'all') sp.set('status', filterStatus); else sp.delete('status');
      if (filterOrb) sp.set('orb', String(filterOrb)); else sp.delete('orb');
      const qs = sp.toString();
      const url = qs ? `?${qs}` : window.location.pathname;
      window.history.replaceState(null, '', url);
    } catch {}
  }, [searchQuery, filterStatus, filterOrb]);

  // Persist publish/edit state
  useEffect(() => {
    try {
      localStorage.setItem('scrollstreams_published_map', JSON.stringify(publishedMap));
      localStorage.setItem('scrollstreams_edited_text_map', JSON.stringify(editedTextMap));
    } catch {}
  }, [publishedMap, editedTextMap]);

  function openEdit(scroll: Scrollstream) {
    setEditingId(scroll.id);
    setEditText(editedTextMap[scroll.id] ?? scroll.content);
    // convert orb strings -> numbers safely
    const nums = (scroll.orb_associations || [])
      .map((s) => Number(s))
      .filter((n) => !Number.isNaN(n) && n >= 1 && n <= 13);
    setEditOrbs(nums);
    setPublishToSocial(false);
    setSelectedPlatforms([]);
    setUpdateSourceFile(false);
    setEditOpen(true);
  }

  function toggleEditOrb(orb: number) {
    if (editOrbs.includes(orb)) setEditOrbs(editOrbs.filter((o) => o !== orb));
    else setEditOrbs([...editOrbs, orb]);
  }

  function togglePlatform(value: string) {
    if (selectedPlatforms.includes(value)) {
      setSelectedPlatforms(selectedPlatforms.filter((v) => v !== value));
    } else {
      setSelectedPlatforms([...selectedPlatforms, value]);
    }
  }

  function handlePublish() {
    if (!editingId) return;
    // Save current edit to local override
    setEditedTextMap({ ...editedTextMap, [editingId]: editText });
    // Local tracking only (manual posting flow). Later we can wire API calls.
    if (publishToSocial) {
      const existing = publishedMap[editingId] || [];
      const merged = Array.from(new Set([...existing, ...selectedPlatforms]));
      setPublishedMap({ ...publishedMap, [editingId]: merged });
    }
    // Optional: persist orb changes back to source file via API if requested
    if (updateSourceFile) {
      const fileId = scrollstreams.find(s => s.id === editingId)?.source_file_id;
      if (fileId) {
        fetch('/api/content-files/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: fileId, orb_associations: editOrbs }),
        }).catch(() => {});
      }
    }
    setEditOpen(false);
  }

  function handleSaveOnly() {
    if (!editingId) return;
    setEditedTextMap({ ...editedTextMap, [editingId]: editText });
    if (updateSourceFile) {
      const fileId = scrollstreams.find(s => s.id === editingId)?.source_file_id;
      if (fileId) {
        fetch('/api/content-files/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: fileId, orb_associations: editOrbs }),
        }).catch(() => {});
      }
    }
    setEditOpen(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-backend-secondary flex items-center justify-center">
        <div className="text-backend-primary text-2xl">Loading scrollstreams...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-backend-secondary">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-backend-secondary hover:text-backend-primary mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <PageHeader
            title="Scrollstream Manager"
            subtitle={`${scrollstreams.length} scrollstreams extracted from content files`}
          />
        </div>

        {/* Quick Capture removed by request; page is view/filter only */}

        {/* Filters */}
        <Card title="Filters" className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <Input
              label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scrollstream content..."
            />

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-backend-primary mb-1.5">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-backend-default rounded-md text-backend-primary focus:outline-none focus:ring-2 focus:ring-backend-focus"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>

            {/* Orb Filter */}
            <div>
              <label className="block text-sm font-medium text-backend-primary mb-1.5">Orb Association</label>
              <select
                value={filterOrb || ''}
                onChange={(e) => setFilterOrb(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 bg-white border border-backend-default rounded-md text-backend-primary focus:outline-none focus:ring-2 focus:ring-backend-focus"
              >
                <option value="">All Orbs</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(orb => (
                  <option key={orb} value={orb}>Orb {orb}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Results Count */}
        <div className="mb-6 text-backend-secondary">
          Showing {filteredScrollstreams.length} of {scrollstreams.length} scrollstreams
        </div>

        {/* Scrollstream Grid */}
        <CardGrid columns={3}>
          {filteredScrollstreams.map(scroll => (
            <Card key={scroll.id} className="hover:shadow-lg transition-shadow">
              {/* Full Content */}
              <div className="mb-4">
                <p className="text-backend-primary text-sm leading-relaxed whitespace-pre-line">{editedTextMap[scroll.id] ?? scroll.content}</p>
              </div>

              {/* Minimal indicators */}
              {publishedMap[scroll.id] !== undefined && (
                <div className="mb-3 text-xs text-backend-secondary">
                  {publishedMap[scroll.id].length > 0
                    ? `Published to: ${publishedMap[scroll.id].join(', ')}`
                    : 'Published'}
                </div>
              )}

              {/* Social Media Status */}
              <div className="mb-4" />

              {/* Actions */}
              <div className="flex space-x-2">
                <Link href={`/creator/library/${scroll.source_file_id}`} className="w-full">
                  <Button variant="secondary" size="sm" fullWidth>
                    View
                  </Button>
                </Link>
                <Button variant="secondary" size="sm" fullWidth onClick={() => openEdit(scroll)}>
                  Edit
                </Button>
                <Button variant="primary" size="sm" fullWidth onClick={() => openEdit(scroll)}>
                  Publish
                </Button>
              </div>
            </Card>
          ))}
        </CardGrid>

        {filteredScrollstreams.length === 0 && (
          <div className="text-center py-20">
            <p className="text-backend-secondary text-xl">No scrollstreams match your filters</p>
          </div>
        )}

        {/* Edit Modal */}
        <EditModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          text={editText}
          setText={setEditText}
          orbs={editOrbs}
          toggleOrb={toggleEditOrb}
          publishToSocial={publishToSocial}
          setPublishToSocial={setPublishToSocial}
          selectedPlatforms={selectedPlatforms}
          togglePlatform={togglePlatform}
          updateSourceFile={updateSourceFile}
          setUpdateSourceFile={setUpdateSourceFile}
          onPublish={handlePublish}
          onSaveOnly={handleSaveOnly}
        />
      </div>
    </div>
  );
}

function PlatformMultiSelect({ value, onChange }: { value: string[]; onChange: (v: string) => void }) {
  const platforms = [
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'medium', label: 'Medium' },
    { id: 'threads', label: 'Threads' },
    { id: 'bluesky', label: 'Bluesky' },
    { id: 'mastodon', label: 'Mastodon' },
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {platforms.map(p => (
        <button
          key={p.id}
          onClick={() => onChange(p.id)}
          className={`px-3 py-1.5 rounded border text-sm transition ${
            value.includes(p.id)
              ? 'bg-backend-primary border-backend-primary text-white'
              : 'bg-white border-backend-default text-backend-primary hover:border-backend-hover'
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

function EditModal({
  open,
  onClose,
  text,
  setText,
  orbs,
  toggleOrb,
  publishToSocial,
  setPublishToSocial,
  selectedPlatforms,
  togglePlatform,
  updateSourceFile,
  setUpdateSourceFile,
  onPublish,
  onSaveOnly,
}: {
  open: boolean;
  onClose: () => void;
  text: string;
  setText: (v: string) => void;
  orbs: number[];
  toggleOrb: (o: number) => void;
  publishToSocial: boolean;
  setPublishToSocial: (v: boolean) => void;
  selectedPlatforms: string[];
  togglePlatform: (id: string) => void;
  updateSourceFile: boolean;
  setUpdateSourceFile: (v: boolean) => void;
  onPublish: () => void;
  onSaveOnly: () => void;
}) {
  if (!open) return null;
  const charCount = text.length;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg border border-backend-default shadow-xl p-6">
        <h3 className="text-lg font-semibold text-backend-primary mb-4">Edit & Publish</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-backend-primary mb-1.5">Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 bg-white border border-backend-default rounded-md text-backend-primary focus:outline-none focus:ring-2 focus:ring-backend-focus"
          />
          <div className={`text-xs mt-1 ${charCount > 280 ? 'text-yellow-600' : 'text-backend-secondary'}`}>{charCount} characters</div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-backend-primary mb-1.5">Orbs</label>
          <div className="flex flex-wrap gap-2">
            {[1,2,3,4,5,6,7,8,9,10,11,12,13].map((o) => (
              <button
                key={o}
                onClick={() => toggleOrb(o)}
                className={`w-9 h-9 rounded-full border-2 text-sm font-bold ${
                  orbs.includes(o)
                    ? 'bg-backend-primary border-backend-primary text-white'
                    : 'bg-white border-backend-default text-backend-primary hover:border-backend-hover'
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="inline-flex items-center gap-2 text-sm text-backend-primary">
            <input type="checkbox" checked={publishToSocial} onChange={(e) => setPublishToSocial(e.target.checked)} />
            Published
          </label>
        </div>

        {publishToSocial && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-backend-primary mb-1.5">Published to (select platform[s])</label>
            <PlatformMultiSelect value={selectedPlatforms} onChange={togglePlatform} />
          </div>
        )}

        <div className="mb-6">
          <label className="inline-flex items-center gap-2 text-sm text-backend-primary">
            <input type="checkbox" checked={updateSourceFile} onChange={(e) => setUpdateSourceFile(e.target.checked)} />
            Update source file (sync orbs back to YAML)
          </label>
        </div>

        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 border border-backend-default rounded-md text-backend-primary">Cancel</button>
          <button onClick={onSaveOnly} className="px-4 py-2 border border-backend-default rounded-md text-backend-primary">Save</button>
          <button onClick={onPublish} className="px-4 py-2 bg-backend-primary text-white rounded-md">Publish</button>
        </div>
      </div>
    </div>
  );
}
