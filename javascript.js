
const taskList = document.getElementById("taskList");
const taskModal = document.getElementById("taskModal");
const taskForm = document.getElementById("taskForm");

let tasks = JSON.parse(localStorage.getItem("taskflowTasks")) || [
    {
        id: 1,
        title: "Complete Python Assignment",
        category: "Programming",
        date: "2026-11-21",
        priority: "High",
        completed: false
    },
    {
        id: 2,
        title: "Prepare Mathematics Notes",
        category: "Mathematics",
        date: "2026-11-22",
        priority: "Medium",
        completed: false
    },
    {
        id: 3,
        title: "Build Portfolio Website",
        category: "Project",
        date: "2026-11-24",
        priority: "High",
        completed: false
    },
    {
        id: 4,
        title: "Read Science Chapter",
        category: "Science",
        date: "2026-11-19",
        priority: "Low",
        completed: true
    }
];

function saveTasks() {
    localStorage.setItem("taskflowTasks", JSON.stringify(tasks));
}

function renderTasks() {
    const search = document.getElementById("searchInput").value.toLowerCase();
    const filter = document.getElementById("filterSelect").value;

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(search) ||
            task.category.toLowerCase().includes(search);

        const matchesFilter =
            filter === "all" ||
            (filter === "completed" && task.completed) ||
            (filter === "pending" && !task.completed);

        return matchesSearch && matchesFilter;
    });

    taskList.innerHTML = "";

    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<div class="empty-state">No tasks found. Add a new task!</div>';
    }

    filteredTasks.forEach(task => {
        const item = document.createElement("div");
        item.className = "task-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => toggleTask(task.id));

        const info = document.createElement("div");
        info.className = "task-info" + (task.completed ? " completed" : "");

        const heading = document.createElement("h4");
        heading.textContent = task.title;

        const details = document.createElement("p");
        details.textContent = `${task.category} · Due ${formatDate(task.date)}`;

        info.append(heading, details);

        const priority = document.createElement("span");
        priority.className = `priority ${task.priority}`;
        priority.textContent = task.priority;

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "task-delete";
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
        deleteBtn.addEventListener("click", () => deleteTask(task.id));

        item.append(checkbox, info, priority, deleteBtn);
        taskList.appendChild(item);
    });

    updateStats();
}

function formatDate(date) {
    return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short"
    });
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("pendingTasks").textContent = pending;
    document.getElementById("progressPercent").textContent = percentage + "%";

    document.getElementById("circlePercent").textContent = percentage + "%";
    document.getElementById("legendCompleted").textContent = completed;
    document.getElementById("legendPending").textContent = pending;

    document.getElementById("progressCircle").style.background =
        `conic-gradient(#8065ed ${percentage * 3.6}deg, #eeecf4 0deg)`;
}

function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id ? {...task, completed: !task.completed} : task
    );

    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    if (!confirm("Are you sure you want to delete this task?")) return;

    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
    showToast("Task deleted successfully!");
}

function openModal() {
    taskModal.classList.add("show");
}

function closeModal() {
    taskModal.classList.remove("show");
}

taskForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const title = document.getElementById("taskTitle").value.trim();
    const category = document.getElementById("taskCategory").value;
    const date = document.getElementById("taskDate").value;
    const priority = document.getElementById("taskPriority").value;

    if (!title || !date) return;

    tasks.unshift({
        id: Date.now(),
        title,
        category,
        date,
        priority,
        completed: false
    });

    saveTasks();
    renderTasks();
    taskForm.reset();
    closeModal();

    showToast("New task added successfully!");
});

document.getElementById("searchInput").addEventListener("input", renderTasks);
document.getElementById("filterSelect").addEventListener("change", renderTasks);

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

taskModal.addEventListener("click", function(e) {
    if (e.target === taskModal) closeModal();
});

document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") closeModal();
});

document.getElementById("currentDate").textContent =
    new Date().toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
    });

renderTasks();
