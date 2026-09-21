import { Link, useParams } from "react-router-dom";
import { useTasks } from "../context/TasksContext";

export default function TaskDetailPage() {
    const { id } = useParams();
    const { tasks } = useTasks();
    const task = tasks.find((t) => t.id === Number(id));
    if (!task) return <p>Task not found. <Link to="/tasks">Back</Link></p>
    return <h2>{task.title} ({task.status})</h2>
}