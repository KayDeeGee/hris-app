// composables/useSanctum.ts
export const useSanctum = () => {
  const getCsrfCookie = async () => {
    await $fetch("http://localhost:8000/sanctum/csrf-cookie", {
      credentials: "include",
    });
  };

  return { getCsrfCookie };
};