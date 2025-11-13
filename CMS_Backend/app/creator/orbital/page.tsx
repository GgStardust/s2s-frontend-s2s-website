'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/backend/Button';
import { Card } from '@/components/backend/Card';
import { Input, Textarea } from '@/components/backend/Input';
import { PageHeader } from '@/components/backend/Layout';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  cocValidation?: any;
}

interface Thread {
  id: string;
  title: string;
  content: string;
  yaml: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  autoSaved: boolean;
}

interface ProcessedContent {
  yaml: string;
  markdown: string;
  fullContent: string;
  orbAssociations: number[];
  tags: string[];
  scrollstreams: string[];
  cocValidation: any;
}

interface ResearchResult {
  file_title: string;
  excerpt: string;
  similarity: number;
  orb_associations: string[];
  tags: string[];
}

export default function OrbitalPage() {
  const router = useRouter();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResearch, setShowResearch] = useState(false);
  const [researchResults, setResearchResults] = useState<ResearchResult[]>([]);
  const [researchQuery, setResearchQuery] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [processedContent, setProcessedContent] = useState<ProcessedContent | null>(null);
  const [showProcessing, setShowProcessing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'research' | 'processing'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadThreads();
  }, []);

  useEffect(() => {
    if (selectedThread) {
      setMessages(selectedThread.messages);
    }
  }, [selectedThread]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  async function loadThreads() {
    try {
      const response = await fetch('/api/orb-threads');
      if (response.ok) {
        const data = await response.json();
        setThreads(data.threads || []);
      }
    } catch (error) {
      console.error('Error loading threads:', error);
    }
  }

  async function createNewThread() {
    try {
      const response = await fetch('/api/orb-threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'New Orbital Thread',
          content: '',
          yaml: ''
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newThread = data.thread;
        setThreads(prev => [newThread, ...prev]);
        setSelectedThread(newThread);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error creating thread:', error);
    }
  }

  async function sendMessage() {
    if (!inputMessage.trim() || !selectedThread) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/orb-threads/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          thread_id: selectedThread.id,
          message: inputMessage.trim()
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          cocValidation: data.cocValidation
        };

        setMessages(prev => [...prev, assistantMessage]);
        
        // Update thread in threads list
        setThreads(prev => prev.map(thread => 
          thread.id === selectedThread.id 
            ? { ...thread, messages: [...thread.messages, userMessage, assistantMessage], updatedAt: new Date() }
            : thread
        ));
      } else {
        const error = await response.json();
        console.error('Error sending message:', error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResearch() {
    if (!researchQuery.trim()) return;

    setIsResearching(true);
    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: researchQuery.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setResearchResults(data.results || []);
      }
    } catch (error) {
      console.error('Error researching:', error);
    } finally {
      setIsResearching(false);
    }
  }

  async function handleProcessContent() {
    if (!selectedThread || !selectedThread.content.trim()) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/ai/process-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: selectedThread.content,
          title: selectedThread.title
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setProcessedContent(data.processed);
        setShowProcessing(true);
      }
    } catch (error) {
      console.error('Error processing content:', error);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="min-h-screen bg-backend-secondary">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <PageHeader
          title="Orbital Brain"
          subtitle="AI-powered content development with Orb awareness"
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Threads */}
          <div className="lg:col-span-1">
            <Card className="h-[600px] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-backend-primary">Threads</h3>
                <Button
                  onClick={createNewThread}
                  variant="primary"
                  size="sm"
                >
                  + New
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-2">
                {threads.map((thread) => (
                  <div
                    key={thread.id}
                    onClick={() => setSelectedThread(thread)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedThread?.id === thread.id
                        ? 'bg-backend-primary text-white'
                        : 'bg-backend-accent hover:bg-backend-hover'
                    }`}
                  >
                    <h4 className="font-medium text-sm truncate">{thread.title}</h4>
                    <p className="text-xs opacity-75 mt-1">
                      {thread.messages.length} messages
                    </p>
                    <p className="text-xs opacity-75">
                      {new Date(thread.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              {/* Tabs */}
              <div className="border-b border-backend-default mb-4">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'chat'
                        ? 'border-backend-primary text-backend-primary'
                        : 'border-transparent text-backend-secondary hover:text-backend-primary hover:border-backend-default'
                    }`}
                  >
                    Chat
                  </button>
                  <button
                    onClick={() => setActiveTab('research')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'research'
                        ? 'border-backend-primary text-backend-primary'
                        : 'border-transparent text-backend-secondary hover:text-backend-primary hover:border-backend-default'
                    }`}
                  >
                    Research
                  </button>
                  <button
                    onClick={() => setActiveTab('processing')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'processing'
                        ? 'border-backend-primary text-backend-primary'
                        : 'border-transparent text-backend-secondary hover:text-backend-primary hover:border-backend-default'
                    }`}
                  >
                    Processing
                  </button>
                </nav>
              </div>

              {/* Chat Tab */}
              {activeTab === 'chat' && (
                <div className="flex-1 flex flex-col">
                  {selectedThread ? (
                    <>
                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.role === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-[80%] p-3 rounded-lg ${
                                message.role === 'user'
                                  ? 'bg-backend-primary text-white'
                                  : 'bg-backend-accent text-backend-primary'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              {message.cocValidation && (
                                <div className="mt-2 p-2 bg-backend-secondary rounded text-xs">
                                  <strong>CoC Validation:</strong> {message.cocValidation.isProven ? '✓ Proven' : '⚠ Partial'}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        {isLoading && (
                          <div className="flex justify-start">
                            <div className="bg-backend-accent p-3 rounded-lg">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-backend-primary rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-backend-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-backend-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Input */}
                      <div className="border-t border-backend-default p-4">
                        <div className="flex space-x-2">
                          <Input
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                            placeholder="Ask the Orbital Brain anything..."
                            className="flex-1"
                            disabled={isLoading}
                          />
                          <Button
                            onClick={sendMessage}
                            disabled={!inputMessage.trim() || isLoading}
                            variant="primary"
                          >
                            Send
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <h3 className="text-lg font-medium text-backend-primary mb-2">
                          Select a thread to start chatting
                        </h3>
                        <p className="text-backend-secondary mb-4">
                          Or create a new thread to begin
                        </p>
                        <Button onClick={createNewThread} variant="primary">
                          Create New Thread
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Research Tab */}
              {activeTab === 'research' && (
                <div className="flex-1 flex flex-col">
                  <div className="p-4 border-b border-backend-default">
                    <div className="flex space-x-2">
                      <Input
                        value={researchQuery}
                        onChange={(e) => setResearchQuery(e.target.value)}
                        placeholder="Search your content library..."
                        className="flex-1"
                      />
                      <Button
                        onClick={handleResearch}
                        disabled={!researchQuery.trim() || isResearching}
                        variant="primary"
                      >
                        {isResearching ? 'Searching...' : 'Search'}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4">
                    {researchResults.length > 0 ? (
                      <div className="space-y-4">
                        {researchResults.map((result, index) => (
                          <div key={index} className="p-4 border border-backend-default rounded-lg">
                            <h4 className="font-medium text-backend-primary mb-2">
                              {result.file_title}
                            </h4>
                            <p className="text-sm text-backend-secondary mb-2">
                              {result.excerpt}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-backend-secondary">
                              <span>Similarity: {(result.similarity * 100).toFixed(1)}%</span>
                              <span>Orbs: {result.orb_associations.join(', ')}</span>
                              <span>Tags: {result.tags.slice(0, 3).join(', ')}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <h3 className="text-lg font-medium text-backend-primary mb-2">
                          Research Your Content
                        </h3>
                        <p className="text-backend-secondary">
                          Search through your Orb essays and codex entries
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Processing Tab */}
              {activeTab === 'processing' && (
                <div className="flex-1 flex flex-col">
                  {selectedThread ? (
                    <>
                      <div className="p-4 border-b border-backend-default">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-backend-primary">
                            Process Content
                          </h3>
                          <Button
                            onClick={handleProcessContent}
                            disabled={!selectedThread.content.trim() || isProcessing}
                            variant="primary"
                          >
                            {isProcessing ? 'Processing...' : 'Process Content'}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto p-4">
                        {processedContent ? (
                          <div className="space-y-6">
                            <div className="p-4 bg-backend-accent rounded-lg">
                              <h4 className="font-medium text-backend-primary mb-2">Orb Associations</h4>
                              <div className="flex flex-wrap gap-2">
                                {processedContent.orbAssociations.map((orb, index) => (
                                  <span key={index} className="px-2 py-1 bg-backend-primary text-white text-xs rounded">
                                    Orb {orb}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div className="p-4 bg-backend-accent rounded-lg">
                              <h4 className="font-medium text-backend-primary mb-2">Tags</h4>
                              <div className="flex flex-wrap gap-2">
                                {processedContent.tags.map((tag, index) => (
                                  <span key={index} className="px-2 py-1 bg-backend-secondary text-backend-primary text-xs rounded">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div className="p-4 bg-backend-accent rounded-lg">
                              <h4 className="font-medium text-backend-primary mb-2">Scrollstreams</h4>
                              <div className="space-y-2">
                                {processedContent.scrollstreams.map((stream, index) => (
                                  <p key={index} className="text-sm text-backend-secondary italic">
                                    &ldquo;{stream}&rdquo;
                                  </p>
                                ))}
                              </div>
                            </div>
                            
                            {processedContent.cocValidation && (
                              <div className="p-4 bg-backend-accent rounded-lg">
                                <h4 className="font-medium text-backend-primary mb-2">CoC Validation</h4>
                                <div className={`text-sm ${
                                  processedContent.cocValidation.isProven 
                                    ? 'text-green-600' 
                                    : 'text-yellow-600'
                                }`}>
                                  {processedContent.cocValidation.isProven ? '✓ Proven' : '⚠ Partial'} - 
                                  {processedContent.cocValidation.explanation}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <h3 className="text-lg font-medium text-backend-primary mb-2">
                              Process Your Content
                            </h3>
                            <p className="text-backend-secondary mb-4">
                              Analyze content for Orb associations, tags, and CoC validation
                            </p>
                            <Button
                              onClick={handleProcessContent}
                              disabled={!selectedThread.content.trim() || isProcessing}
                              variant="primary"
                            >
                              {isProcessing ? 'Processing...' : 'Process Content'}
                            </Button>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <h3 className="text-lg font-medium text-backend-primary mb-2">
                          Select a thread to process content
                        </h3>
                        <p className="text-backend-secondary">
                          Choose a thread with content to analyze
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}