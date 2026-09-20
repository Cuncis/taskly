import { useState, useEffect, type FormEvent } from 'react'
import { useLocalStorage } from "./hooks/useLocalStorage"
import { TaskItem } from "./components/TaskItem"
import type { Status, Task } from "./types";

const nextStatus = (s: Status): Status => (s === "done" ? "todo" : "done")

export default function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", [])
  const [filter, setFilter] = useState<Status | "all">("all")
  const [title, setTitle] = useState("")

  const visible = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);
  const remaining = tasks.filter((t) => t.status !== "done").length;

  useEffect(() => {
    document.title = `Taskly (${remaining})`;
  }, [remaining]);

  function addTask(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return;

    setTasks((prev) => [...prev, { id: Date.now(), title: title.trim(), status: "todo" }])
    setTitle("")
  }

  function toggleTask(id: number) {
    setTasks((prev) => prev.map((t) => (t.id === id) ? { ...t, status: nextStatus(t.status) } : t))
  }

  function deleteTask(id: number) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <main style={{ maxWidth: 480, margin: "40px auto" }}>
      <h1>Taskly</h1>
      <form onSubmit={addTask}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New task" />
        <button type="submit">Add</button>
      </form>

      <div style={{ display: "flex", gap: "8px", margin: "16px 0" }}>
        {(["all", "todo", "in-progress", "done"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} disabled={filter === f}>
            {f}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <ul>
          {visible.map((t) => (
            <TaskItem key={t.id} task={t} onToggle={toggleTask} onDelete={deleteTask} />
          ))}
        </ul>
      )}
    </main>
  )
}
