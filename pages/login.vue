<template>
    <div
        class="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900"
    >
        <div
            class="w-full max-w-md p-6 rounded-2xl shadow bg-white dark:bg-gray-800"
        >
            <h1
                class="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center"
            >
                Login
            </h1>

            <!-- Error -->
            <div
                v-if="error"
                class="mb-4 p-3 text-sm text-red-600 bg-red-100 rounded-lg"
            >
                {{ error }}
            </div>

            <form @submit.prevent="login" class="space-y-4">
                <div>
                    <label
                        class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Email
                    </label>
                    <input
                        v-model="email"
                        type="email"
                        required
                        class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                <div>
                    <label
                        class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Password
                    </label>
                    <input
                        v-model="password"
                        type="password"
                        required
                        class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                <button
                    type="submit"
                    :disabled="loading"
                    class="w-full py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow disabled:opacity-50"
                >
                    <span v-if="loading">Logging in...</span>
                    <span v-else>Login</span>
                </button>
            </form>

            <p
                class="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center"
            >
                Don’t have an account?
                <NuxtLink to="/register" class="text-blue-600 hover:underline"
                    >Register</NuxtLink
                >
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
const { fetchWithCsrf } = useApi();
const { getCsrfCookie } = useSanctum();

const router = useRouter();
const auth = useAuthStore();

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref<string | null>(null);

const login = async () => {
    error.value = null;
    loading.value = true;
    try {
        // Hit Laravel Sanctum login
        await getCsrfCookie();

        const response = await fetchWithCsrf("/api/auth/login", {
            method: "POST",
            body: { email: email.value, password: password.value },
        });
        console.log(response);
        // Fetch authenticated user
        await auth.fetchUser();

        // Redirect after login
        router.push("/dashboard");
    } catch (err: any) {
        console.error('Login error:', err); // ✅ Add logging
        error.value = err?.data?.message || err?.message || "Invalid credentials.";
    } finally {
        loading.value = false;
    }
};
</script>
