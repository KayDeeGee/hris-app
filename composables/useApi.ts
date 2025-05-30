// composables/useApi.ts
export const useApi = () => {
  const xsrfToken = useCookie("XSRF-TOKEN");

  const fetchWithCsrf = async (url: string, options: any = {}) => {
    return await $fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        ...(options.headers || {}),
        "X-XSRF-TOKEN": xsrfToken.value,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  };

  return { fetchWithCsrf };
};
