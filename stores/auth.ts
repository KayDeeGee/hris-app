import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
    const user = ref(null);

    const isAuthenticated = computed(() => !!user.value);
    const isAdmin = computed(() => user.value?.role === "admin");

    async function fetchUser() {
        try {
            const { data } = await useApi().fetchWithCsrf("/api/user", {
                credentials: "include",
            });
            user.value = data.value;
        } catch (error) {
            user.value = null;
        }
    }

    async function logout() {
        try {
            await useApi().fetchWithCsrf("/logout", {
                method: "POST",
                credentials: "include",
            });
        } finally {
            user.value = null;
        }
    }

    return {
        user,
        isAuthenticated,
        isAdmin,
        fetchUser,
        logout,
    };
});
