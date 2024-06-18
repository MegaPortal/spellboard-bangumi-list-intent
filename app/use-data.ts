import { useState, useEffect, useCallback, useRef } from 'react';

interface Anime {
    id: number;
    name: string;
    name_jp: string;
    cover: string;
    type: number;
    anime_tag_id: string;
    show_year: string;
    show_quarter: number;
    show_month_day: string;
    show_time: string | null;
    show_week: number | null;
    intro: string;
    play_address: { anime_play_net_id: number; area: string; address: string; logo: string }[];
    pv_address: { cover: string; address: string }[];
    cv: string[];
    staff: string[];
    episode_sum: number;
    official_web: string;
    show_date: number;
    end: number;
    end_date: number;
    created_at: string;
    updated_at: string;
    is_keep: number;
    tag: string[];
}

interface WeekData {
    [key: string]: Anime[];
}

interface AnimeDataResponse {
    status: string;
    code: number;
    message: string;
    data: {
        week: WeekData;
        info: Anime[];
    };
}

export const useAnimeData = (interval: number = 60000) => {
    const [animeData, setAnimeData] = useState<{
        week: WeekData;
        info: Anime[];
    } | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const hasFetchedOnce = useRef(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/search', {
                cache: 'no-cache',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const rawData: AnimeDataResponse = await response.json();
            setAnimeData(rawData.data);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!hasFetchedOnce.current) {
            fetchData();
            hasFetchedOnce.current = true;
            const intervalId = setInterval(fetchData, interval);

            return () => clearInterval(intervalId);
        }
    }, [fetchData, interval]);

    const refresh = () => {
        setError(null);
        setAnimeData(null);
        fetchData();
    };

    return { data: animeData, error, loading, refresh };
};

export default useAnimeData;