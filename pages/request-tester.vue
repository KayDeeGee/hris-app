<template>
    <div class="p-6 space-y-4 grid grid-cols-2">
        <div class="space-y-4">
            <h1 class="text-xl font-bold">Request Tester</h1>

            <div>
                <button
                    @click="registerUser"
                    class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Register User
                </button>
            </div>
            <div>
                <button
                    @click="getUser"
                    class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Get Authenticated User
                </button>
            </div>
            <div>
                <button
                    @click="login"
                    class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    login
                </button>
            </div>

            <div>
                <button
                    @click="storeJobPost"
                    class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    storeJobPost
                </button>
            </div>
            <div>
                <button
                    @click="getJobs"
                    class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    getJobs
                </button>
            </div>
            <div>
                <div class="flex items-center gap-2">
                    <input
                        v-model="jobId"
                        type="number"
                        placeholder="Enter job ID"
                        class="border rounded px-3 py-2"
                    />
                    <button
                        @click="showJob"
                        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Show Job
                    </button>
                </div>
            </div>
        </div>
        <div>
            <div
                v-if="message"
                class="mt-4 p-4 border rounded bg-gray-100 dark:text-gray-800"
            >
                <pre>{{ message }}</pre>
                <div v-if="error" class="mt-4 text-red-600">
                    Error: {{ error }}
                </div>
            </div>
        </div>
        <div>
            <form @submit.prevent="submitApplication" class="space-y-4">
                <input
                    v-model="formJobApplication.first_name"
                    type="text"
                    placeholder="First name"
                    required
                />
                <input
                    v-model="formJobApplication.last_name"
                    type="text"
                    placeholder="Last name"
                    required
                />
                <input
                    v-model="formJobApplication.email"
                    type="email"
                    placeholder="Email"
                    required
                />
                <input
                    v-model="formJobApplication.phone"
                    type="tel"
                    placeholder="Phone (optional)"
                />
                <textarea
                    v-model="formJobApplication.cover_letter"
                    placeholder="Cover letter (optional)"
                />
                <input
                    type="file"
                    @change="
                        (e) =>
                            (formJobApplication.resume_path = e.target.files[0])
                    "
                    accept=".pdf,.doc,.docx"
                />
                <button class="bg-amber-600" type="submit" :disabled="loading">
                    {{ loading ? "Submitting..." : "Apply" }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
const message = ref(null);
const error = ref(null);

const { getCsrfCookie } = useSanctum();
const { fetchWithCsrf, fetchPublic } = useApi();

const jobId = useState("jobId", () => null);
const loading = useState("loading", () => false);

const formJobApplication = reactive({
    first_name: "test",
    last_name: "test",
    email: "test@mail.com",
    phone: "0999999999",
    cover_letter: "test",
    job_id: 1,
    resume_path: null,
});

const getUser = async () => {
    error.value = null;
    message.value = null;

    try {
        const response = await fetchWithCsrf("/api/user");
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

        const response = await fetchWithCsrf("/api/auth/login", {
            method: "POST",
            body: {
                email: "kylebryanbasco@gmail.com",
                password: "admin123",
            },
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
        const response = await fetchWithCsrf("/api/auth/register", {
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
        const response = await $fetch("/api/job-posts", {
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
        const response = await fetchPublic(`/api/public/job-posts`, {
            method: "GET",
        });

        message.value = response;
    } catch (err) {
        error.value = err?.data?.message || err.message;
        console.error("Login error:", err);
    }
};

const showJob = async () => {
    error.value = null;
    message.value = null;

    try {
        const response = await fetchPublic(
            `/api/public/job-posts/${jobId.value}`,
            {
                method: "GET",
            }
        );

        message.value = response;
    } catch (err) {
        error.value = err?.data?.message || err.message;
        console.error("Login error:", err);
    }
};

const submitApplication = async () => {
    loading.value = true;
    const formData = new FormData();

    for (const key in formJobApplication) {
        const value = formJobApplication[key];

        // Skip null/undefined
        if (value == null) continue;

        // If it's a File (resume, cover letter, etc), append as is
        if (value instanceof File) {
            formData.append(key, value);
        } else {
            formData.append(key, value.toString());
        }
    }

    await getCsrfCookie();
    const xsrfToken = useCookie("XSRF-TOKEN").value;
    try {
        const response = await fetchWithCsrf("/api/public/job-applications", {
            method: "POST",
            body: formData,
        });
        // console.log(response.value)
        alert("Application submitted!");
    } catch (error) {
        console.error(error);
        alert("Something went wrong.");
    } finally {
        loading.value = false;
    }
};
</script>
