<template>
    <div class="p-6 space-y-4">
        <h1 class="text-xl font-bold">Request Tester</h1>
        <div v-if="message" class="mt-4 p-4 border rounded bg-gray-100 dark:text-gray-800">
            <pre>{{ message }}</pre>
            <div v-if="error" class="mt-4 text-red-600">Error: {{ error }}</div>

        </div>
        <div>
            <button @click="registerUser" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Register User
            </button>
        </div>
        <div>
            <button @click="getUser" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Get Authenticated User
            </button>
        </div>
        <div>
            <button @click="login" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                login
            </button>
        </div>

        <div>
            <button @click="storeJobPost" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                storeJobPost
            </button>
        </div>
        <div>
            <button @click="getJobs" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                getJobs
            </button>
        </div>
    </div>
</template>

<script setup>
const message = ref(null);
const error = ref(null);

const { getCsrfCookie } = useSanctum();
const { fetchWithCsrf } = useApi();

const getUser = async () => {
    error.value = null;
    message.value = null;

    try {
        const response = await fetchWithCsrf("http://localhost:8000/api/user");
        message.value = response;
    } catch (err) {
        error.value = err?.data?.message || err.message;
    }
};

// const { fetchWithCsrf } = useApi();
const login = async () => {
    error.value = null;
    message.value = null;

    try {
        // Get CSRF token only once (first time)
        await getCsrfCookie();

        const response = await fetchWithCsrf("http://localhost:8000/api/auth/login", {
            method: "POST",
            body: {
                email: "kylebryanbasco@gmail.com",
                password: "admin123",
            }
        });

        message.value = response;
    } catch (err) {
        error.value = err?.data?.message || err.message;
    }
};

const registerUser = async () => {
    error.value = null;
    message.value = null;

    try {
        const response = await fetchWithCsrf("http://localhost:8000/api/auth/register", {
            method: "POST",
            body: {
                last_name: "Basco",
                first_name: "Kyle Bryan",
                email: "kylebryanbasco@gmail.com",
                password: "admin123",
            },
        });

        message.value = response;
    } catch (err) {
        error.value = err?.data?.message || err.message;
    }
};

const storeJobPost = async () => {
    error.value = null;
    message.value = null;

    try {
        // Get the XSRF-TOKEN cookie
        const xsrfToken = useCookie("XSRF-TOKEN").value;

        // Then, make the authenticated request
        const response = await $fetch("http://localhost:8000/api/job-posts", {
            method: "POST",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "X-XSRF-TOKEN": xsrfToken,
            },
            body: {
                title: "Software Engineer",
                description: "we are looking for a software engineer",
                status: "draft",
                requirements: [
                    "3+ years experience in PHP",
                    "Familiar with Laravel ecosystem",
                    "Strong communication skills",
                ],
                qualifications: [
                    "Bachelor’s degree in Computer Science",
                    "AWS Developer Certification",
                ],
                created_by: 1,
            },
        });

        message.value = response;
    } catch (err) {
        error.value = err?.data?.message || err.message;
        console.error("Login error:", err);
    }
};

const getJobs = async () => {
    error.value = null;
    message.value = null;

    try {
        // Get the XSRF-TOKEN cookie
        const xsrfToken = useCookie("XSRF-TOKEN").value;

        // Then, make the authenticated request
        const response = await $fetch("http://localhost:8000/api/job-posts", {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "X-XSRF-TOKEN": xsrfToken,
            },
        });

        message.value = response;
    } catch (err) {
        error.value = err?.data?.message || err.message;
        console.error("Login error:", err);
    }
};
</script>
