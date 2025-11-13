import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Simple in-memory storage for threads (replace with database later)
let threads: any[] = [
  {
    id: '1',
    title: 'Welcome to Orbital',
    content: '',
    yaml: '',
    messages: [
      {
        id: '1',
        role: 'assistant',
        content: 'Hello! I\'m your Orbital AI assistant. I can help you develop content, explore ideas, and work with your S2S framework. What would you like to work on today?',
        timestamp: new Date()
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    autoSaved: false
  }
];

/**
 * Get all Orb threads - SIMPLIFIED VERSION
 */
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      threads: threads
    });

  } catch (error) {
    console.error('Thread fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch threads' },
      { status: 500 }
    );
  }
}

/**
 * Create a new Orb thread - SIMPLIFIED VERSION
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, yaml } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Create new thread with simple ID
    const newThread = {
      id: (threads.length + 1).toString(),
      title: title.trim(),
      content: content || '',
      yaml: yaml || '',
      messages: [
        {
          id: '1',
          role: 'assistant',
          content: `Great! I'm ready to help you work on "${title.trim()}". What would you like to explore or develop?`,
          timestamp: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      autoSaved: false
    };

    threads.push(newThread);

    return NextResponse.json({
      thread: newThread,
      message: 'Thread created successfully'
    });

  } catch (error) {
    console.error('Thread creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create thread' },
      { status: 500 }
    );
  }
}





