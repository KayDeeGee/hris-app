export const useJobPostStore = defineStore("jobs", () => {
    const jobPosts = ref<JobPost[]>([]);
    const fetched = ref(false);

    async function fetchJobs() {
        if (fetched.value) return;
        const { fetchWithCsrf } = useApi();

        const res = await fetchWithCsrf<JobPost[]>("/api/public/job-posts");

        if (res && Array.isArray(res)) {
            jobPosts.value = res;
            fetched.value = true;
        } else {
            console.error("Unexpected response format:", res);
        }
    }

    function clear() {
        jobPosts.value = [];
        fetched.value = false;
    }

    return {
        jobPosts,
        fetchJobs,
        clear,
    };
});
