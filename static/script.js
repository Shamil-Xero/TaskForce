const API_URL = '/tasks';
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

// Load initially
document.addEventListener('DOMContentLoaded', fetchTasks);

taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = taskInput.value.trim();
    if (!title) return;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });
        
        if (response.ok) {
            taskInput.value = '';
            fetchTasks();
        }
    } catch (err) {
        console.error("Error creating task", err);
    }
});

async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        renderTasks(data.tasks);
    } catch (err) {
        console.error("Error fetching tasks", err);
        renderEmptyState("Failed to load tasks. Check API connections.");
    }
}

async function toggleTask(id, currentStatus) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ done: !currentStatus })
        });
        fetchTasks();
    } catch (err) {
        console.error("Error updating task", err);
    }
}

async function deleteTask(id, element) {
    // Add visual removal queue before database purge
    element.style.animation = "slideOut 0.3s forwards";
    
    setTimeout(async () => {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            fetchTasks();
        } catch (err) {
            console.error("Error deleting task", err);
        }
    }, 300);
}

function renderTasks(tasks) {
    if (!tasks || tasks.length === 0) {
        renderEmptyState("All tasks completed.");
        return;
    }

    // Sort: pending first, completed last
    tasks.sort((a, b) => a.done === b.done ? 0 : a.done ? 1 : -1);

    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.done ? 'completed' : ''}`;
        
        li.innerHTML = `
            <div class="task-content" onclick="toggleTask(${task.id}, ${task.done})">
                <div class="checkbox">
                    <i class="fa-solid fa-check"></i>
                </div>
                <span class="task-text">${escapeHTML(task.title)}</span>
            </div>
            <button class="delete-btn" onclick="deleteTask(${task.id}, this.parentElement)" aria-label="Delete Task">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        
        taskList.appendChild(li);
    });
}

function renderEmptyState(message) {
    taskList.innerHTML = `
        <div class="empty-state" style="animation: slideIn 0.5s ease forwards">
            <i class="fa-solid fa-check-double drop-glow"></i>
            <p>${message}</p>
        </div>
    `;
}

// Basic anti-XSS
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
