export const useApi = () => {
    const config = useRuntimeConfig();
    const { getCsrfCookie } = useSanctum();
    let csrfFetched = false;

    const fetchWithCsrf = async <T = unknown>(
        url: string,
        options: any = {}
    ): Promise<T> => {
        const xsrfToken = useCookie("XSRF-TOKEN");
        const headers = useRequestHeaders(["cookie"]) || {};

        if (!csrfFetched || !xsrfToken.value) {
            await getCsrfCookie();
            csrfFetched = true;
        }

        return await $fetch<T>(`${config.public.backendUrl}${url}`, {
            ...options,
            credentials: "include",
            headers: {
                ...headers,
                ...options.headers,
                "X-XSRF-TOKEN": xsrfToken.value,
                Accept: "application/json",
                ...(options.body instanceof FormData
                    ? {}
                    : { "Content-Type": "application/json" }),
            },
        });
    };

    const fetchPublic = async <T = unknown>(
        url: string,
        options: any = {}
    ): Promise<T> => {
        const headers = useRequestHeaders(["cookie"]) || {};

        return await $fetch<T>(`${config.public.backendUrl}${url}`, {
            ...options,
            headers: {
                ...headers,
                "Content-Type": "application/json",
                Accept: "application/json",
                ...(options.headers || {}),
            },
        });
    };

    return { fetchWithCsrf, fetchPublic };
};
