import { useRuntimeConfig } from "nuxt/app";

export const useApi = () => {
    const config = useRuntimeConfig();

    const fetchWithCsrf = async (url: string, options: any = {}) => {
        // 1. Get CSRF cookie
        await $fetch(`${config.public.backendUrl}/sanctum/csrf-cookie`, {
            credentials: "include",
        });

        // 2. Do the actual request with cookies
        return await $fetch(`${config.public.backendUrl}${url}`, {
            ...options,
            credentials: "include",
        });
    };

    return { fetchWithCsrf };
};
