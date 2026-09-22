import type { Request, Response } from "express";
import { parseId } from "../lib/http";
import { createTaskSchema, listQuerySchema, updateTaskSchema } from "../schemas/task.schema";
import * as service from "../services/task.service";

export async function index(req: Request, res: Response) {
    res.json(await service.listTasks(listQuerySchema.parse(req.query)))
}

export async function show(req: Request, res: Response) {
    res.json(await service.getTask(parseId(req.params.id)))
}

export async function store(req: Request, res: Response) {
    res.status(201).json(await service.createTask(createTaskSchema.parse(req.body)))
}

export async function update(req: Request, res: Response) {
    res.json(await service.updateTask(parseId(req.params.id), updateTaskSchema.parse(req.body)))
}

export async function destroy(req: Request, res: Response) {
    await service.deleteTask(parseId(req.params.id))
    res.status(204).end()
}