import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type Todo = { id: number; title: string; completed: boolean }
const API = "https://jsonplaceholder.typicode.com"

async function fetchTodos(): Promise<Todo[]> {
    const res = await fetch(`${API}/todos?_limit=10`);
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

export function TodoList() {
    const qc = useQueryClient()
    const { data, isPending, error } = useQuery({ queryKey: ["todos"], queryFn: fetchTodos })

    const create = useMutation({
        mutationFn: async(title: string) => {
            const res = await fetch(`${API}/todos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, completed: false })
            })
            return res.json();
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ["todos"]})     // refetch
    });

    if (isPending) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>

    return (
        <>
            <button onClick={() => create.mutate("Hello")} disabled={create.isPending}>
                Add fake todo
            </button>
            <ul>
                {data.map((t) => (
                    <li key={t.id}>{t.title}</li>
                ))}
            </ul>
        </>
    )
}