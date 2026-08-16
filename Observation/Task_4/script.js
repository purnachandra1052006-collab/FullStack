// 1. Select DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const emptyMessage = document.getElementById('emptyMessage');

// Helper function to update the visibility of the "No tasks available" message
function updateEmptyMessage() {
  if (taskList.children.length === 0) {
    emptyMessage.style.display = 'block';
  } else {
    emptyMessage.style.display = 'none';
  }
}

// Function to handle adding a new task
function addTask() {
  const taskText = taskInput.value.trim();

  // Prevent adding empty tasks
  if (taskText === '') return;

  // 2. Dynamic Element Creation
  const li = document.createElement('li');
  li.className = 'task-item';

  const textSpan = document.createElement('span');
  textSpan.className = 'task-text';
  textSpan.textContent = taskText;

  const btnGroup = document.createElement('div');
  btnGroup.className = 'btn-group';

  const completeBtn = document.createElement('button');
  completeBtn.className = 'complete-btn';
  completeBtn.textContent = 'Complete';

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = 'Delete';

  // Assembly of task item components
  btnGroup.appendChild(completeBtn);
  btnGroup.appendChild(deleteBtn);
  li.appendChild(textSpan);
  li.appendChild(btnGroup);

  // 3. Dynamic Modification of DOM & Event Listeners
  
  // Toggle complete state visually
  completeBtn.addEventListener('click', function () {
    li.classList.toggle('completed');
  });

  // Remove task item from DOM
  deleteBtn.addEventListener('click', function () {
    li.remove();
    updateEmptyMessage(); // Check if list is empty after removal
  });

  // Append new task to the list
  taskList.appendChild(li);

  // Clear input field and refresh empty state
  taskInput.value = '';
  updateEmptyMessage();
}

// 4. Event Listeners for User Interaction
addTaskBtn.addEventListener('click', addTask);

// Support pressing "Enter" key to add a task
taskInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    addTask();
  }
});

// Initial check on page load
updateEmptyMessage();