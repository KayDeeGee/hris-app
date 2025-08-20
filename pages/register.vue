<template>
    <div
        class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900"
    >
        <div
            class="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg dark:bg-gray-800"
        >
            <!-- Title -->
            <h2
                class="text-2xl font-bold text-center text-gray-900 dark:text-white"
            >
                Create an Account
            </h2>

            <!-- Error message -->
            <p v-if="errorMessage" class="text-sm text-red-500 text-center">
                {{ errorMessage }}
            </p>

            <!-- Success message -->
            <p v-if="successMessage" class="text-sm text-green-500 text-center">
                {{ successMessage }}
            </p>

            <!-- Form -->
            <form @submit.prevent="handleRegister" class="space-y-4">
                <div>
                    <label
                        for="first-name"
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        First Name
                    </label>
                    <input
                        v-model="form.first_name"
                        id="first-name"
                        type="text"
                        required
                        class="w-full px-3 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white"
                    />
                </div>
                <div>
                    <label
                        for="last-name"
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Last Name
                    </label>
                    <input
                        v-model="form.last_name"
                        id="last-name"
                        type="text"
                        required
                        class="w-full px-3 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <div>
                    <label
                        for="email"
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Email
                    </label>
                    <input
                        v-model="form.email"
                        id="email"
                        type="email"
                        required
                        class="w-full px-3 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <div>
                    <label
                        for="password"
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Password
                    </label>
                    <input
                        v-model="form.password"
                        id="password"
                        type="password"
                        required
                        class="w-full px-3 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <div>
                    <label
                        for="password_confirmation"
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Confirm Password
                    </label>
                    <input
                        v-model="form.password_confirmation"
                        id="password_confirmation"
                        type="password"
                        required
                        class="w-full px-3 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <!-- Submit -->
                <button
                    type="submit"
                    :disabled="loading"
                    class="w-full py-2 px-4 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
                >
                    {{ loading ? "Registering..." : "Register" }}
                </button>
            </form>

            <!-- Link to Login -->
            <p class="text-sm text-center text-gray-600 dark:text-gray-400">
                Already have an account?
                <NuxtLink to="/login" class="text-blue-600 hover:underline"
                    >Login</NuxtLink
                >
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
const { fetchWithCsrf } = useApi();
const router = useRouter();
// form state
const form = ref({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
});

const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

// register handler
const handleRegister = async () => {
    errorMessage.value = "";
    successMessage.value = "";
    loading.value = true;

    try {
        const res = await fetchWithCsrf<any>("/api/auth/register", {
            method: "POST",
            body: form.value,
        });

        successMessage.value = res.message || "Account created successfully!";
        // Optional: redirect to login after success
        setTimeout(() => {
            router.push("/login");
        }, 1500);
    } catch (err: any) {
        errorMessage.value =
            err?.data?.message || "Registration failed. Please try again.";
    } finally {
        loading.value = false;
    }
};
</script>
