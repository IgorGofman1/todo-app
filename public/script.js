const API_URL = '/api/todos';

const form = document.getElementById('todo-form');
const titleInput = document.getElementById('title');
const priorityInput = document.getElementById('priority');
const list = document.getElementById('todo-list');
const loading = document.getElementById('loading');
const message = document.getElementById('message');

function showMessage(text) {
  message.textContent = text;
}

function setLoading(isLoading) {
  loading.hidden = !isLoading;
}

// Помощник: отправляет запрос и разбирает ответ
async function request(url, options) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Chyba serveru (' + response.status + ')');
  }
  return data;
}

// Создать одну строку списка
function renderTodo(todo) {
  const li = document.createElement('li');
  li.className = 'todo priority-' + todo.priority + (todo.done ? ' done' : '');

  // Галочка "выполнено"
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = todo.done;
  checkbox.addEventListener('change', () => toggleTodo(todo._id, checkbox.checked));

  // Название
  const text = document.createElement('span');
  text.className = 'title';
  text.textContent = todo.title;

  // Приоритет
  const badge = document.createElement('span');
  badge.className = 'badge';
  badge.textContent = todo.priority;

  // Кнопка удаления
  const del = document.createElement('button');
  del.className = 'delete';
  del.textContent = '✕';
  del.title = 'Smazat';
  del.addEventListener('click', () => deleteTodo(todo._id));

  li.append(checkbox, text, badge, del);
  return li;
}

// Нарисовать весь список
function renderList(todos) {
  list.replaceChildren();

  if (todos.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty';
    empty.textContent = 'Zatím žádné úkoly.';
    list.append(empty);
    return;
  }

  todos.forEach((todo) => list.append(renderTodo(todo)));
}

// Загрузить задачи с сервера
async function loadTodos() {
  setLoading(true);
  try {
    const todos = await request(API_URL);
    renderList(todos);
    showMessage('');
  } catch (err) {
    showMessage(err.message);
  } finally {
    setLoading(false);
  }
}

// Добавить задачу
async function addTodo(event) {
  event.preventDefault();

  const title = titleInput.value.trim();
  if (!title) {
    showMessage('Zadejte název úkolu.');
    return;
  }

  try {
    await request(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title, priority: priorityInput.value }),
    });
    form.reset();
    await loadTodos();
  } catch (err) {
    showMessage(err.message);
  }
}

// Отметить выполненной / невыполненной
async function toggleTodo(id, done) {
  try {
    await request(API_URL + '/' + id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: done }),
    });
    await loadTodos();
  } catch (err) {
    showMessage(err.message);
  }
}

// Удалить задачу
async function deleteTodo(id) {
  try {
    await request(API_URL + '/' + id, { method: 'DELETE' });
    await loadTodos();
  } catch (err) {
    showMessage(err.message);
  }
}

form.addEventListener('submit', addTodo);
loadTodos();