import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async (to) => {
    const authStore = useAuthStore();

    // Public pages that don't require login
    const publicPaths = [
        "/",
        "/jobs",
        "/about",
        "/contact",
        "/login",
        "/register",
    ];

    const isPublic = publicPaths.some((path) => to.path.startsWith(path));
    // Only fetch user if not already authenticated
    if (!authStore.isAuthenticated && !isPublic) {
        await authStore.fetchUser();
    }

    // Redirect to login if still not logged in
    if (!authStore.isAuthenticated && !isPublic) {
        return navigateTo("/login");
    }

    // Optional: Role-based route restrictions
    if (to.path.startsWith("/hr") && authStore.user?.role !== "HR") {
        return navigateTo("/unauthorized");
    }
    if (to.path.startsWith("/manager") && authStore.user?.role !== "Manager") {
        return navigateTo("/unauthorized");
    }
});
