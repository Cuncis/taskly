export type Status = "todo" | "in-progress" | "done";

export interface Task {
    id: number;
    title: string;
    description?: string | null
    status: Status;
    createdAt?: string
}

export interface User {
    id: number,
    name: string,
    email: string
}