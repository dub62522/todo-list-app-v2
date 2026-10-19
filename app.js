const STORAGE_KEY = 'todo-performance-demo.todos';
const todoList = document.getElementById('todo-list');
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const taskCount = document.getElementById('task-count');
const filters = [...document.querySelectorAll('.filter')];
const template = document.getElementById('todo-item-template');

const state = {
  filter: 'all',
  todos: loadTodos(),
  saveHandle: null,
};

function loadTodos() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const value = raw ? JSON.parse(raw) : [];
    return Array.isArray(value) ? value : [];
  } catch (error) {
    return [];
  }
}

function persistTodos() {
  if (state.saveHandle) {
    clearTimeout(state.saveHandle);
  }

  state.saveHandle = setTimeout(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos));
  }, 80);
}

function getVisibleTodos() {
  if (state.filter === 'active') {
    return state.todos.filter((todo) => !todo.completed);
  }

  if (state.filter === 'completed') {
    return state.todos.filter((todo) => todo.completed);
  }

  return state.todos;
}

function updateTaskCount() {
  const total = state.todos.length;
  const remaining = state.todos.filter((todo) => !todo.completed).length;

  taskCount.textContent = `${remaining} of ${total} task${total === 1 ? '' : 's'} left`;
}

function renderTodos() {
  const visibleTodos = getVisibleTodos();
  const fragment = document.createDocumentFragment();

  visibleTodos.forEach((todo) => {
    const node = template.content.firstElementChild.cloneNode(true);
    const checkbox = node.querySelector('.todo-checkbox');
    const text = node.querySelector('.todo-text');
    const deleteBtn = node.querySelector('.delete-btn');

    node.dataset.id = todo.id;
    node.classList.toggle('completed', todo.completed);
    checkbox.checked = todo.completed;
    text.textContent = todo.text;

    checkbox.addEventListener('change', () => toggleTodo(todo.id));
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

    fragment.appendChild(node);
  });

  todoList.replaceChildren(fragment);
  updateTaskCount();
}

function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) {
    return;
  }

  state.todos = [{
    id: crypto.randomUUID(),
    text: trimmed,
    completed: false,
  }, ...state.todos];

  persistTodos();
  renderTodos();
  todoInput.value = '';
  todoInput.focus();
}

function toggleTodo(id) {
  state.todos = state.todos.map((todo) => (
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  ));

  persistTodos();
  renderTodos();
}

function deleteTodo(id) {
  state.todos = state.todos.filter((todo) => todo.id !== id);

  persistTodos();
  renderTodos();
}

function setFilter(nextFilter) {
  state.filter = nextFilter;
  filters.forEach((button) => {
    const active = button.dataset.filter === nextFilter;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  renderTodos();
}

todoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  addTodo(todoInput.value);
});

filters.forEach((button) => {
  button.addEventListener('click', () => setFilter(button.dataset.filter));
});

renderTodos();
