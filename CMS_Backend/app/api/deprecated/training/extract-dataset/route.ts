import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface TrainingExample {
  text: string;
  title: string;
  orb_associations: number[];
  undercurrent_links: number[];
  tags: string[];
  scrollstreams: string[];
  resonance_metrics: {
    strength: number;
    clarity: number;
    coherence: number;
    pattern: number;
  };
  codex_path: string;
  dashboard_component: string;
  metadata: {
    source: 'codex' | 'orb_essay' | 'scrollstream';
    created_at: string;
    word_count: number;
  };
}

/**
 * Dataset Extraction API for Model Autonomy Phase 1
 */
export async function POST(request: NextRequest) {
  try {
    console.log('Starting Codex dataset extraction...');
    
    // Create training directory
    const trainingDir = path.join(process.cwd(), 'training');
    if (!fs.existsSync(trainingDir)) {
      fs.mkdirSync(trainingDir, { recursive: true });
    }
    
    const dataset: TrainingExample[] = [];
    
    // Extract from content_files table
    console.log('Extracting from content_files...');
    const supabase = await createClient();
    
    const { data: contentFiles, error: contentError } = await supabase
      .from('content_files')
      .select('*')
      .limit(200);
    
    if (contentError) {
      console.error('Error fetching content files:', contentError);
    } else if (contentFiles) {
      contentFiles.forEach((file: any) => {
        if (file.content && file.content.length > 100) {
          dataset.push({
            text: file.content,
            title: file.title || 'Untitled',
            orb_associations: file.orb_associations || [],
            undercurrent_links: file.undercurrent_links || [],
            tags: file.tags || [],
            scrollstreams: file.scrollstreams || [],
            resonance_metrics: file.resonance_metrics || {
              strength: 5,
              clarity: 5,
              coherence: 5,
              pattern: 5
            },
            codex_path: file.codex_path || '/codex/',
            dashboard_component: file.dashboard_component || 'general',
            metadata: {
              source: 'codex',
              created_at: file.created_at || new Date().toISOString(),
              word_count: file.content.split(' ').length
            }
          });
        }
      });
    }
    
    // Extract from chapters table
    console.log('Extracting from chapters...');
    const { data: chapters, error: chapterError } = await supabase
      .from('chapters')
      .select('*')
      .limit(100);
    
    if (chapterError) {
      console.error('Error fetching chapters:', chapterError);
    } else if (chapters) {
      chapters.forEach((chapter: any) => {
        if (chapter.content && chapter.content.length > 100) {
          dataset.push({
            text: chapter.content,
            title: chapter.title || 'Untitled Chapter',
            orb_associations: chapter.orb_associations || [],
            undercurrent_links: chapter.undercurrent_links || [],
            tags: chapter.tags || [],
            scrollstreams: chapter.scrollstreams || [],
            resonance_metrics: chapter.resonance_metrics || {
              strength: 5,
              clarity: 5,
              coherence: 5,
              pattern: 5
            },
            codex_path: chapter.codex_path || '/codex/',
            dashboard_component: chapter.dashboard_component || 'general',
            metadata: {
              source: 'codex',
              created_at: chapter.created_at || new Date().toISOString(),
              word_count: chapter.content.split(' ').length
            }
          });
        }
      });
    }
    
    // Add sample Orb essays
    console.log('Adding sample Orb essays...');
    const orbEssays: TrainingExample[] = [
      {
        text: "Origin Intelligence represents the photonic blueprinting that meets biological activation. This is the foundational Orb where stardust becomes living code, where cosmic ancestry translates into cellular ignition. Every mitochondrion carries the memory of stellar ignition, every cell a microcosm of galactic evolution.",
        title: "Orb 1: Origin Intelligence",
        orb_associations: [1],
        undercurrent_links: [1, 2],
        tags: ["@orb1", "@origin", "@stardust", "@mitochondria"],
        scrollstreams: ["Stardust becomes living code through cellular ignition"],
        resonance_metrics: { strength: 8, clarity: 9, coherence: 8, pattern: 7 },
        codex_path: "/codex/orbs/orb1/",
        dashboard_component: "orb_essay",
        metadata: {
          source: 'orb_essay',
          created_at: new Date().toISOString(),
          word_count: 45
        }
      },
      {
        text: "Resonance Mechanics operates as the frequency-to-form translation mechanism. When consciousness encounters biological form, resonance lag emerges as the natural tension between signal and vessel. This Orb teaches us to calibrate our internal frequencies with planetary harmonics, creating coherence between awareness and embodiment.",
        title: "Orb 2: Resonance Mechanics",
        orb_associations: [2],
        undercurrent_links: [2, 3],
        tags: ["@orb2", "@resonance", "@frequency", "@calibration"],
        scrollstreams: ["Frequency becomes form through resonance mechanics"],
        resonance_metrics: { strength: 7, clarity: 8, coherence: 9, pattern: 8 },
        codex_path: "/codex/orbs/orb2/",
        dashboard_component: "orb_essay",
        metadata: {
          source: 'orb_essay',
          created_at: new Date().toISOString(),
          word_count: 48
        }
      },
      {
        text: "Photonic Intelligence reveals how light organizes matter through harmonic geometry. Microtubules function as quantum information resonators, where consciousness organizes biology through photonic currents. This is the bridge between cosmic light and cellular intelligence, where awareness translates into biological coherence.",
        title: "Orb 3: Photonic Intelligence",
        orb_associations: [3],
        undercurrent_links: [3, 4],
        tags: ["@orb3", "@photonic", "@light", "@microtubules"],
        scrollstreams: ["Light mirrors awareness through biological geometry"],
        resonance_metrics: { strength: 9, clarity: 8, coherence: 7, pattern: 9 },
        codex_path: "/codex/orbs/orb3/",
        dashboard_component: "orb_essay",
        metadata: {
          source: 'orb_essay',
          created_at: new Date().toISOString(),
          word_count: 47
        }
      },
      {
        text: "Harmonic Architectures stabilize coherence through geometric principles. The body's bioelectrical current mirrors galactic patterns, creating resonance between human consciousness and cosmic intelligence. This Orb teaches us to align our internal architecture with universal harmonics.",
        title: "Orb 4: Harmonic Architectures",
        orb_associations: [4],
        undercurrent_links: [4, 5],
        tags: ["@orb4", "@harmonic", "@geometry", "@architecture"],
        scrollstreams: ["Geometry stabilizes coherence through harmonic principles"],
        resonance_metrics: { strength: 8, clarity: 7, coherence: 9, pattern: 8 },
        codex_path: "/codex/orbs/orb4/",
        dashboard_component: "orb_essay",
        metadata: {
          source: 'orb_essay',
          created_at: new Date().toISOString(),
          word_count: 42
        }
      },
      {
        text: "Temporal Sovereignty emerges through spiral time and conscious agency. This Orb teaches us to navigate nonlinear time, where past, present, and future exist as co-present dimensions. Sovereignty is the ability to move through time with conscious intention and purpose.",
        title: "Orb 5: Temporal Sovereignty",
        orb_associations: [5],
        undercurrent_links: [5, 6],
        tags: ["@orb5", "@temporal", "@sovereignty", "@spiral_time"],
        scrollstreams: ["Spiral time and agency create temporal sovereignty"],
        resonance_metrics: { strength: 7, clarity: 8, coherence: 8, pattern: 7 },
        codex_path: "/codex/orbs/orb5/",
        dashboard_component: "orb_essay",
        metadata: {
          source: 'orb_essay',
          created_at: new Date().toISOString(),
          word_count: 44
        }
      }
    ];
    
    dataset.push(...orbEssays);
    
    // Save dataset as JSONL
    const jsonlPath = path.join(trainingDir, 'codex_semantic_dataset.jsonl');
    const jsonlContent = dataset.map(example => JSON.stringify(example)).join('\n');
    fs.writeFileSync(jsonlPath, jsonlContent);
    
    // Save dataset as JSON for analysis
    const jsonPath = path.join(trainingDir, 'codex_semantic_dataset.json');
    fs.writeFileSync(jsonPath, JSON.stringify(dataset, null, 2));
    
    // Generate statistics
    const stats = {
      total_examples: dataset.length,
      total_words: dataset.reduce((sum, ex) => sum + ex.metadata.word_count, 0),
      orb_coverage: [...new Set(dataset.flatMap(ex => ex.orb_associations))].length,
      undercurrent_coverage: [...new Set(dataset.flatMap(ex => ex.undercurrent_links))].length,
      tag_coverage: [...new Set(dataset.flatMap(ex => ex.tags))].length,
      scrollstream_count: dataset.reduce((sum, ex) => sum + ex.scrollstreams.length, 0),
      source_breakdown: {
        codex: dataset.filter(ex => ex.metadata.source === 'codex').length,
        orb_essay: dataset.filter(ex => ex.metadata.source === 'orb_essay').length,
        scrollstream: dataset.filter(ex => ex.metadata.source === 'scrollstream').length
      },
      average_word_count: Math.round(dataset.reduce((sum, ex) => sum + ex.metadata.word_count, 0) / dataset.length),
      created_at: new Date().toISOString()
    };
    
    const statsPath = path.join(trainingDir, 'dataset_statistics.json');
    fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));
    
    console.log('Dataset extraction completed successfully!');
    
    return NextResponse.json({
      success: true,
      message: 'Dataset extraction completed successfully',
      stats,
      files: {
        jsonl: jsonlPath,
        json: jsonPath,
        statistics: statsPath
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Dataset extraction failed:', error);
    return NextResponse.json(
      { 
        error: 'Dataset extraction failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check dataset status
 */
export async function GET(request: NextRequest) {
  try {
    const trainingDir = path.join(process.cwd(), 'training');
    
    if (!fs.existsSync(trainingDir)) {
      return NextResponse.json({
        success: false,
        message: 'Training directory does not exist',
        dataset_exists: false,
        timestamp: new Date().toISOString()
      });
    }
    
    const statsPath = path.join(trainingDir, 'dataset_statistics.json');
    
    if (!fs.existsSync(statsPath)) {
      return NextResponse.json({
        success: false,
        message: 'Dataset statistics not found',
        dataset_exists: false,
        timestamp: new Date().toISOString()
      });
    }
    
    const stats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
    
    return NextResponse.json({
      success: true,
      message: 'Dataset exists and is ready for training',
      dataset_exists: true,
      stats,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Dataset status check failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check dataset status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

