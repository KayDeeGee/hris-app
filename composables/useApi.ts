const { getCsrfCookie } = useSanctum();

let csrfFetched = false;
export const useApi = () => {
    const fetchWithCsrf = async (url: string, options: any = {}) => {
        const xsrfToken = useCookie("XSRF-TOKEN");

        // Fetch CSRF cookie only once
        if (!csrfFetched || !xsrfToken.value) {
            await getCsrfCookie();
            csrfFetched = true;
        }

        return await $fetch(url, {
            ...options,
            credentials: "include",
            headers: {
                ...options.headers,
                "X-XSRF-TOKEN": xsrfToken.value,
                Accept: "application/json",
                ...(options.body instanceof FormData
                    ? {} // Let browser set Content-Type for FormData
                    : { "Content-Type": "application/json" }),
            },
        });
    };
    const fetchPublic = async (url: string, options: any = {}) => {
        return await $fetch(url, {
            ...options,
            headers: {
                ...(options.headers || {}),
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });
    };

    return { fetchWithCsrf, fetchPublic };
};
