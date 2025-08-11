<template>
    <div class="p-6 space-y-6">
        <!-- Header -->
        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                    My Leave Requests
                </h1>
                <p class="text-gray-600 dark:text-gray-400 mt-1">
                    Manage your leave applications and view balances
                </p>
            </div>
        </div>

        <!-- Action Cards Row -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Total Leave Credits Card -->
            <UCard
                class="hover:shadow-lg transition-shadow cursor-pointer"
                @click="$router.push('/leaves/credits')"
            >
                <template #header>
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold">
                            Total Leave Credits
                        </h3>
                        <UIcon
                            name="i-heroicons-calendar"
                            class="w-6 h-6 text-blue-500"
                        />
                    </div>
                </template>
                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-600 dark:text-gray-400"
                            >Available</span
                        >
                        <span class="text-3xl font-bold text-blue-600">{{
                            totalCredits.available
                        }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-600 dark:text-gray-400"
                            >Used This Year</span
                        >
                        <span
                            class="text-lg font-medium text-gray-800 dark:text-gray-200"
                            >{{ totalCredits.used }}</span
                        >
                    </div>
                    <UProgress
                        :value="usagePercentage"
                        class="mt-3"
                        color="blue"
                    />
                    <div class="text-center pt-2">
                        <UBadge color="blue" variant="soft"
                            >View Details</UBadge
                        >
                    </div>
                </div>
            </UCard>

            <!-- Apply Leave Card -->
            <UCard
                class="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800"
                @click="$router.push('/leaves/apply')"
            >
                <template #header>
                    <div class="flex items-center justify-between">
                        <h3
                            class="text-lg font-semibold text-green-800 dark:text-green-200"
                        >
                            Apply for Leave
                        </h3>
                        <UIcon
                            name="i-heroicons-plus-circle"
                            class="w-6 h-6 text-green-500"
                        />
                    </div>
                </template>
                <div class="text-center space-y-4">
                    <UIcon
                        name="i-heroicons-calendar-plus"
                        class="w-16 h-16 text-green-500 mx-auto"
                    />
                    <p class="text-sm text-green-700 dark:text-green-300">
                        Submit a new leave request
                    </p>
                    <UButton color="green" size="lg" block> Apply Now </UButton>
                </div>
            </UCard>

            <!-- Leave Schedule Card (Placeholder) -->
            <UCard
                class="hover:shadow-lg transition-shadow cursor-pointer opacity-75"
                @click="showComingSoon = true"
            >
                <template #header>
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold text-gray-600">
                            Leave Schedule
                        </h3>
                        <UIcon
                            name="i-heroicons-calendar-days"
                            class="w-6 h-6 text-gray-400"
                        />
                    </div>
                </template>
                <div class="text-center space-y-4">
                    <UIcon
                        name="i-heroicons-clock"
                        class="w-16 h-16 text-gray-400 mx-auto"
                    />
                    <p class="text-sm text-gray-500">
                        View team leave calendar
                    </p>
                    <UBadge color="gray" variant="soft">Coming Soon</UBadge>
                </div>
            </UCard>
        </div>

        <!-- Leave Requests Table -->
        <UTable
            :rows="filteredLeaveRequests"
            :columns="leaveColumns"
            class="w-full"
        >
            <!-- Leave Type -->
            <template #leave_type-data="{ row }">
                <div class="flex items-center space-x-2">
                    <div
                        class="w-3 h-3 rounded-full"
                        :class="getLeaveTypeColor(row.leave_type.name)"
                    ></div>
                    <span class="font-medium">{{ row.leave_type.name }}</span>
                </div>
            </template>

            <!-- Dates -->
            <template #dates-data="{ row }">
                <div class="space-y-1">
                    <div class="text-sm font-medium">
                        {{ formatDateRange(row.leave_details) }}
                    </div>
                    <div class="text-xs text-gray-500">
                        {{ row.leave_details.length }} day{{
                            row.leave_details.length > 1 ? "s" : ""
                        }}
                    </div>
                </div>
            </template>

            <!-- Total Value -->
            <template #total_value-data="{ row }">
                <span class="font-mono text-sm font-medium">
                    {{ row.total_value }} day{{
                        row.total_value > 1 ? "s" : ""
                    }}
                </span>
            </template>

            <!-- Status -->
            <template #status-data="{ row }">
                <UBadge
                    :variant="row.status === 'pending' ? 'soft' : 'solid'"
                    size="sm"
                >
                    {{
                        row.status.charAt(0).toUpperCase() + row.status.slice(1)
                    }}
                </UBadge>
            </template>

            <!-- Actions -->
            <template #actions-data="{ row }">
                <div class="flex items-center space-x-2">
                    <UButton
                        icon="i-heroicons-eye"
                        size="xs"
                        color="gray"
                        variant="ghost"
                        @click="viewLeaveDetails(row)"
                    />
                    <UButton
                        v-if="row.status === 'pending'"
                        icon="i-heroicons-pencil"
                        size="xs"
                        color="blue"
                        variant="ghost"
                        @click="editLeaveRequest(row)"
                    />
                    <UButton
                        v-if="row.status === 'pending'"
                        icon="i-heroicons-trash"
                        size="xs"
                        color="red"
                        variant="ghost"
                        @click="cancelLeaveRequest(row)"
                    />
                </div>
            </template>
        </UTable>

        <!-- Coming Soon Modal -->
        <UModal v-model="showComingSoon">
            <UCard>
                <template #header>
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold">Coming Soon!</h3>
                        <UButton
                            color="gray"
                            variant="ghost"
                            icon="i-heroicons-x-mark"
                            @click="showComingSoon = false"
                        />
                    </div>
                </template>
                <div class="text-center py-6">
                    <UIcon
                        name="i-heroicons-rocket-launch"
                        class="w-16 h-16 text-blue-500 mx-auto mb-4"
                    />
                    <p class="text-gray-600 dark:text-gray-400">
                        The Leave Schedule feature is currently under
                        development and will be available soon!
                    </p>
                </div>
            </UCard>
        </UModal>
    </div>
</template>

<script setup lang="ts">
const { fetchWithCsrf } = useApi();
interface LeaveApiResponse {
    requests: any[];
    credits: {
        total_credits: number;
        used_credits: number;
    };
}
interface TotalCreditsDisplay {
    available: number;
    used: number;
}

const showComingSoon = ref(false);

// State
const leaveRequests = ref<any[]>([]);
const totalCredits = ref<TotalCreditsDisplay>({ available: 0, used: 0 });
const loading = ref(false);

// Columns for UTable
const leaveColumns = [
    { key: "leave_type", label: "Leave Type" },
    { key: "dates", label: "Dates" },
    { key: "total_value", label: "Total Value" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
];

// Fetch
const fetchLeaveDetails = async () => {
    loading.value = true;
    try {
        const response = await fetchWithCsrf<any>("/api/employee/leaves");

        leaveRequests.value = response.requests.data ?? [];
        console.log("Fetched leave details:", response);
        console.log(leaveRequests.value, "wow");

        totalCredits.value = {
            available:
                response.credits.total_credits - response.credits.used_credits,
            used: response.credits.used_credits,
        };

        console.log(totalCredits.value);
    } catch (error) {
        console.error("Failed to fetch leave requests:", error);
    } finally {
        loading.value = false;
    }
};

// Computed for filtering (if needed)
const filteredLeaveRequests = computed(() => leaveRequests.value || []);

// Computed usage percentage for progress bar
const usagePercentage = computed(() => {
    const total = totalCredits.value.available + totalCredits.value.used;
    return total > 0 ? Math.round((totalCredits.value.used / total) * 100) : 0;
});

// Helpers
const getLeaveTypeColor = (typeName: string) => {
    switch (typeName.toLowerCase()) {
        case "vacation":
            return "bg-green-500";
        case "sick":
            return "bg-red-500";
        default:
            return "bg-gray-400";
    }
};

const formatDateRange = (details: any[]) => {
    if (!details || details.length === 0) return "";
    const sorted = [...details].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const start = sorted[0].date;
    const end = sorted[sorted.length - 1].date;
    return start === end ? start : `${start} - ${end}`;
};

const viewLeaveDetails = (leave: LeaveRequest) => {
    // Navigate to detailed view or open modal
    console.log("Viewing leave details:", leave);
    // $router.push(`/leaves/${leave.id}`);
};

const editLeaveRequest = (leave: LeaveRequest) => {
    // Navigate to edit form
    console.log("Editing leave request:", leave);
    // $router.push(`/leaves/edit/${leave.id}`);
};

const cancelLeaveRequest = async (leave: LeaveRequest) => {
    // Show confirmation and cancel request
    console.log("Cancelling leave request:", leave);
    // Implement cancellation logic
};

// Lifecycle
onMounted(fetchLeaveDetails);
</script>
