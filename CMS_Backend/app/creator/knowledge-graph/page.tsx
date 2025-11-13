'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import ForceGraph2D to avoid SSR issues
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export default function KnowledgeGraphPage() {
  const [graphData, setGraphData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [filterOrb, setFilterOrb] = useState<number | null>(null);
  const graphRef = useRef<any>();

  useEffect(() => {
    loadGraph();
  }, []);

  async function loadGraph() {
    try {
      const response = await fetch('/api/knowledge-graph');
      const data = await response.json();

      if (response.ok) {
        setGraphData(data.graph);
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error loading graph:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleNodeClick(node: any) {
    setSelectedNode(node);

    if (node.type === 'content') {
      // Optionally navigate to content detail
      window.open(`/creator/library/${node.id}`, '_blank');
    }
  }

  function filterByOrb(orb: number | null) {
    setFilterOrb(orb);

    if (!graphData) return;

    if (orb === null) {
      // Show all
      loadGraph();
    } else {
      // Filter graph
      const filteredNodes = graphData.nodes.filter((n: any) =>
        n.orbs?.includes(orb) || n.id === `orb-${orb}`
      );

      const nodeIds = new Set(filteredNodes.map((n: any) => n.id));

      const filteredLinks = graphData.links.filter((l: any) =>
        nodeIds.has(l.source.id || l.source) && nodeIds.has(l.target.id || l.target)
      );

      setGraphData({
        nodes: filteredNodes,
        links: filteredLinks,
      });
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-navy flex items-center justify-center">
        <div className="text-creamy-white text-2xl">Loading knowledge graph...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-navy">
      <div className="max-w-full mx-auto px-6 py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="text-deep-gold hover:text-creamy-white mb-4 inline-block text-base"
          >
            ← Back to Dashboard
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-creamy-white mb-4">
                Knowledge Graph
              </h1>
              <p className="text-creamy-white/60 text-lg">
                Interactive visualization of content connections
              </p>
            </div>

            {stats && (
              <div className="bg-deep-navy/60 backdrop-blur-sm rounded-xl p-4 border border-cosmic-blue/30">
                <div className="text-sm text-creamy-white/60 space-y-1">
                  <div>{stats.contentNodes} content files</div>
                  <div>{stats.orbNodes} Orbs</div>
                  <div>{stats.totalEdges} connections</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Orb Filter */}
        <div className="mb-6 bg-deep-navy/60 backdrop-blur-sm rounded-xl p-4 border border-cosmic-blue/30">
          <div className="flex items-center space-x-3 flex-wrap">
            <button
              onClick={() => filterByOrb(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterOrb === null
                  ? 'bg-cosmic-blue text-white'
                  : 'bg-deep-navy border border-cosmic-blue/30 text-creamy-white hover:border-cosmic-blue'
              }`}
            >
              All
            </button>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(orb => (
              <button
                key={orb}
                onClick={() => filterByOrb(orb)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterOrb === orb
                    ? `bg-orb-${orb} text-deep-navy`
                    : 'bg-deep-navy border border-cosmic-blue/30 text-creamy-white hover:border-cosmic-blue'
                }`}
              >
                Orb {orb}
              </button>
            ))}
          </div>
        </div>

        {/* Graph Container */}
        <div className="bg-deep-navy/60 backdrop-blur-sm rounded-2xl p-6 border border-deep-gold/30" style={{ height: '70vh' }}>
          {graphData && (
            <ForceGraph2D
              ref={graphRef}
              graphData={graphData}
              nodeLabel={(node: any) => node.name}
              nodeColor={(node: any) => node.color}
              nodeVal={(node: any) => node.size}
              linkColor={() => 'rgba(244, 241, 232, 0.3)'}
              linkWidth={(link: any) => link.strength || 1}
              onNodeClick={handleNodeClick}
              backgroundColor="#1C1F3B"
              nodeCanvasObject={(node: any, ctx: any, globalScale: number) => {
                const label = node.name;
                const fontSize = 12 / globalScale;
                ctx.font = `${fontSize}px Sans-Serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                // Draw node circle
                ctx.fillStyle = node.color;
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI);
                ctx.fill();

                // Draw label
                ctx.fillStyle = '#F4F1E8';
                ctx.fillText(label, node.x, node.y + node.size + fontSize + 2);
              }}
              enableNodeDrag={true}
              enableZoomInteraction={true}
              enablePanInteraction={true}
            />
          )}
        </div>

        {/* Selected Node Info */}
        {selectedNode && (
          <div className="mt-6 bg-deep-navy/60 backdrop-blur-sm rounded-2xl p-6 border border-deep-gold/30">
            <h3 className="text-2xl font-bold text-creamy-white mb-4">{selectedNode.name}</h3>
            <div className="grid grid-cols-2 gap-4 text-base">
              <div>
                <span className="text-creamy-white/60">Type:</span>
                <span className="ml-2 text-creamy-white">{selectedNode.type}</span>
              </div>
              {selectedNode.contentType && (
                <div>
                  <span className="text-creamy-white/60">Content Type:</span>
                  <span className="ml-2 text-creamy-white">{selectedNode.contentType}</span>
                </div>
              )}
              {selectedNode.orbs && selectedNode.orbs.length > 0 && (
                <div className="col-span-2">
                  <span className="text-creamy-white/60">Orbs:</span>
                  <span className="ml-2 text-creamy-white">{selectedNode.orbs.join(', ')}</span>
                </div>
              )}
              {selectedNode.tags && selectedNode.tags.length > 0 && (
                <div className="col-span-2">
                  <span className="text-creamy-white/60">Tags:</span>
                  <span className="ml-2 text-creamy-white">{selectedNode.tags.slice(0, 10).join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
