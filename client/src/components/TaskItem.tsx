import type { Task } from "../types";

type Props = {
    task: Task;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
};

export function TaskItem({ task, onToggle, onDelete }: Props) {
    const done = task.status === "done";
    return (
        <li style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="checkbox" checked={done} onChange={() => onToggle(task.id)} />
            <span style={{ textDecoration: done ? "line-through" : "none" }}>{task.title}</span>
            <button onClick={() => onDelete(task.id)}>Delete</button>
        </li>
    );
}