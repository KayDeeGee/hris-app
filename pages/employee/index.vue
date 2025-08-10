<template>
    <div class="p-6 space-y-6">
        <!-- Header -->
        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                    Welcome back, {{ user?.name || "John Doe" }}!
                </h1>
                <p class="text-gray-600 dark:text-gray-400 mt-1">
                    {{ getCurrentDate() }}
                </p>
            </div>
            <div class="flex items-center space-x-4">
                <UButton
                    icon="i-heroicons-bell"
                    color="gray"
                    variant="ghost"
                    size="lg"
                />
                <UButton
                    icon="i-heroicons-cog-6-tooth"
                    color="gray"
                    variant="ghost"
                    size="lg"
                    to="/settings"
                />
            </div>
        </div>

        <!-- Quick Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Leave Credits -->
            <UCard class="hover:shadow-lg transition-shadow">
                <template #header>
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold">Leave Credits</h3>
                        <UIcon
                            name="i-heroicons-calendar"
                            class="w-5 h-5 text-blue-500"
                        />
                    </div>
                </template>
                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-600 dark:text-gray-400"
                            >Available</span
                        >
                        <span class="text-2xl font-bold text-blue-600">15</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-600 dark:text-gray-400"
                            >Used</span
                        >
                        <span
                            class="text-sm font-medium text-gray-800 dark:text-gray-200"
                            >5 / 20</span
                        >
                    </div>
                    <UProgress :value="25" class="mt-2" color="blue" />
                </div>
            </UCard>

            <!-- Pending Requests -->
            <UCard class="hover:shadow-lg transition-shadow">
                <template #header>
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold">Pending Requests</h3>
                        <UIcon
                            name="i-heroicons-clock"
                            class="w-5 h-5 text-yellow-500"
                        />
                    </div>
                </template>
                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-600 dark:text-gray-400"
                            >Leave</span
                        >
                        <UBadge color="yellow" variant="soft">2</UBadge>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-600 dark:text-gray-400"
                            >Overtime</span
                        >
                        <UBadge color="yellow" variant="soft">1</UBadge>
                    </div>
                    <div class="text-center pt-2">
                        <UButton size="xs" color="yellow" variant="soft"
                            >View All</UButton
                        >
                    </div>
                </div>
            </UCard>

            <!-- This Month Attendance -->
            <UCard class="hover:shadow-lg transition-shadow">
                <template #header>
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold">This Month</h3>
                        <UIcon
                            name="i-heroicons-user-circle"
                            class="w-5 h-5 text-green-500"
                        />
                    </div>
                </template>
                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-600 dark:text-gray-400"
                            >Present Days</span
                        >
                        <span class="text-2xl font-bold text-green-600"
                            >18</span
                        >
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-600 dark:text-gray-400"
                            >Late Count</span
                        >
                        <span class="text-sm font-medium text-red-600">3</span>
                    </div>
                    <div
                        class="flex justify-between items-center text-xs text-gray-500"
                    >
                        <span>Attendance Rate</span>
                        <span class="font-medium">90%</span>
                    </div>
                </div>
            </UCard>

            <!-- Quick Actions -->
            <UCard class="hover:shadow-lg transition-shadow">
                <template #header>
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold">Quick Actions</h3>
                        <UIcon
                            name="i-heroicons-bolt"
                            class="w-5 h-5 text-purple-500"
                        />
                    </div>
                </template>
                <div class="space-y-2">
                    <UButton
                        block
                        size="xs"
                        color="blue"
                        variant="soft"
                        icon="i-heroicons-calendar-plus"
                    >
                        Request Leave
                    </UButton>
                    <UButton
                        block
                        size="xs"
                        color="green"
                        variant="soft"
                        icon="i-heroicons-clock"
                    >
                        Request OT
                    </UButton>
                </div>
            </UCard>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Left Column - Announcements & Recent Activity -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Bulletin Board -->
                <UCard>
                    <template #header>
                        <div class="flex items-center justify-between">
                            <h3 class="text-xl font-semibold flex items-center">
                                <UIcon
                                    name="i-heroicons-megaphone"
                                    class="w-5 h-5 mr-2 text-blue-500"
                                />
                                Company Announcements
                            </h3>
                            <UButton
                                size="sm"
                                color="gray"
                                variant="ghost"
                                icon="i-heroicons-arrow-right"
                                trailing
                            >
                                View All
                            </UButton>
                        </div>
                    </template>
                    <div class="space-y-4">
                        <div
                            class="border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-r-lg"
                        >
                            <div class="flex items-start justify-between">
                                <div class="flex-1">
                                    <h4
                                        class="font-semibold text-red-800 dark:text-red-200"
                                    >
                                        🚨 System Maintenance Schedule
                                    </h4>
                                    <p
                                        class="text-sm text-red-700 dark:text-red-300 mt-1"
                                    >
                                        HRIS system will be down for maintenance
                                        this Saturday from 2:00 AM to 6:00 AM...
                                    </p>
                                    <p
                                        class="text-xs text-red-600 dark:text-red-400 mt-2"
                                    >
                                        August 5, 2025 • IT Department
                                    </p>
                                </div>
                                <UBadge color="red" variant="soft" size="sm"
                                    >High</UBadge
                                >
                            </div>
                        </div>

                        <div
                            class="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-r-lg"
                        >
                            <div class="flex items-start justify-between">
                                <div class="flex-1">
                                    <h4
                                        class="font-semibold text-blue-800 dark:text-blue-200"
                                    >
                                        🎉 New Employee Benefits Program
                                    </h4>
                                    <p
                                        class="text-sm text-blue-700 dark:text-blue-300 mt-1"
                                    >
                                        We're excited to announce enhanced
                                        healthcare benefits and wellness
                                        programs...
                                    </p>
                                    <p
                                        class="text-xs text-blue-600 dark:text-blue-400 mt-2"
                                    >
                                        August 3, 2025 • HR Department
                                    </p>
                                </div>
                                <UBadge color="blue" variant="soft" size="sm"
                                    >Medium</UBadge
                                >
                            </div>
                        </div>

                        <div
                            class="border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 p-4 rounded-r-lg"
                        >
                            <div class="flex items-start justify-between">
                                <div class="flex-1">
                                    <h4
                                        class="font-semibold text-green-800 dark:text-green-200"
                                    >
                                        🏖️ Holiday Reminder - Independence Day
                                    </h4>
                                    <p
                                        class="text-sm text-green-700 dark:text-green-300 mt-1"
                                    >
                                        Reminder: August 26 is a national
                                        holiday. Office will be closed...
                                    </p>
                                    <p
                                        class="text-xs text-green-600 dark:text-green-400 mt-2"
                                    >
                                        August 1, 2025 • Admin
                                    </p>
                                </div>
                                <UBadge color="green" variant="soft" size="sm"
                                    >Low</UBadge
                                >
                            </div>
                        </div>
                    </div>
                </UCard>

                <!-- Recent Attendance -->
                <UCard>
                    <template #header>
                        <div class="flex items-center justify-between">
                            <h3 class="text-xl font-semibold flex items-center">
                                <UIcon
                                    name="i-heroicons-clock"
                                    class="w-5 h-5 mr-2 text-green-500"
                                />
                                Recent Attendance
                            </h3>
                            <UButton
                                size="sm"
                                color="gray"
                                variant="ghost"
                                icon="i-heroicons-arrow-right"
                                trailing
                            >
                                View All
                            </UButton>
                        </div>
                    </template>
                    <UTable
                        :rows="recentAttendance"
                        :columns="attendanceColumns"
                        :ui="{ td: { padding: 'px-3 py-2' } }"
                    >
                        <template #date-data="{ row }">
                            <span class="font-medium">{{
                                formatShortDate(row.date)
                            }}</span>
                        </template>
                        <template #time_in-data="{ row }">
                            <span
                                class="text-green-600 dark:text-green-400 font-mono text-sm"
                            >
                                {{ formatTime(row.time_in) }}
                            </span>
                        </template>
                        <template #time_out-data="{ row }">
                            <span
                                class="text-red-600 dark:text-red-400 font-mono text-sm"
                            >
                                {{ formatTime(row.time_out) }}
                            </span>
                        </template>
                        <template #status-data="{ row }">
                            <UBadge
                                :color="row.late_duration > 0 ? 'red' : 'green'"
                                variant="soft"
                                size="sm"
                            >
                                {{ row.late_duration > 0 ? "Late" : "On Time" }}
                            </UBadge>
                        </template>
                    </UTable>
                </UCard>
            </div>

            <!-- Right Sidebar -->
            <div class="space-y-6">
                <!-- Leave Balance Breakdown -->
                <UCard>
                    <template #header>
                        <h3 class="text-xl font-semibold flex items-center">
                            <UIcon
                                name="i-heroicons-chart-pie"
                                class="w-5 h-5 mr-2 text-purple-500"
                            />
                            Leave Balance
                        </h3>
                    </template>
                    <div class="space-y-4">
                        <div class="space-y-2">
                            <div class="flex justify-between items-center">
                                <span
                                    class="text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Vacation Leave
                                </span>
                                <span class="text-sm font-bold">8/10</span>
                            </div>
                            <UProgress :value="80" color="green" size="sm" />
                        </div>

                        <div class="space-y-2">
                            <div class="flex justify-between items-center">
                                <span
                                    class="text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Sick Leave
                                </span>
                                <span class="text-sm font-bold">5/5</span>
                            </div>
                            <UProgress :value="100" color="blue" size="sm" />
                        </div>

                        <div class="space-y-2">
                            <div class="flex justify-between items-center">
                                <span
                                    class="text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Emergency Leave
                                </span>
                                <span class="text-sm font-bold">2/3</span>
                            </div>
                            <UProgress :value="66" color="yellow" size="sm" />
                        </div>
                    </div>
                </UCard>

                <!-- Upcoming Events -->
                <UCard>
                    <template #header>
                        <h3 class="text-xl font-semibold flex items-center">
                            <UIcon
                                name="i-heroicons-calendar-days"
                                class="w-5 h-5 mr-2 text-orange-500"
                            />
                            Upcoming Events
                        </h3>
                    </template>
                    <div class="space-y-3">
                        <div
                            class="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                            <div class="flex-shrink-0">
                                <div
                                    class="w-3 h-3 bg-blue-500 rounded-full mt-2"
                                ></div>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p
                                    class="text-sm font-medium text-gray-900 dark:text-white truncate"
                                >
                                    🎯 Team Building Activity
                                </p>
                                <p
                                    class="text-xs text-gray-600 dark:text-gray-400"
                                >
                                    Aug 15 • Company Event
                                </p>
                            </div>
                        </div>

                        <div
                            class="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                            <div class="flex-shrink-0">
                                <div
                                    class="w-3 h-3 bg-purple-500 rounded-full mt-2"
                                ></div>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p
                                    class="text-sm font-medium text-gray-900 dark:text-white truncate"
                                >
                                    📊 Performance Review
                                </p>
                                <p
                                    class="text-xs text-gray-600 dark:text-gray-400"
                                >
                                    Aug 20 • HR Meeting
                                </p>
                            </div>
                        </div>

                        <div
                            class="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                            <div class="flex-shrink-0">
                                <div
                                    class="w-3 h-3 bg-red-500 rounded-full mt-2"
                                ></div>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p
                                    class="text-sm font-medium text-gray-900 dark:text-white truncate"
                                >
                                    🇵🇭 Independence Day
                                </p>
                                <p
                                    class="text-xs text-gray-600 dark:text-gray-400"
                                >
                                    Aug 26 • National Holiday
                                </p>
                            </div>
                        </div>
                    </div>
                </UCard>

                <!-- My Equipment -->
                <UCard>
                    <template #header>
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-semibold flex items-center">
                                <UIcon
                                    name="i-heroicons-computer-desktop"
                                    class="w-5 h-5 mr-2 text-gray-500"
                                />
                                My Equipment
                            </h3>
                            <UButton
                                size="sm"
                                color="gray"
                                variant="ghost"
                                icon="i-heroicons-arrow-right"
                                trailing
                            >
                                View All
                            </UButton>
                        </div>
                    </template>
                    <div class="space-y-3">
                        <div
                            class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                        >
                            <div class="flex items-center space-x-2">
                                <UIcon
                                    name="i-heroicons-computer-desktop"
                                    class="w-4 h-4 text-gray-600"
                                />
                                <span class="text-sm">Dell OptiPlex 7090</span>
                            </div>
                            <UBadge color="green" variant="soft" size="xs"
                                >Active</UBadge
                            >
                        </div>
                        <div
                            class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                        >
                            <div class="flex items-center space-x-2">
                                <UIcon
                                    name="i-heroicons-device-phone-mobile"
                                    class="w-4 h-4 text-gray-600"
                                />
                                <span class="text-sm">iPhone 13</span>
                            </div>
                            <UBadge color="green" variant="soft" size="xs"
                                >Active</UBadge
                            >
                        </div>
                    </div>
                </UCard>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// Types
interface AttendanceRecord {
    id: number;
    date: string;
    time_in: string;
    time_out: string;
    late_duration: number;
}

// Reactive data with dummy values
const user = ref({
    id: 1,
    name: "John Doe",
    email: "john.doe@company.com",
    role: "employee",
});

// Sample attendance data
const recentAttendance = ref<AttendanceRecord[]>([
    {
        id: 1,
        date: "2025-08-06",
        time_in: "09:15:00",
        time_out: "17:15:00",
        late_duration: 0.25,
    },
    {
        id: 2,
        date: "2025-08-05",
        time_in: "09:00:00",
        time_out: "17:00:00",
        late_duration: 0,
    },
    {
        id: 3,
        date: "2025-08-04",
        time_in: "08:55:00",
        time_out: "17:05:00",
        late_duration: 0,
    },
    {
        id: 4,
        date: "2025-08-03",
        time_in: "09:10:00",
        time_out: "17:10:00",
        late_duration: 0.17,
    },
    {
        id: 5,
        date: "2025-08-02",
        time_in: "08:58:00",
        time_out: "17:08:00",
        late_duration: 0,
    },
]);

// Table columns
const attendanceColumns = [
    { key: "date", label: "Date" },
    { key: "time_in", label: "Time In" },
    { key: "time_out", label: "Time Out" },
    { key: "status", label: "Status" },
];

// Helper functions
const getCurrentDate = () => {
    return new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
};

const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

// Future: Replace with actual API call
onMounted(() => {
    // fetchDashboardData();
    console.log("Employee dashboard loaded with dummy data");
});
</script>
