import { prisma } from "../lib/prisma";
import { HttpError } from "../lib/errors";
import type { CreateTaskInput, ListQuery, UpdateTaskInput } from "../schemas/task.schema";

export async function listTasks({ status, page, limit }: ListQuery) {
  const where = status ? { status } : {};
  const [items, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.task.count({ where }),
  ]);
  return { items, total, page, limit };
}

export async function getTask(id: number) {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) throw new HttpError(404, "Task not found");
  return task;
}

export const createTask = (input: CreateTaskInput) => prisma.task.create({ data: input });

export async function updateTask(id: number, input: UpdateTaskInput) {
  await getTask(id);
  return prisma.task.update({ where: { id }, data: input });
}

export async function deleteTask(id: number) {
  await getTask(id);
  await prisma.task.delete({ where: { id } });
}