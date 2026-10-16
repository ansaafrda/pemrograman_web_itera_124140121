const STORAGE_KEY = "ruangBelajarTasks";
const SAMPLE_TASKS_ENDPOINT = "https://jsonplaceholder.typicode.com/todos?_limit=5";
const PRIORITY_LABELS = {
  normal: "Santai",
  medium: "Penting",
  high: "Mendesak",
};

class TaskItem {
  constructor({
    id = TaskItem.createId(),
    title = "",
    course = "",
    dueDate = "",
    priority = "normal",
    notes = "",
    completed = false,
    createdAt = new Date().toISOString(),
  } = {}) {
    this.id = String(id);
    this.title = String(title).trim();
    this.course = String(course).trim();
    this.dueDate = String(dueDate);
    this.priority = Object.hasOwn(PRIORITY_LABELS, priority) ? priority : "normal";
    this.notes = String(notes).trim();
    this.completed = Boolean(completed);
    this.createdAt = String(createdAt);
  }

  static createId() {
    return globalThis.crypto?.randomUUID?.() ?? `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  static from(data) {
    return new TaskItem(data);
  }
}

class DashboardApp {
  constructor() {
    this.tasks = this.loadTasks();
    this.filter = "all";
    this.query = "";
    this.toastTimeout = null;

    this.elements = {
      date: document.getElementById("today-date"),
      taskContainer: document.getElementById("task-container"),
      taskSearch: document.getElementById("task-search"),
      taskDialog: document.getElementById("task-dialog"),
      taskForm: document.getElementById("task-form"),
      taskId: document.getElementById("task-id"),
      taskTitle: document.getElementById("task-title"),
      taskCourse: document.getElementById("task-course"),
      taskDueDate: document.getElementById("task-due-date"),
      taskPriority: document.getElementById("task-priority"),
      taskNotes: document.getElementById("task-notes"),
      dialogTitle: document.getElementById("dialog-title"),
      formError: document.getElementById("form-error"),
      toast: document.getElementById("toast"),
    };
  }

  init() {
    this.setDate();
    this.bindEvents();
    this.render();
  }

  loadTasks() {
    try {
      const storedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      if (!Array.isArray(storedTasks)) return [];

      return storedTasks
        .filter((task) => task && typeof task === "object" && task.title && task.course && task.dueDate)
        .map((task) => TaskItem.from(task));
    } catch (error) {
      console.warn("Data tugas lokal tidak dapat dibaca.", error);
      return [];
    }
  }

  saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
      return true;
    } catch (error) {
      console.error("Data tugas tidak dapat disimpan.", error);
      this.showToast("Penyimpanan browser tidak tersedia. Perubahan belum tersimpan.", true);
      return false;
    }
  }

  setDate() {
    const now = new Date();
    this.elements.date.textContent = now.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  bindEvents() {
    document.getElementById("add-task-button").addEventListener("click", () => this.openDialog());
    document.getElementById("close-dialog").addEventListener("click", () => this.elements.taskDialog.close());
    document.getElementById("cancel-dialog").addEventListener("click", () => this.elements.taskDialog.close());

    this.elements.taskForm.addEventListener("submit", (event) => this.handleSubmit(event));
    this.elements.taskContainer.addEventListener("click", (event) => this.handleTaskAction(event));
    this.elements.taskSearch.addEventListener("input", (event) => {
      this.query = event.currentTarget.value.trim().toLocaleLowerCase("id-ID");
      this.renderTasks();
    });

    document.querySelectorAll("[data-filter]").forEach((button) => {
      button.addEventListener("click", () => this.setFilter(button.dataset.filter));
    });

    this.elements.taskDialog.addEventListener("click", (event) => {
      if (event.target === this.elements.taskDialog) this.elements.taskDialog.close();
    });
  }

  openDialog(task = null) {
    this.elements.taskForm.reset();
    this.elements.formError.textContent = "";
    this.elements.taskId.value = task?.id ?? "";
    this.elements.taskTitle.value = task?.title ?? "";
    this.elements.taskCourse.value = task?.course ?? "";
    this.elements.taskDueDate.value = task?.dueDate ?? "";
    this.elements.taskPriority.value = task?.priority ?? "normal";
    this.elements.taskNotes.value = task?.notes ?? "";
    this.elements.dialogTitle.textContent = task ? "Edit tugas" : "Tambah tugas";
    this.elements.taskDialog.showModal();
    this.elements.taskTitle.focus();
  }

  handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(this.elements.taskForm);
    const title = String(formData.get("title") ?? "").trim();
    const course = String(formData.get("course") ?? "").trim();
    const dueDate = String(formData.get("dueDate") ?? "");

    if (!title || !course || !dueDate) {
      this.elements.formError.textContent = "Nama tugas, mata kuliah, dan tenggat wajib diisi.";
      return;
    }

    const id = String(formData.get("id") ?? "");
    const existingTask = this.tasks.find((task) => task.id === id);
    const task = new TaskItem({
      id: id || TaskItem.createId(),
      title,
      course,
      dueDate,
      priority: String(formData.get("priority") ?? "normal"),
      notes: String(formData.get("notes") ?? ""),
      completed: existingTask?.completed ?? false,
      createdAt: existingTask?.createdAt ?? new Date().toISOString(),
    });

    this.tasks = existingTask
      ? this.tasks.map((currentTask) => currentTask.id === id ? task : currentTask)
      : [task, ...this.tasks];

    const saved = this.saveTasks();
    this.elements.taskDialog.close();
    this.render();
    if (saved) this.showToast(existingTask ? "Tugas berhasil diperbarui." : "Tugas berhasil ditambahkan.");
  }

  handleTaskAction(event) {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    if (button.dataset.action === "add") {
      this.openDialog();
      return;
    }
    if (button.dataset.action === "load-samples") {
      this.loadSampleTasks(button);
      return;
    }

    const card = button.closest("[data-id]");
    const task = this.tasks.find((item) => item.id === card?.dataset.id);
    if (!task) return;

    if (button.dataset.action === "edit") {
      this.openDialog(task);
      return;
    }

    if (button.dataset.action === "delete") {
      this.tasks = this.tasks.filter((item) => item.id !== task.id);
      const saved = this.saveTasks();
      this.render();
      if (saved) this.showToast("Tugas dihapus dari daftar.");
      return;
    }

    if (button.dataset.action === "toggle") {
      this.tasks = this.tasks.map((item) => item.id === task.id
        ? new TaskItem({ ...item, completed: !item.completed })
        : item);
      this.saveTasks();
      this.render();
    }
  }

  setFilter(filter) {
    this.filter = filter;
    document.querySelectorAll("[data-filter]").forEach((button) => {
      const selected = button.dataset.filter === filter;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    this.renderTasks();
  }

  getVisibleTasks() {
    let visibleTasks = this.tasks;
    if (this.filter === "active") visibleTasks = visibleTasks.filter((task) => !task.completed);
    if (this.filter === "completed") visibleTasks = visibleTasks.filter((task) => task.completed);
    if (this.query) {
      visibleTasks = visibleTasks.filter((task) => {
        const searchableText = `${task.title} ${task.course} ${task.notes}`.toLocaleLowerCase("id-ID");
        return searchableText.includes(this.query);
      });
    }
    return visibleTasks;
  }

  render() {
    this.renderStats();
    this.renderTasks();
  }

  renderStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter((task) => task.completed).length;
    const active = total - completed;

    document.getElementById("stat-total").textContent = total;
    document.getElementById("stat-active").textContent = active;
    document.getElementById("stat-done").textContent = completed;
    document.getElementById("filter-all-count").textContent = total;
    document.getElementById("filter-active-count").textContent = active;
    document.getElementById("filter-completed-count").textContent = completed;
  }

  renderTasks() {
    const visibleTasks = this.getVisibleTasks();
    if (visibleTasks.length === 0) {
      this.elements.taskContainer.innerHTML = this.renderEmptyState();
      return;
    }

    this.elements.taskContainer.innerHTML = visibleTasks
      .map((task) => this.renderTask(task))
      .join("");
  }

  renderEmptyState() {
    const hasTasks = this.tasks.length > 0;
    const title = this.query
      ? "Belum ada tugas yang cocok"
      : hasTasks
        ? "Belum ada tugas di bagian ini"
        : "Ruangmu masih kosong";
    const message = this.query
      ? "Coba kata kunci lain atau hapus pencarianmu."
      : hasTasks
        ? "Pilih filter lain untuk melihat tugasmu."
        : "Catat tugas kuliah pertamamu agar semua rencana punya tempat.";
    const actions = !hasTasks && !this.query
      ? `<div class="empty-actions">
          <button class="button button-primary empty-add" type="button" data-action="add">＋ Tambah tugas</button>
          <button class="button button-quiet empty-samples" type="button" data-action="load-samples">Muat contoh tugas</button>
        </div>`
      : "";

    return `<div class="empty-state">
      <span class="empty-illustration" aria-hidden="true">✧</span>
      <strong>${this.escapeHtml(title)}</strong>
      <p>${this.escapeHtml(message)}</p>
      ${actions}
    </div>`;
  }

  renderTask(task) {
    const today = this.getLocalDate();
    const isOverdue = !task.completed && task.dueDate < today;
    const dueClass = isOverdue ? "task-due is-overdue" : "task-due";
    const dueLabel = this.formatDueDate(task.dueDate, isOverdue);
    const priorityClass = `priority-${task.priority}`;
    const notes = task.notes
      ? `<p class="task-notes">${this.escapeHtml(task.notes)}</p>`
      : "";

    return `<article class="task-card${task.completed ? " is-complete" : ""}" data-id="${this.escapeHtml(task.id)}">
      <button class="task-toggle" type="button" data-action="toggle" aria-label="${task.completed ? "Tandai belum selesai" : "Tandai selesai: " + this.escapeHtml(task.title)}" aria-pressed="${task.completed}"></button>
      <div class="task-copy">
        <h3 class="task-title">${this.escapeHtml(task.title)}</h3>
        <span class="task-course">${this.escapeHtml(task.course)}</span>
        <span class="priority-badge ${priorityClass}">${PRIORITY_LABELS[task.priority]}</span>
        <span class="${dueClass}"><span aria-hidden="true">◷</span> ${this.escapeHtml(dueLabel)}</span>
        ${notes}
      </div>
      <div class="task-actions">
        <button class="icon-button" type="button" data-action="edit" aria-label="Edit ${this.escapeHtml(task.title)}" title="Edit tugas">✎</button>
        <button class="icon-button" type="button" data-action="delete" aria-label="Hapus ${this.escapeHtml(task.title)}" title="Hapus tugas">×</button>
      </div>
    </article>`;
  }

  formatDueDate(dateString, isOverdue) {
    const dueDate = new Date(`${dateString}T00:00:00`);
    if (Number.isNaN(dueDate.getTime())) return "Tenggat tidak valid";
    if (!isOverdue && dateString === this.getLocalDate()) return "Tenggat hari ini";

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (!isOverdue && dateString === this.toLocalDate(tomorrow)) return "Tenggat besok";

    const formatted = dueDate.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    return isOverdue ? `Terlambat · ${formatted}` : `Tenggat ${formatted}`;
  }

  getLocalDate() {
    return this.toLocalDate(new Date());
  }

  toLocalDate(date) {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 10);
  }

  async loadSampleTasks(button) {
    const originalLabel = button.textContent;
    button.disabled = true;
    button.textContent = "Memuat contoh…";
    button.setAttribute("aria-busy", "true");

    try {
      const response = await fetch(SAMPLE_TASKS_ENDPOINT, { signal: AbortSignal.timeout(8000) });
      if (!response.ok) throw new Error(`Permintaan contoh tugas gagal (${response.status}).`);
      const todos = await response.json();
      if (!Array.isArray(todos) || todos.length === 0) throw new Error("API tidak mengembalikan contoh tugas.");

      const sampleTasks = todos.slice(0, 5).map(({ title, completed }, index) => {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + index + 1);
        return new TaskItem({
          title: `Contoh ${index + 1}: ${title}`,
          course: "Contoh API",
          dueDate: this.toLocalDate(dueDate),
          priority: "normal",
          notes: "Contoh dari JSONPlaceholder · bisa diedit atau dihapus.",
          completed,
        });
      });

      this.tasks = [...sampleTasks, ...this.tasks];
      const saved = this.saveTasks();
      this.render();
      if (saved) this.showToast(`${sampleTasks.length} contoh tugas berhasil dimuat.`);
    } catch (error) {
      console.warn("Contoh tugas tidak dapat dimuat.", error);
      this.showToast("Contoh tugas gagal dimuat. Periksa koneksi lalu coba lagi.", true);
      button.disabled = false;
      button.textContent = originalLabel;
      button.removeAttribute("aria-busy");
    }
  }

  showToast(message, isError = false) {
    const { toast } = this.elements;
    window.clearTimeout(this.toastTimeout);
    toast.textContent = message;
    toast.classList.toggle("is-error", isError);
    toast.classList.add("is-visible");
    this.toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
  }

  escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[character]);
  }
}

const dashboard = new DashboardApp();
dashboard.init();
