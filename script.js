const taskInput = document.getElementById('new-task');
const addTaskBtn = document.getElementById('add-task-btn');
const todoList = document.getElementById('todo-list');
const deleteDoneBtn = document.getElementById('delete-done-btn');
const deleteAllBtn = document.getElementById('delete-all-btn');
const filterButtons = {
  all: document.getElementById('all-btn'),
  done: document.getElementById('done-btn'),
  todo: document.getElementById('todo-btn'),
};

let tasks = [];

function renderTasks(filter = 'all') {
  todoList.innerHTML = '';
  const filteredTasks = tasks.filter(task =>
    filter === 'all'
      ? true
      : filter === 'done'
      ? task.done
      : !task.done
  );

  filteredTasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = task.done ? 'done' : '';
    li.innerHTML = `
      <span>${task.name}</span>
      <div>
        <input type="checkbox" ${task.done ? 'checked' : ''} onchange="toggleTask(${index})">
        <button class="edit-btn" onclick="editTask(${index})">✏️</button>
        <button class="delete-btn" onclick="deleteTask(${index})">🗑️</button>
      </div>
    `;
    todoList.appendChild(li);
  });
}

function addTask() {
  const taskName = taskInput.value.trim();
  if (taskName) {
    tasks.push({ name: taskName, done: false });
    taskInput.value = '';
    renderTasks();
  }
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  renderTasks();
}

function editTask(index) {
  const newName = prompt('Edit task name:', tasks[index].name);
  if (newName) {
    tasks[index].name = newName;
    renderTasks();
  }
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

function deleteDoneTasks() {
  tasks = tasks.filter(task => !task.done);
  renderTasks();
}

function deleteAllTasks() {
  tasks = [];
  renderTasks();
}

addTaskBtn.addEventListener('click', addTask);
deleteDoneBtn.addEventListener('click', deleteDoneTasks);
deleteAllBtn.addEventListener('click', deleteAllTasks);
filterButtons.all.addEventListener('click', () => renderTasks('all'));
filterButtons.done.addEventListener('click', () => renderTasks('done'));
filterButtons.todo.addEventListener('click', () => renderTasks('todo'));

renderTasks();
