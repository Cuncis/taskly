import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TaskItem } from "../components/TaskItem";
import { api } from "../lib/api";
import type { Status, Task } from "../types";

type TaskList = { items: Task[]; total: number; page: number; limit: number }

const nextToggleStatus = (s: Status): Status => (s === "done" ? "todo" : "done")

export default function TasksPage() {
    const qc = useQueryClient()
    const [title, setTitle] = useState("")

    const { data, isPending, error } = useQuery({
        queryKey: ["tasks"],
        queryFn: () => api<TaskList>("/tasks")
    })

    const refresh = () => qc.invalidateQueries({ queryKey: ["tasks"] })

    const create = useMutation({
        mutationFn: (title: string) => api<Task>("/tasks", { method: "POST", body: JSON.stringify({ title }) }),
        onSuccess: () => {
            setTitle("")
            return refresh()
        }
    })
    
    const toggle = useMutation({
        mutationFn: (t: Task) => api<Task>(`/tasks/${t.id}`, {
            method: "PATCH",
            body: JSON.stringify({ status: nextToggleStatus(t.status) })
        }),
        onMutate: async (t) => {
            await qc.cancelQueries({ queryKey: ["tasks"] })
            const previous = qc.getQueryData<TaskList>(["tasks"])

            qc.setQueryData<TaskList>(["tasks"], (old) =>
                old
                    ? {
                        ...old,
                        items: old.items.map((item) =>
                            item.id === t.id ? { ...item, status: nextToggleStatus(item.status) } : item
                        ),
                    }
                    : old
            )

            return { previous }
        },
        onError: (_err, _t, context) => {
            if (context?.previous) qc.setQueryData(["tasks"], context.previous)
        },
        onSettled: refresh
    })

    const remove = useMutation({
        mutationFn: (id: number) => api<void>(`/tasks/${id}`, { method: "DELETE" }),
        onSuccess: refresh
    })

    function onSubmit(e: FormEvent) {
        e.preventDefault()
        if (title.trim()) create.mutate(title.trim())
    }

    if (isPending) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>

    return (
        <>
            <h2>My tasks ({data.total})</h2>
            <form onSubmit={onSubmit}>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New task" />
                <button disabled={create.isPending}>Add</button>
            </form>
            {create.error && <p role="alert">{create.error.message}</p>}
            <ul>
                {data.items.map((t) => (
                <TaskItem key={t.id} task={t} onToggle={() => toggle.mutate(t)} onDelete={remove.mutate} />
                ))}
            </ul>
        </>
    )
}