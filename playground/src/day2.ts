export type Status = 'todo' | 'in-progress' | 'done';

export interface Task {
    id: number;
    title: string;
    status: Status;
    createdAt: Date;
}

// Utility types: derived types instead of rewriting them
export type CreateTaskInput = Pick<Task, "title"> & Partial<Pick<Task, "status">>;
export type UpdateTaskInput = Partial<Omit<Task, "id" | "createdAt">>;
type StatusLabels = Record<Status, string>;

// Generics
export interface ApiResponse<T> {
    data: T;
    error: string | null;
}

export function ok<T>(data: T): ApiResponse<T> {
    return { data, error: null };
}

// A class, your Service in miniature
export class TaskService {
    private tasks: Task[] = [];
    private nextId = 1;

    create(input: CreateTaskInput): Task {
        const task: Task = {
            id: this.nextId++,
            title: input.title,
            status: input.status ?? 'todo',
            createdAt: new Date(),
        };
        this.tasks.push(task);
        return task;
    }

    list(status?: Status): Task[] {
        return status ? this.tasks.filter((t) => t.status === status): [...this.tasks];
    }

    update(id: number, input: UpdateTaskInput): Task {
        const task = this.tasks.find((t) => t.id === id);
        if (!task) throw new Error(`Task with id ${id} not found`);
        Object.assign(task, input);
        return task;
    }

    remove(id: number): void {
        this.tasks = this.tasks.filter((t) => t.id !== id);
    }
}

// Async/await + generics
async function fetchJson<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
    return (await res.json()) as T;
}

interface Todo { id: number; title: string; completed: boolean; }
interface Post { id: number; title: string; }

// unknown vs any: catch variables are `unknowm`, so narrow them
async function main() {
    const service = new TaskService();
    service.create({ title: "Learn TypeScript" });
    service.update(1, { status: "done" });
    console.log(service.list("done"), ok(service.list()));

    try {
        const [todos, posts] = await Promise.all([
            fetchJson<Todo[]>("https://jsonplaceholder.typicode.com/todos?_limit=3"),
            fetchJson<Post[]>("https://jsonplaceholder.typicode.com/posts?_limit=3"),
        ]);
        console.log(todos.length, posts.length);
    } catch (err) {
        if (err instanceof Error) { console.error("Failed: ", err.message); }
        else console.error("Unknown error: ", err);
    }
}

main();
const labels: StatusLabels = { todo: "To Do", "in-progress": "In Progress", done: "Done" };
console.log(labels);