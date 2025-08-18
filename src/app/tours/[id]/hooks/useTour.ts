import { useState, useEffect } from "react";
import { Tour } from "../types/tours";

export function useTour(id: string) {
    const [tour, setTour] = useState<Tour | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchTour = async () => {
            try {
                const response = await fetch(`/api/tours/${id}`);
                if (!response.ok) throw new Error("Tour not found");

                const data = await response.json();
                if (!data) throw new Error("Invalid tour data");

                setTour(data);
            } catch (error) {
                console.error("Error fetching tour:", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchTour();
    }, [id]);

    return { tour, loading, error };
}