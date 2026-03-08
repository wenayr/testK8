import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Task interface
interface Task {
  id: number;
  title: string;
  completed: boolean;
}

// In-memory storage
let tasks: Task[] = [];
let nextId = 1;

// Routes

// GET /api/tasks - получить список всех задач
app.get('/api/tasks', (req: Request, res: Response) => {
  res.json(tasks);
});

// POST /api/tasks - создать новую задачу
app.post('/api/tasks', (req: Request, res: Response) => {
  const { title } = req.body;

  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Title is required and must be a string' });
  }

  const newTask: Task = {
    id: nextId++,
    title,
    completed: false
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /api/tasks/:id - изменить статус задачи
app.put('/api/tasks/:id', (req: Request, res: Response) => {
  // @ts-ignore
  const id = parseInt(req.params.id);
  const { completed } = req.body;

  if (typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Completed must be a boolean' });
  }

  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  task.completed = completed;
  res.json(task);
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
