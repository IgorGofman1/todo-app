require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Схема: как выглядит одна задача в базе
const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    priority: { type: String, enum: ['nízká', 'střední', 'vysoká'], default: 'střední' },
    done: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Todo = mongoose.model('Todo', todoSchema);

// GET /api/todos: вернуть все задачи (новые сверху)
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Nepodařilo se načíst úkoly.' });
  }
});

// POST /api/todos: проверить данные и сохранить новую задачу
app.post('/api/todos', async (req, res) => {
  try {
    const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
    const priority = req.body.priority || 'střední';

    if (!title) {
      return res.status(400).json({ error: 'Název úkolu nesmí být prázdný.' });
    }
    if (!['nízká', 'střední', 'vysoká'].includes(priority)) {
      return res.status(400).json({ error: 'Neplatná priorita.' });
    }

    const todo = await Todo.create({ title, priority });
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ error: 'Nepodařilo se uložit úkol.' });
  }
});

// PATCH /api/todos/:id: отметить задачу выполненной / невыполненной
app.patch('/api/todos/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Neplatné ID.' });
    }
    if (typeof req.body.done !== 'boolean') {
      return res.status(400).json({ error: 'Pole "done" musí být true/false.' });
    }

    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { done: req.body.done },
      { new: true }
    );
    if (!todo) return res.status(404).json({ error: 'Úkol nenalezen.' });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: 'Nepodařilo se upravit úkol.' });
  }
});

// DELETE /api/todos/:id: удалить задачу
app.delete('/api/todos/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Neplatné ID.' });
    }

    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ error: 'Úkol nenalezen.' });
    res.json({ message: 'Úkol smazán.' });
  } catch (err) {
    res.status(500).json({ error: 'Nepodařilo se smazat úkol.' });
  }
});

// Сначала подключаемся к базе, и только потом запускаем сервер
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Připojeno k MongoDB');
    app.listen(PORT, () => console.log(`Server běží na http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Chyba připojení k MongoDB:', err.message);
    process.exit(1);
  });