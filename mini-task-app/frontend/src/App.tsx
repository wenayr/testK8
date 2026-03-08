import React, { useState, useEffect } from 'react';
import './App.css';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

declare const process: { env: { API_URL?: string } };
const API_URL = process.env.API_URL || 'http://localhost:3001';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка задач при монтировании
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/tasks`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      setError(null);
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTaskTitle })
      });
      if (!response.ok) throw new Error('Failed to create task');
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const toggleTask = async (id: number, completed: boolean) => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed })
      });
      if (!response.ok) throw new Error('Failed to update task');
      const updatedTask = await response.json();
      setTasks(tasks.map(task => task.id === id ? updatedTask : task));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <div className="container">
      <h1>TODO App</h1>

      {error && <div className="error">Ошибка: {error}</div>}

      <form onSubmit={addTask} className="task-form">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Введите новую задачу..."
        />
        <button type="submit">
          Добавить
        </button>
      </form>

      {loading ? (
        <p className="loading">Загрузка...</p>
      ) : (
        <div className="task-list">
          {tasks.map(task => (
            <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={(e) => toggleTask(task.id, e.target.checked)}
              />
              <span>{task.title}</span>
            </div>
          ))}
        </div>
      )}

      {tasks.length === 0 && !loading && (
        <p className="empty-state">Нет задач. Добавьте первую!</p>
      )}
    </div>
  );
};

export default App;
