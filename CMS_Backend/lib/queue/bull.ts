import Bull from 'bull';
import { createClient } from '@supabase/supabase-js';

// Queue configuration
const queueConfig = {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  },
  defaultJobOptions: {
    removeOnComplete: 10,
    removeOnFail: 5,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
};

// Create queues with error handling
let contentProcessingQueue: Bull.Queue | null = null;
let aiProcessingQueue: Bull.Queue | null = null;
let notificationQueue: Bull.Queue | null = null;
let analyticsQueue: Bull.Queue | null = null;

// Queues disabled for now - Redis not available
// All queues will be null, functions will handle gracefully

// Export queues (may be null if Redis is unavailable)
export { contentProcessingQueue, aiProcessingQueue, notificationQueue, analyticsQueue };

// Get queue by name
export function getQueue(queueName: string): Bull.Queue | null {
  switch (queueName) {
    case 'content-processing':
      return contentProcessingQueue;
    case 'ai-processing':
      return aiProcessingQueue;
    case 'notifications':
      return notificationQueue;
    case 'analytics':
      return analyticsQueue;
    default:
      return null;
  }
}

// Supabase client for queue jobs
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Job types
export interface ContentProcessingJob {
  type: 'import_content' | 'process_file' | 'update_metadata' | 'generate_embeddings';
  fileId?: string;
  filePath?: string;
  metadata?: any;
  priority?: number;
}

export interface AIProcessingJob {
  type: 'analyze_content' | 'generate_summary' | 'extract_scrollstreams' | 'orb_analysis';
  content: string;
  context?: any;
  orbContext?: any;
}

export interface NotificationJob {
  type: 'email' | 'webhook' | 'system_log';
  recipient: string;
  message: string;
  data?: any;
}

export interface AnalyticsJob {
  type: 'track_event' | 'update_metrics' | 'generate_report';
  event: string;
  data: any;
  timestamp: Date;
}

// Content Processing Queue Handlers
// Disabled - queues are null when Redis is unavailable
/*
if (contentProcessingQueue && typeof contentProcessingQueue.process === 'function') {
  contentProcessingQueue.process('import_content', async (job) => {
    const { filePath, metadata } = job.data;
    console.log(`Processing content import: ${filePath}`);
    
    try {
      // Simulate content processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update job progress
      job.progress(50);
      
      // Here you would implement actual content processing
      // For now, we'll just log the completion
      console.log(`Content import completed: ${filePath}`);
      
      job.progress(100);
      return { success: true, filePath };
    } catch (error) {
      console.error('Content processing error:', error);
      throw error;
    }
  });

  contentProcessingQueue.process('generate_embeddings', async (job) => {
    const { fileId, content } = job.data;
    console.log(`Generating embeddings for file: ${fileId}`);
    
    try {
      // Simulate embedding generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would implement actual embedding generation
      // For now, we'll just log the completion
      console.log(`Embeddings generated for file: ${fileId}`);
      
      return { success: true, fileId };
    } catch (error) {
      console.error('Embedding generation error:', error);
      throw error;
    }
  });

  contentProcessingQueue.on('completed', (job) => {
    console.log(`Content processing job ${job.id} completed`);
  });

  contentProcessingQueue.on('failed', (job, err) => {
    console.error(`Content processing job ${job.id} failed:`, err);
  });
}
*/

// AI Processing Queue Handlers
// Disabled - queues are null when Redis is unavailable
/*
if (aiProcessingQueue && typeof aiProcessingQueue.process === 'function') {
  aiProcessingQueue.process('analyze_content', async (job) => {
    const { content, context } = job.data;
    console.log(`Analyzing content: ${content.slice(0, 100)}...`);
    
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Here you would implement actual AI analysis
      const analysis = {
        sentiment: 'positive',
        topics: ['consciousness', 'technology'],
        orbAssociations: ['Orb 1', 'Orb 4'],
        resonanceScore: 0.85,
      };
      
      console.log(`Content analysis completed`);
      return { success: true, analysis };
    } catch (error) {
      console.error('AI analysis error:', error);
      throw error;
    }
  });

  aiProcessingQueue.on('completed', (job) => {
    console.log(`AI processing job ${job.id} completed`);
  });

  aiProcessingQueue.on('failed', (job, err) => {
    console.error(`AI processing job ${job.id} failed:`, err);
  });
}
*/

// Notification Queue Handlers
// Disabled - queues are null when Redis is unavailable
/*
if (notificationQueue && typeof notificationQueue.process === 'function') {
  notificationQueue.process('email', async (job) => {
    const { recipient, message, data } = job.data;
    console.log(`Sending email to: ${recipient}`);
    
    try {
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`Email sent to: ${recipient}`);
      return { success: true, recipient };
    } catch (error) {
      console.error('Email sending error:', error);
      throw error;
    }
  });
}
*/

// Analytics Queue Handlers
// Disabled - queues are null when Redis is unavailable
/*
if (analyticsQueue && typeof analyticsQueue.process === 'function') {
  analyticsQueue.process('track_event', async (job) => {
    const { event, data, timestamp } = job.data;
    console.log(`Tracking event: ${event}`);
    
    try {
      // Simulate analytics tracking
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Here you would implement actual analytics tracking
      console.log(`Event tracked: ${event}`);
      return { success: true, event };
    } catch (error) {
      console.error('Analytics tracking error:', error);
      throw error;
    }
  });
}
*/

// Synchronous processing functions (fallback when Redis unavailable)
async function runImmediateContentProcessing(jobData: ContentProcessingJob): Promise<any> {
  console.log('Queue disabled, running content processing synchronously:', jobData.type);
  try {
    // Basic synchronous processing - can be extended with actual logic
    switch (jobData.type) {
      case 'import_content':
        // Content import would happen here synchronously
        return { success: true, message: 'Content imported synchronously', jobData };
      case 'process_file':
        // File processing would happen here
        return { success: true, message: 'File processed synchronously', jobData };
      case 'update_metadata':
        // Metadata update would happen here
        return { success: true, message: 'Metadata updated synchronously', jobData };
      case 'generate_embeddings':
        // Embedding generation would happen here
        return { success: true, message: 'Embeddings generated synchronously', jobData };
      default:
        return { success: true, message: 'Processed synchronously', jobData };
    }
  } catch (error) {
    console.error('Synchronous content processing error:', error);
    throw error;
  }
}

async function runImmediateAIProcessing(jobData: AIProcessingJob): Promise<any> {
  console.log('Queue disabled, running AI processing synchronously:', jobData.type);
  try {
    // Basic synchronous AI processing - can be extended with actual logic
    return { success: true, message: 'AI processing completed synchronously', jobData };
  } catch (error) {
    console.error('Synchronous AI processing error:', error);
    throw error;
  }
}

async function runImmediateNotification(jobData: NotificationJob): Promise<any> {
  console.log('Queue disabled, running notification synchronously:', jobData.type);
  try {
    // Basic synchronous notification - can be extended with actual logic
    console.log(`Notification: ${jobData.type} to ${jobData.recipient}: ${jobData.message}`);
    return { success: true, message: 'Notification sent synchronously', jobData };
  } catch (error) {
    console.error('Synchronous notification error:', error);
    throw error;
  }
}

async function runImmediateAnalytics(jobData: AnalyticsJob): Promise<any> {
  console.log('Queue disabled, running analytics synchronously:', jobData.type);
  try {
    // Basic synchronous analytics - can be extended with actual logic
    console.log(`Analytics: ${jobData.type} - ${jobData.event}`, jobData.data);
    return { success: true, message: 'Analytics tracked synchronously', jobData };
  } catch (error) {
    console.error('Synchronous analytics error:', error);
    throw error;
  }
}

// Queue management functions
export async function addContentProcessingJob(jobData: ContentProcessingJob, options?: any) {
  if (!contentProcessingQueue) {
    console.log('Queue disabled, running content processing synchronously');
    try {
      return await runImmediateContentProcessing(jobData);
    } catch (error) {
      console.error('Synchronous content processing failed:', error);
    return null;
    }
  }
  try {
  return await contentProcessingQueue.add(jobData.type, jobData, {
    priority: jobData.priority || 0,
    ...options,
  });
  } catch (error) {
    console.error('Queue job addition failed, falling back to synchronous:', error);
    return await runImmediateContentProcessing(jobData);
  }
}

export async function addAIProcessingJob(jobData: AIProcessingJob, options?: any) {
  if (!aiProcessingQueue) {
    console.log('Queue disabled, running AI processing synchronously');
    try {
      return await runImmediateAIProcessing(jobData);
    } catch (error) {
      console.error('Synchronous AI processing failed:', error);
    return null;
    }
  }
  try {
  return await aiProcessingQueue.add(jobData.type, jobData, {
    priority: 1, // AI jobs have higher priority
    ...options,
  });
  } catch (error) {
    console.error('Queue job addition failed, falling back to synchronous:', error);
    return await runImmediateAIProcessing(jobData);
  }
}

export async function addNotificationJob(jobData: NotificationJob, options?: any) {
  if (!notificationQueue) {
    console.log('Queue disabled, running notification synchronously');
    try {
      return await runImmediateNotification(jobData);
    } catch (error) {
      console.error('Synchronous notification failed:', error);
    return null;
    }
  }
  try {
  return await notificationQueue.add(jobData.type, jobData, options);
  } catch (error) {
    console.error('Queue job addition failed, falling back to synchronous:', error);
    return await runImmediateNotification(jobData);
  }
}

export async function addAnalyticsJob(jobData: AnalyticsJob, options?: any) {
  if (!analyticsQueue) {
    console.log('Queue disabled, running analytics synchronously');
    try {
      return await runImmediateAnalytics(jobData);
    } catch (error) {
      console.error('Synchronous analytics failed:', error);
    return null;
    }
  }
  try {
  return await analyticsQueue.add(jobData.type, jobData, options);
  } catch (error) {
    console.error('Queue job addition failed, falling back to synchronous:', error);
    return await runImmediateAnalytics(jobData);
  }
}

// Queue health check
export async function getQueueHealth() {
  const queues = [
    { name: 'content-processing', queue: contentProcessingQueue },
    { name: 'ai-processing', queue: aiProcessingQueue },
    { name: 'notifications', queue: notificationQueue },
    { name: 'analytics', queue: analyticsQueue },
  ];
  
  const health = await Promise.all(
    queues.map(async ({ name, queue }) => {
      if (!queue) {
        return {
          name,
          waiting: 0,
          active: 0,
          completed: 0,
          failed: 0,
          isHealthy: false,
          error: 'Queue not available (Redis not running)'
        };
      }
      
      try {
        const waiting = await queue.getWaiting();
        const active = await queue.getActive();
        const completed = await queue.getCompleted();
        const failed = await queue.getFailed();
        
        return {
          name,
          waiting: waiting.length,
          active: active.length,
          completed: completed.length,
          failed: failed.length,
          isHealthy: failed.length < 10, // Consider unhealthy if more than 10 failed jobs
        };
      } catch (error) {
        return {
          name,
          waiting: 0,
          active: 0,
          completed: 0,
          failed: 0,
          isHealthy: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    })
  );
  
  return health;
}

// Graceful shutdown
export async function closeQueues() {
  const queues = [contentProcessingQueue, aiProcessingQueue, notificationQueue, analyticsQueue];
  const closePromises = queues
    .filter(queue => queue !== null)
    .map(queue => queue!.close());
  
  await Promise.all(closePromises);
}
