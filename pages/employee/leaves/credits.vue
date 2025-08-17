<template>
    <div class="p-6 space-y-6">
        <!-- Header -->
        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                    My Leave Credits
                </h1>
                <p class="text-gray-600 dark:text-gray-400 mt-1">
                    Manage your leave credits and view balances
                </p>
            </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6"></div>
        <UCard>
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-xl font-semibold flex items-center">
                        <UIcon
                            name="i-heroicons-list-bullet"
                            class="w-5 h-5 mr-2 text-purple-500"
                        />
                        Leave Credits
                    </h3>
                    <div class="flex items-center space-x-3">
                        <UButton
                            icon="i-heroicons-funnel"
                            color="gray"
                            variant="ghost"
                            size="sm"
                        >
                            Clear
                        </UButton>
                    </div>
                </div>
            </template>

            <div v-if="loading" class="flex justify-center py-8">
                <UIcon
                    name="i-heroicons-arrow-path"
                    class="animate-spin w-6 h-6"
                />
            </div>

            <UTable
                v-if="!loading && formattedCredits.length > 0"
                :columns="leaveCreditsColumns"
                :rows="formattedCredits"
                class="w-full"
            />
            <!-- Empty State -->
            <div v-else-if="!loading" class="text-center py-12">
                <UIcon
                    name="i-heroicons-calendar-x-mark"
                    class="w-16 h-16 text-gray-400 mx-auto mb-4"
                />
                <h3
                    class="text-lg font-medium text-gray-900 dark:text-white mb-2"
                >
                    No leave requests found
                </h3>
                <UButton color="primary" icon="i-heroicons-plus">
                    Apply for Leave
                </UButton>
            </div>
        </UCard>
    </div>
</template>

<script setup lang="ts">
const { fetchWithCsrf } = useApi();

const credits = ref<any>([]);
const loading = ref(true);

const fetchLeaveCredits = async () => {
    loading.value = true;

    try {
        const response = await fetchWithCsrf("/api/employee/leave-credits");
        credits.value = response;
        console.log("Fetched leave credits:", response);
    } catch (error) {
        console.error("Failed to load leave credits", error);
    } finally {
        loading.value = false;
    }
};

const formattedCredits = computed(() => {
    if (!credits.value || !Array.isArray(credits.value)) {
        return [];
    }

    return credits.value.map((c: any) => ({
        leave_type: c.leave_type ?? "Unknown",
        total_credits: c.total_credits ?? 0,
        used_credits: c.used_credits ?? 0,
        remaining:
            c.remaining ?? (c.total_credits ?? 0) - (c.used_credits ?? 0),
        valid_from: c.valid_from
            ? new Date(c.valid_from).toLocaleDateString()
            : "-",
        valid_until: c.valid_until
            ? new Date(c.valid_until).toLocaleDateString()
            : "-",
        notes: c.notes || "-",
    }));
});

const leaveCreditsColumns = [
    { key: "leave_type", label: "Leave Type" },
    { key: "total_credits", label: "Total" },
    { key: "used_credits", label: "Used" },
    { key: "remaining", label: "Remaining" },
    { key: "valid_from", label: "Valid From" },
    { key: "valid_until", label: "Valid Until" },
    { key: "notes", label: "Notes" },
];

onMounted(() => {
    fetchLeaveCredits();
});
</script>
