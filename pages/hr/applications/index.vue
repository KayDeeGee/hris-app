<template>
    <div class="p-4">
        <h2 class="text-xl font-semibold mb-4">Job Applications</h2>

        <table
            class="w-full table-auto border border-gray-200 rounded-md text-sm"
        >
            <thead class="bg-gray-100">
                <tr>
                    <th class="px-4 py-2 text-left">ID</th>
                    <th class="px-4 py-2 text-left">Title</th>
                    <th class="px-4 py-2 text-left">Name</th>
                    <th class="px-4 py-2 text-left">Status</th>
                    <th class="px-4 py-2 text-left">Applied At</th>
                    <th class="px-4 py-2 text-left">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="application in applications"
                    :key="application.id"
                    class="border-t"
                >
                    <td class="px-4 py-2">{{ application.id }}</td>
                    <td class="px-4 py-2">{{ application.job_post.title }}</td>
                    <td class="px-4 py-2">{{ application.user.last_name }}, {{ application.user.first_name }}</td>
                    <td class="px-4 py-2 capitalize">
                        {{ application.status }}
                    </td>
                    <td class="px-4 py-2">
                        {{ formatDate(application.applied_at) }}
                    </td>
                    <td class="px-4 py-2">
                        <button
                            class="text-blue-500 hover:underline"
                            @click="viewApplication(application)"
                        >
                            View
                        </button>
                        <button
                            class="text-blue-500 hover:underline"
                             @click="updateApplication('reviewed', application.id)"
                        >
                            Reviewed
                        </button>
                         <button
                            class="text-blue-500 hover:underline"
                             @click="updateApplication('shortlisted', application.id)"
                        >
                            Shortlist
                        </button>
                        <button
                            class="text-blue-500 hover:underline"
                              @click="updateApplication('hired', application.id)"
                        >
                            Hire
                        </button>
                        <button
                            class="text-blue-500 hover:underline"
                              @click="updateApplication('rejected', application.id)"
                        >
                            Reject
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
const message = useState<any | null>("messageApplication", () => null);
const { fetchWithCsrf } = useApi();

// Fetch once on route load (SSR-compatible)
const { data: applicationsData, error } = await useAsyncData(
    "jobApplications",
    async () => {
        return await fetchWithCsrf("/api/hr/job-applications");
    }
);

watchEffect(() => {
    if (applicationsData.value) {
        message.value = applicationsData.value;
        console.log("Applications:", applicationsData.value);
    }
});

const applications = computed(() => message.value ?? []);

const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
};

const viewApplication = (app: JobApplication) => {
    console.log("Viewing application", app);
};

const updateApplication = async (status: 'reviewed' | 'shortlisted' | 'hired'| 'rejected', id: number) => {
  try {
    const response = await fetchWithCsrf(`/api/hr/job-applications/${id}/status`, {
      method: 'POST',
      body: { status },
    });

    const target = message.value?.find((app: JobApplication) => app.id === id);
    if (target) {
      target.status = status;
    }

  } catch (error: any) {
    console.error('Failed to update application:', error?.data?.message || error.message);
  }
};
</script>
