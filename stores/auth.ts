import { defineStore } from "pinia";

interface User {
    id: number;
    name: string;
    role: string;
}

export const useAuthStore = defineStore("auth", () => {
    const user = ref<User | null>(null);

    const isAuthenticated = computed(() => !!user.value);
    const isAdmin = computed(() => user.value?.role?.toLowerCase() === "admin");

    async function fetchUser() {
        try {
            const userData = await useApi().fetchWithCsrf<User>(
                "/api/auth/user",
                {
                    credentials: "include",
                }
            );
            user.value = userData;
        } catch (error) {
            console.error("Failed to fetch user:", error);
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
