// 1. Basic types
const appName = "Taskly";
let taskCount: number = 0;
const tags: string[] = ["work", "personal", "urgent"];
const coords: [number, number] = [40.7128, -74.0060]; // Tuple for latitude and longitude

// 2. Object shapes + literal unions (no PHP equivalent, very powerful)
type Status = "todo" | "in-progress" | "done";

interface Task {
    id: number;
    title: string;
    status: Status;
    dueDate?: Date; // Optional property
}

const task: Task = {
    id: 1,
    title: "Finish TypeScript project",
    status: "todo",
}

// task.status = "finished"; // Invalid

// Function
function describe(t: Task): string {
    return `#${t.id}: ${t.title} [${t.status}]`;
}
const multiply = (n: number, times = 2): number => n * times;

// Narrowing
function printId(id: string | number) {
    if (typeof id === "string") {
        console.log(id.toUpperCase());
    } else {
        console.log(id.toFixed(2));
    }
}

// 5. Null/undefined safety
const tasks: Task[] = [
    task, { id: 2, title: "Build API", status: "in-progress" }
];
const found = tasks.find((t) => t.id === 3);
console.log(found?.title ?? "Task not found"); // Optional chaining and nullish coalescing

// 6. Array methods
const titles = tasks.map((t) => t.title);
const open = tasks.filter((t) => t.status !== "done");
const counts = tasks.reduce<Record<Status, number>>((acc, t) => {
    acc[t.status]++;
    return acc;
}, { "todo": 0, "in-progress": 0, "done": 0 });

// 7. Destructuring & spread
const { title, status } = task;
const updated: Task = { ...task, status: "done"};
const more: Task[] = [...tasks, { id: 3, title: "Write tests", status: "todo" }];

console.log(describe(updated), titles, open.length, counts, title, status, updated, more);
printId("abc123");
printId(42);
console.log(multiply(5), multiply(5, 3));