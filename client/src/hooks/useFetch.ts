import { useEffect, useState } from "react";

export function useFetch<T>(url: string) {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            try {
                setLoading(true)
                const res = await fetch(url, { signal: controller.signal })
                if(!res.ok) throw new Error(`HTTP ${res.status}`);
                setData((await res.json()) as T)
                setError(null)
            } catch(e) {
                if(controller.signal.aborted) return;
                setError(e instanceof Error ? e.message : "Unknown Error")
            } finally {
                if(!controller.signal.aborted) setLoading(false)
            }
        })();
        return () => controller.abort()
    }, [url])

    return { data, loading, error }
}