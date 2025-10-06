import { useState, useEffect } from "react";
import type { AxiosRequestConfig, AxiosError } from "axios";
import { toast } from "react-toastify";
import { axiosApi } from "../axiosApi";

interface PaginatedResponseData<T> {
    data: T;
}

interface UseFetchState<T> {
    data: PaginatedResponseData<T> | T | null;
    loading: boolean;
    error: string | null;
}

interface UseFetchOptions extends AxiosRequestConfig {
    skip?: boolean;
}

export function useFetch<T = any>(
    url: string,
    options: UseFetchOptions = {}
): UseFetchState<T> & { refetch: () => void } {
    const [state, setState] = useState<UseFetchState<T>>({
        data: null,
        loading: false,
        error: null,
    });

    const { skip = false, ...axiosOptions } = options;

    const fetchData = async () => {
        if (skip) return;

        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const response = await axiosApi(url, axiosOptions);
            if (response) {
                setState({
                    data: response.data,
                    loading: false,
                    error: null,
                });
            }
        } catch (err) {
            console.error(err);
            const error = err as AxiosError;
            let errorMessage = "Um erro inesperado ocorreu";

            if (error.response) {
                // Server responded with error status
                errorMessage =
                    (error.response.data as any)?.message ||
                    `Erro ${error.response.status}: ${error.response.statusText}`;
            } else if (error.request) {
                // Request was made but no response received
                errorMessage = "Network error - please check your connection";
            } else {
                // Something else happened
                errorMessage = error.message || errorMessage;
            }

            setState({
                data: null,
                loading: false,
                error: errorMessage,
            });

            // Show toast notification for the error
            toast.error(errorMessage);
        } finally {
            setState((prev) => ({ ...prev, loading: false }));
        }
    };

    useEffect(() => {
        fetchData();
    }, [url, skip, JSON.stringify(axiosOptions)]);

    return {
        ...state,
        refetch: fetchData,
    };
}
