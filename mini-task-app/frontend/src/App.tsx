import React, { useState, useEffect } from 'react';

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
    <div style={styles.container}>
      <h1 style={styles.title}>TODO App</h1>

      {error && <div style={styles.error}>Ошибка: {error}</div>}

      <form onSubmit={addTask} style={styles.form}>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Введите новую задачу..."
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Добавить
        </button>
      </form>

      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <ul style={styles.list}>
          {tasks.map(task => (
            <li key={task.id} style={styles.listItem}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={(e) => toggleTask(task.id, e.target.checked)}
                style={styles.checkbox}
              />
              <span style={{
                ...styles.taskTitle,
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? '#888' : '#000'
              }}>
                {task.title}
              </span>
            </li>
          ))}
        </ul>
      )}

      {tasks.length === 0 && !loading && (
        <p style={styles.emptyMessage}>Нет задач. Добавьте первую!</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  title: {
    textAlign: 'center' as const,
    color: '#333'
  },
  error: {
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: '#fee',
    border: '1px solid #fcc',
    borderRadius: '4px',
    color: '#c00'
  },
  form: {
    display: 'flex',
    marginBottom: '20px'
  },
  input: {
    flex: 1,
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px 0 0 4px'
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '0 4px 4px 0',
    cursor: 'pointer'
  },
  list: {
    listStyle: 'none',
    padding: 0
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    marginBottom: '8px',
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '4px'
  },
  checkbox: {
    marginRight: '10px',
    cursor: 'pointer',
    width: '18px',
    height: '18px'
  },
  taskTitle: {
    fontSize: '16px'
  },
  emptyMessage: {
    textAlign: 'center' as const,
    color: '#888',
    fontStyle: 'italic' as const
  }
};

export default App;
