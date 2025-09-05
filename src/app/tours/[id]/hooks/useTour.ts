// src/hooks/useTour.ts
import { useEffect, useRef, useState } from "react";
import { Tour } from "../types/tours";

export function useTour(id?: string | null) {
    const [tour, setTour] = useState<Tour | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const acRef = useRef<AbortController | null>(null);

    useEffect(() => {
        // cancelar petición anterior
        acRef.current?.abort();
        acRef.current = null;

        // No hacemos nada si no hay id válido
        if (!id) {
            setTour(null);
            setError(null);
            setLoading(false);
            return;
        }

        const ac = new AbortController();
        acRef.current = ac;

        setLoading(true);
        setError(null);

        (async () => {
            try {
                const res = await fetch(`/api/tours/${encodeURIComponent(id)}`, {
                    signal: ac.signal,
                });

                if (!res.ok) {
                    const txt = await res.text().catch(() => "");
                    throw new Error(txt || `HTTP ${res.status} ${res.statusText}`);
                }

                const data = (await res.json()) as unknown;
                // opcional: validar la forma del dato aquí

                if (!ac.signal.aborted) {
                    setTour(data as Tour);
                }
            } catch (err: unknown) {
                if ((err as { name?: string }).name === "AbortError") {
                    // petición cancelada, no tratar como error
                    return;
                }
                console.error("useTour error:", err);
                setError(err instanceof Error ? err.message : String(err));
                setTour(null);
            } finally {
                if (!ac.signal.aborted) setLoading(false);
            }
        })();

        return () => {
            ac.abort();
            acRef.current = null;
        };
    }, [id]);

    return { tour, loading, error };
}
