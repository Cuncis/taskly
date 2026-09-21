import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from "react";
import type { Status, Task } from "../types";

type Action =
  | { type: "add"; title: string }
  | { type: "toggle"; id: number }
  | { type: "remove"; id: number };

const nextStatus = (s: Status): Status => (s === "done" ? "todo" : "done");

function reducer(state: Task[], action: Action): Task[] {
  switch (action.type) {
    case "add":
      return [...state, { id: Date.now(), title: action.title, status: "todo" }];
    case "toggle":
      return state.map((t) => (t.id === action.id ? { ...t, status: nextStatus(t.status) } : t));
    case "remove":
      return state.filter((t) => t.id !== action.id);
  }
}

type Ctx = { tasks: Task[]; dispatch: Dispatch<Action> };
const TasksContext = createContext<Ctx | null>(null);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, dispatch] = useReducer(reducer, []);
  return <TasksContext.Provider value={{ tasks, dispatch }}>{children}</TasksContext.Provider>;
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used inside <TasksProvider>");
  return ctx;
}