// Initialize tasks from localStorage or empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// DOM Elements
const taskList = document.getElementById('task-list');
const addTaskBtn = document.getElementById('add-task-btn');
const taskModal = document.getElementById('task-modal');
const taskForm = document.getElementById('task-form');
const closeModal = document.getElementById('close-modal');
// Remove these lines
const navButtons = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page');

// Remove the navigation event listeners section
// Remove this entire block
/*
navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetPage = btn.dataset.page;
        navButtons.forEach(b => b.classList.remove('active'));
        pages.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(targetPage).classList.add('active');
        if (targetPage === 'progress') updateProgress();
    });
});
*/

// The rest of the JavaScript code remains the same
const themeToggle = document.getElementById('theme-toggle');

// Navigation
navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetPage = btn.dataset.page;
        navButtons.forEach(b => b.classList.remove('active'));
        pages.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(targetPage).classList.add('active');
        if (targetPage === 'progress') updateProgress();
    });
});

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
});

// Modal Controls
addTaskBtn.addEventListener('click', () => {
    taskModal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
    taskModal.style.display = 'none';
});

// Add New Task
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const task = {
        id: Date.now(),
        title: document.getElementById('task-title').value,
        priority: document.getElementById('task-priority').value,
        deadline: document.getElementById('task-deadline').value,
        description: document.getElementById('task-description').value,
        completed: false
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    updateProgress();
    taskForm.reset();
    taskModal.style.display = 'none';
});

// Render Tasks
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item priority-${task.priority}`;
        taskElement.innerHTML = `
            <div>
                <h3>${task.title}</h3>
                <p>Deadline: ${task.deadline}</p>
                <p>Priority: ${task.priority}</p>
            </div>
            <div>
                <button onclick="toggleTaskStatus(${task.id})">${task.completed ? 'Undo' : 'Complete'}</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
        taskList.appendChild(taskElement);
    });
    updateCounts();
}

// Toggle Task Status
function toggleTaskStatus(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateProgress();
    }
}

// Delete Task
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
    updateProgress();
}

// Update Progress
// Update the updateProgress function
function updateProgress() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const progressPercentage = total ? (completed / total) * 100 : 0;

    document.getElementById('overall-progress').style.width = `${progressPercentage}%`;
    document.getElementById('completion-rate').textContent = `${Math.round(progressPercentage)}%`;
    
    // Add this line for progress circle animation
    document.querySelector('.progress-circle').style.setProperty('--progress', `${progressPercentage}%`);

    // Rest of the function remains the same
    const priorities = { high: 0, medium: 0, low: 0 };
    tasks.forEach(task => priorities[task.priority]++);
    
    Object.keys(priorities).forEach(priority => {
        const percentage = total ? (priorities[priority] / total) * 100 : 0;
        document.getElementById(`${priority}-priority-fill`).style.width = `${percentage}%`;
    });
}

// Update Counts
function updateCounts() {
    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.length - completed;
    
    document.getElementById('completed-count').textContent = completed;
    document.getElementById('pending-count').textContent = pending;
}

// Save Tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Initial render
renderTasks();
updateProgress();