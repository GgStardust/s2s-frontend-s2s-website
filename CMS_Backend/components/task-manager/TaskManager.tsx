'use client';

import { useState, useEffect } from 'react';
import { getAllOrbs } from '@/lib/content';
import { Orb } from '@/lib/types';

type Priority = 'high' | 'medium' | 'low';

interface Task {
  id: string;
  description: string;
  orbId: number;
  priority: Priority;
  completed: boolean;
  createdAt: Date;
}

interface TaskManagerProps {
  onTaskAdded: (task: Task) => void;
}

export default function TaskManager({ onTaskAdded }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    description: '',
    orbId: 1,
    priority: 'medium' as Priority
  });
  const [orbs, setOrbs] = useState<Orb[]>([]);

  useEffect(() => {
    const orbsData = getAllOrbs();
    setOrbs(orbsData);
  }, []);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.description.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      description: newTask.description,
      orbId: newTask.orbId,
      priority: newTask.priority,
      completed: false,
      createdAt: new Date()
    };

    setTasks([...tasks, task]);
    onTaskAdded(task);
    setNewTask({ description: '', orbId: 1, priority: 'medium' });
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const getOrbTitle = (orbId: number) => {
    const orb = orbs.find(o => o.id === orbId);
    return orb ? orb.title : 'Unknown Orb';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500/30 bg-red-500/10 text-red-400';
      case 'medium': return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400';
      case 'low': return 'border-green-500/30 bg-green-500/10 text-green-400';
      default: return 'border-gray-500/30 bg-gray-500/10 text-gray-400';
    }
  };

  const getOrbColor = (orbId: number) => {
    const colors = [
      'border-deep-gold/30 bg-deep-gold/10 text-deep-gold',
      'border-cosmic-blue/30 bg-cosmic-blue/10 text-cosmic-blue',
      'border-purple-500/30 bg-purple-500/10 text-purple-400',
      'border-teal-500/30 bg-teal-500/10 text-teal-400',
      'border-amber-500/30 bg-amber-500/10 text-amber-400',
      'border-rose-500/30 bg-rose-500/10 text-rose-400'
    ];
    return colors[orbId % colors.length];
  };

  return (
    <div className="space-y-8">
      {/* Add Task Form */}
      <div className="card-cosmic">
        <h3 className="text-2xl font-bold mb-6 text-gradient">Add Content Processing Task</h3>
        <form onSubmit={handleAddTask} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-creamy-white/80 mb-3">
              Content Processing Task
            </label>
            <input
              type="text"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              placeholder="What content needs processing?"
              className="input-cosmic"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-creamy-white/80 mb-3">
                Target Orb
              </label>
              <select
                value={newTask.orbId}
                onChange={(e) => setNewTask({ ...newTask, orbId: parseInt(e.target.value) })}
                className="input-cosmic"
              >
                {orbs.map((orb) => (
                  <option key={orb.id} value={orb.id}>
                    {orb.title}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-creamy-white/80 mb-3">
                Priority
              </label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Priority })}
                className="input-cosmic"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>
          
          <button
            type="submit"
            className="btn-primary w-full"
          >
            Add Task
          </button>
        </form>
      </div>

      {/* Task List */}
      <div className="card-base">
        <h3 className="text-2xl font-bold mb-6 text-gradient">Content Processing Queue</h3>
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-deep-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <p className="text-deep-navy/60 text-lg">No content processing tasks yet. Add one above!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`task-item ${
                  task.completed ? 'opacity-60' : ''
                } ${getPriorityColor(task.priority)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${task.completed ? 'line-through text-deep-navy/60' : 'text-deep-navy'}`}>
                      {task.description}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getOrbColor(task.orbId)}`}>
                        {getOrbTitle(task.orbId)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority} priority
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`ml-4 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                      task.completed
                        ? 'bg-green-500/20 text-green-600 border border-green-500/30'
                        : 'bg-gray-500/20 text-gray-600 border border-gray-500/30 hover:bg-green-500/20 hover:text-green-600 hover:border-green-500/30'
                    }`}
                  >
                    {task.completed ? 'Completed' : 'Mark Complete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
