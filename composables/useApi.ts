const { getCsrfCookie } = useSanctum();

let csrfFetched = false;
export const useApi = () => {
    const config = useRuntimeConfig();
    const fetchWithCsrf = async (url: string, options: any = {}) => {
        const xsrfToken = useCookie("XSRF-TOKEN");
        const headers = useRequestHeaders(["cookie"]) || {};

        // Server-side fetch of CSRF only once
        if (!csrfFetched || !xsrfToken.value) {
            await getCsrfCookie();
            csrfFetched = true;
        }

        return await $fetch(`${config.public.backendUrl}${url}`, {
            ...options,
            credentials: "include",
            headers: {
                ...headers, // SSR cookies
                ...options.headers,
                "X-XSRF-TOKEN": xsrfToken.value,
                Accept: "application/json",
                ...(options.body instanceof FormData
                    ? {}
                    : { "Content-Type": "application/json" }),
            },
        });
    };

    const fetchPublic = async (url: string, options: any = {}) => {
        const headers = useRequestHeaders(["cookie"]) || {};
        return await $fetch(`${config.public.backendUrl}${url}`, {
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
