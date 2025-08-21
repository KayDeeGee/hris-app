<!-- pages/employee/overtime.vue -->
<template>
    <div class="p-6 space-y-6">
        <!-- Header -->
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            My Overtime
        </h1>

        <!-- Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Request Overtime -->
            <UCard
                class="cursor-pointer hover:shadow-lg transition"
                @click="showOvertimeModal = true"
            >
                <div class="flex items-center space-x-3">
                    <UIcon
                        name="i-heroicons-clock"
                        class="w-6 h-6 text-blue-500"
                    />
                    <div>
                        <h3 class="font-semibold text-gray-900 dark:text-white">
                            Request Overtime
                        </h3>
                        <p class="text-sm text-gray-500">
                            Submit an overtime request
                        </p>
                    </div>
                </div>
            </UCard>

            <BaseConfirmModal
                v-model="showOvertimeModal"
                title="Request Overtime"
                confirmText="Submit"
                cancelText="Cancel"
                confirmColor="blue"
                @confirm="submitOvertime"
                @cancel="cancelOvertime"
                @close="cancelOvertime"
            >
                <div class="space-y-4">
                    <UFormGroup label="Date" name="date">
                        <UInput type="date" v-model="form.date" required />
                    </UFormGroup>

                    <UFormGroup label="Hours" name="hours">
                        <UInput
                            type="number"
                            v-model="form.hours"
                            min="1"
                            required
                        />
                    </UFormGroup>

                    <UFormGroup label="Reason" name="reason">
                        <UTextarea
                            v-model="form.reason"
                            placeholder="Enter reason"
                        />
                    </UFormGroup>
                </div>
            </BaseConfirmModal>

            <!-- Total Overtime This Cutoff -->
            <UCard>
                <template #header>Total Accredited Overtime</template>
                <div class="text-4xl font-bold text-center py-8">
                    {{ totalOvertime }} hrs
                </div>
            </UCard>
        </div>

        <!-- Table -->
        <UCard>
            <template #header>Overtime Requests</template>

            <UTable :rows="overtime.data" :columns="columns" />

            <!-- Pagination -->
            <div class="flex justify-between items-center mt-4">
                <UButton
                    :disabled="!overtime.prev_page_url"
                    @click="fetchOvertime(overtime.current_page - 1)"
                >
                    Previous
                </UButton>

                <span
                    >Page {{ overtime.current_page }} of
                    {{ overtime.last_page }}</span
                >

                <UButton
                    :disabled="!overtime.next_page_url"
                    @click="fetchOvertime(overtime.current_page + 1)"
                >
                    Next
                </UButton>
            </div>
        </UCard>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth",
})

const { fetchWithCsrf } = useApi();
const loading = ref(false);
const totalOvertime = ref(0);
const showOvertimeModal = ref(false);

const form = ref({
    date: "",
    hours: "",
    reason: "",
});

// Table setup
const columns = [
    { key: "date", label: "Date" },
    { key: "duration", label: "Duration (hrs)" },
    { key: "reason", label: "Reason" },
    { key: "status", label: "Status" },
];

const overtime = ref({
    data: [],
    current_page: 1,
    last_page: 1,
    next_page_url: null,
    prev_page_url: null,
});

const fetchOvertime = async (page = 1) => {
    const res = await fetchWithCsrf<any>(`/api/employee/overtime?page=${page}`);
        console.log(res, 'wow');

    overtime.value = res;
};

const fetchTotalOvertime = async () => {
    const res = await fetchWithCsrf<any>("/api/employee/overtime/total");
        console.log(res, 'wow');

    totalOvertime.value = res.total;
};

const submitOvertime = async () => {
    loading.value = true;
    try {
        const res = await fetchWithCsrf<any>("/api/employee/overtime", {
            method: "POST",
            body: form.value,
        });
        // await fetchOvertime(overtime.value.current_page); // refresh table
        // await fetchTotalOvertime();
        console.log(res, 'wow');
        form.value = { date: "", hours: "", reason: "" };
    } finally {
        loading.value = false;
    }
};

const cancelOvertime = () => {
    form.value = { date: "", hours: "", reason: "" };
};

onMounted(() => {
    fetchOvertime();
    fetchTotalOvertime();
});
</script>
