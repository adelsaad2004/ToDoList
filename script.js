const inputTask = document.getElementById('new-task');
const btnAddTask = document.getElementById('add-task-btn');
const taskList = document.getElementById('todo-list');
const btnDeleteDone = document.getElementById('delete-done-btn');
const btnDeleteAll = document.getElementById('delete-all-btn');
const filterBtns = {
  all: document.getElementById('all-btn'),
  done: document.getElementById('done-btn'),
  todo: document.getElementById('todo-btn'),
};
const errorText = document.getElementById('error-message');

let tasks = [];

function loadTasks() {
  const saved = localStorage.getItem('tasks');
  if (saved) {
    tasks = JSON.parse(saved);
  }
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks(filter = 'all') {
  taskList.innerHTML = '';
  const filtered = tasks.filter(task =>
    filter === 'all'
      ? true
      : filter === 'done'
      ? task.done
      : !task.done
  );

  if (filtered.length === 0) {
    const noTasks = document.createElement('p');
    noTasks.textContent = 'No Tasks';
    noTasks.style.textAlign = 'center';
    noTasks.style.color = '#888';
    noTasks.style.fontSize = '1.2rem';
    noTasks.style.marginTop = '20px';
    taskList.appendChild(noTasks);
    return;
  }

  filtered.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = task.done ? 'done' : '';
    li.innerHTML = `
      <span>${task.name}</span>
      <div>
        <input type="checkbox" ${task.done ? 'checked' : ''} onchange="toggleTask(${index})">
        <button class="edit-btn" onclick="editTask(${index})">✏️</button>
        <button class="delete-btn" onclick="confirmDelete(${index})">🗑️</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

function confirmDelete(index) {
  const msg = document.createElement('div');
  msg.textContent = 'Are you sure you want to delete this task?';
  msg.classList.add('confirm-delete');

  const confirmBtn = document.createElement('button');
  confirmBtn.textContent = 'Yes';
  confirmBtn.addEventListener('click', () => {
    deleteTask(index);
    msg.remove(); 
  });

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'No';
  cancelBtn.addEventListener('click', () => msg.remove());

  msg.appendChild(confirmBtn);
  msg.appendChild(cancelBtn);
  document.body.appendChild(msg);
}

function showMessage(msg) {
  const msgElement = document.createElement('div');
  msgElement.textContent = msg;
  msgElement.classList.add('message');
  document.body.appendChild(msgElement);

  setTimeout(() => {
    msgElement.classList.add('show');
  }, 10); 

  setTimeout(() => {
    msgElement.classList.add('delete');
    setTimeout(() => {
      msgElement.remove();
    }, 600);
  }, 3000);
}

function checkValidity(name) {
  if (name === '') {
    errorText.textContent = ''; 
    return true;
  }
  if (/[\u0600-\u06FF]/.test(name)) {
    errorText.textContent = 'No Arabic characters allowed.';
    return false;
  }
  if (/^\d/.test(name)) {
    errorText.textContent = 'Task name can\'t start with a number.';
    return false;
  }
  if (name.length < 5) {
    errorText.textContent = 'Name must be at least 5 characters.';
    return false;
  }
  if (/[^a-zA-Z0-9\s]/.test(name)) {
    errorText.textContent = 'No symbols allowed.';
    return false;
  }
  errorText.textContent = ''; 
  return true;
}

function addTask() {
  const name = inputTask.value.trim();
  if (checkValidity(name)) {
    tasks.push({ name: name, done: false });
    inputTask.value = '';
    saveTasks();
    renderTasks();
  }
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  renderTasks();
}

function editTask(index) {
  const taskItem = taskList.children[index];
  const taskText = taskItem.querySelector('span');

  const inputField = document.createElement('input');
  inputField.type = 'text';
  inputField.value = taskText.textContent;

  taskItem.replaceChild(inputField, taskText);
  inputField.focus();

  inputField.addEventListener('blur', () => {
    const newName = inputField.value.trim();
    if (newName && checkValidity(newName)) {
      tasks[index].name = newName;
      saveTasks();
      renderTasks();
      showMessage('Task edited!');
    } else {
      renderTasks();
    }
  });

  inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      inputField.blur();
    }
  });
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
  showMessage('Task deleted!');
}

function deleteDoneTasks() {
  const msg = document.createElement('div');
  msg.textContent = 'Are you sure you want to delete all completed tasks?';
  msg.classList.add('confirm-delete');

  const confirmBtn = document.createElement('button');
  confirmBtn.textContent = 'Yes';
  confirmBtn.addEventListener('click', () => {
    tasks = tasks.filter(task => !task.done);
    saveTasks();
    renderTasks();
    showMessage('Completed tasks deleted!');
    msg.remove();
  });

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'No';
  cancelBtn.addEventListener('click', () => msg.remove());

  msg.appendChild(confirmBtn);
  msg.appendChild(cancelBtn);
  document.body.appendChild(msg);
}

function deleteAllTasks() {
  const msg = document.createElement('div');
  msg.textContent = 'Are you sure you want to delete all tasks?';
  msg.classList.add('confirm-delete');

  const confirmBtn = document.createElement('button');
  confirmBtn.textContent = 'Yes';
  confirmBtn.addEventListener('click', () => {
    tasks = [];
    saveTasks();
    renderTasks();
    showMessage('All tasks deleted!');
    msg.remove();
  });

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'No';
  cancelBtn.addEventListener('click', () => msg.remove());

  msg.appendChild(confirmBtn);
  msg.appendChild(cancelBtn);
  document.body.appendChild(msg);
}

inputTask.addEventListener('input', () => {
  const taskName = inputTask.value.trim();
  checkValidity(taskName); 
});

btnAddTask.addEventListener('click', addTask);
btnDeleteDone.addEventListener('click', deleteDoneTasks);
btnDeleteAll.addEventListener('click', deleteAllTasks);
filterBtns.all.addEventListener('click', () => renderTasks('all'));
filterBtns.done.addEventListener('click', () => renderTasks('done'));
filterBtns.todo.addEventListener('click', () => renderTasks('todo'));

loadTasks();
renderTasks();
