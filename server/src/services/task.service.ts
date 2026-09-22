import { prisma } from "../lib/prisma";
import { HttpError } from "../lib/errors";
import type { CreateTaskInput, ListQuery, UpdateTaskInput } from "../schemas/task.schema";

export async function listTasks(userId: number, { status, page, limit }: ListQuery) {
  const where = { userId, ...(status ? { status } : {}) };
  const [items, total] = await Promise.all([
    prisma.task.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * limit, take: limit }),
    prisma.task.count({ where }),
  ]);
  return { items, total, page, limit };
}

export async function getTask(userId: number, id: number) {
  const task = await prisma.task.findFirst({ where: { id, userId } });
  if (!task) throw new HttpError(404, "Task not found"); // 404, not 403: don't leak existence
  return task;
}

export const createTask = (userId: number, input: CreateTaskInput) =>
  prisma.task.create({ data: { ...input, userId } });

export async function updateTask(userId: number, id: number, input: UpdateTaskInput) {
  await getTask(userId, id);
  return prisma.task.update({ where: { id }, data: input });
}

export async function deleteTask(userId: number, id: number) {
  await getTask(userId, id);
  await prisma.task.delete({ where: { id } });
}