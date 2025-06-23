// ===== SELECTORS =====
const form = document.querySelector('form');
const inputBox = document.querySelector('.inputbox');
const todoList = document.querySelector('.TodoList ul');

// ===== LOAD SAVED TODOS ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', loadTodos);

// ===== EVENT LISTENERS =====
form.addEventListener('submit', addTodo);
todoList.addEventListener('click', handleListClick);

// ===== FUNCTIONS =====

// Load saved todos from localStorage
function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todo => createTodoElement(todo.text, todo.completed));
}

// Add new todo
function addTodo(e) {
    e.preventDefault();
    const text = inputBox.value.trim();
    if (text === '') return;

    createTodoElement(text, false);
    saveToLocalStorage(text, false);

    inputBox.value = '';
}

// Handle clicks on delete, check, rename
function handleListClick(e) {
    const li = e.target.closest('li');
    if (!li) return;

    const text = li.dataset.text;

    if (e.target.classList.contains('delete')) {
        li.remove();
        removeFromLocalStorage(text);
    }

    else if (e.target.classList.contains('checkbox')) {
        li.classList.toggle('completed');
        toggleCompleteInLocalStorage(text);
    }

    else if (e.target.classList.contains('rename')) {
        const newText = prompt("Rename the task:", text);
        if (newText && newText.trim() !== '') {
            updateTodoInDOM(li, newText);
            updateInLocalStorage(text, newText);
        }
    }
}

// Create <li> element and append to list
function createTodoElement(text, completed) {
    const li = document.createElement('li');
    li.dataset.text = text;
    if (completed) li.classList.add('completed');

    li.innerHTML = `
        <img src="check.svg" alt="check-icon" class="checkbox">
        ${text}
        <img src="rename.svg" alt="rename-icon" class="rename">
        <img src="delete.png" alt="delete-icon" class="delete">
    `;
    todoList.appendChild(li);
}

// Save new todo to localStorage
function saveToLocalStorage(text, completed) {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.push({ text, completed });
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Remove todo from localStorage
function removeFromLocalStorage(text) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos = todos.filter(todo => todo.text !== text);
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Toggle complete state in localStorage
function toggleCompleteInLocalStorage(text) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos = todos.map(todo => {
        if (todo.text === text) {
            todo.completed = !todo.completed;
        }
        return todo;
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Update todo in DOM and localStorage
function updateTodoInDOM(li, newText) {
    li.dataset.text = newText;
    li.childNodes[0].nodeValue = newText + ' ';
}

function updateInLocalStorage(oldText, newText) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos = todos.map(todo => {
        if (todo.text === oldText) {
            todo.text = newText;
        }
        return todo;
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}
// Clear all todos from localStorage