import { Router } from "express"

type Task = { id: number; title: string, status: "todo" | "in-progress" | "done" }

export const taskRouter = Router()
let tasks: Task[] = []
let nextId = 1

taskRouter.get("/", (_req, res) => {
    res.json(tasks)
})

taskRouter.post("/", (req, res) => {
    const { title } = req.body ?? {}
    if (typeof title !== "string" || !title.trim()) {
        res.status(422).json({ message: "title is required" })
        return
    }
    const task: Task = { id: nextId++, title: title.trim(), status: "todo" }
    tasks.push(task)
    res.status(201).json(task)
})

taskRouter.patch("/:id", (req, res) => {
    const task = tasks.find((t) => t.id === Number(req.params.id))
    if (!task) {
        res.status(404).json({ message: "Task not found" })
        return
    }
    Object.assign(task, req.body)
    res.json(task)
})

taskRouter.delete("/:id", (req, res) => {
    tasks = tasks.filter((t) => t.id !== Number(req.params.id))
    res.status(204).end()
})