<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Attendance Records
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1">
        Employee attendance tracking and management
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-8">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin w-6 h-6" />
    </div>

    <!-- Table -->
    <UTable
      v-else-if="res?.data"
      :rows="res.data"
      :columns="columns"
      :loading="loading"
      class="w-full"
    >
      <!-- Custom slot for date formatting -->
      <template #date-data="{ row }">
        <span class="font-medium">
          {{ formatDate(row.date) }}
        </span>
      </template>

      <!-- Custom slot for time formatting -->
      <template #time_in-data="{ row }">
        <span class="text-green-600 dark:text-green-400 font-mono">
          {{ formatTime(row.time_in) }}
        </span>
      </template>

      <template #time_out-data="{ row }">
        <span class="text-red-600 dark:text-red-400 font-mono">
          {{ formatTime(row.time_out) }}
        </span>
      </template>

      <!-- Custom slot for total hours -->
      <template #total_hours-data="{ row }">
        <span class="font-medium">
          {{ row.total_hours }}h
        </span>
      </template>

      <!-- Custom slot for late duration with badge -->
      <template #late_duration-data="{ row }">
        <UBadge
          v-if="row.late_duration > 0"
          color="red"
          variant="soft"
          size="sm"
        >
          {{ row.late_duration }}h late
        </UBadge>
        <UBadge
          v-else
          color="green"
          variant="soft"
          size="sm"
        >
          On time
        </UBadge>
      </template>
    </UTable>

    <!-- Pagination -->
    <div v-if="res && res.last_page > 1" class="flex justify-center mt-6">
      <UPagination
        v-model="currentPage"
        :page-count="res.per_page"
        :total="res.total"
        :max="7"
        show-last
        show-first
      />
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading && (!res?.data || res.data.length === 0)" class="text-center py-8">
      <UIcon name="i-heroicons-calendar-days" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        No attendance records found
      </h3>
      <p class="text-gray-600 dark:text-gray-400">
        There are no attendance records to display at the moment.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">


const { fetchWithCsrf } = useApi();
const loading = ref(false);
const res = ref<PaginatedAttendanceRecord>();
const currentPage = ref(1);

// Table columns configuration
const columns = [
  {
    key: 'employee_id',
    label: 'Employee ID',
    sortable: true
  },
  {
    key: 'date',
    label: 'Date',
    sortable: true
  },
  {
    key: 'time_in',
    label: 'Time In',
    sortable: true
  },
  {
    key: 'time_out',
    label: 'Time Out',
    sortable: true
  },
  {
    key: 'total_hours',
    label: 'Total Hours',
    sortable: true
  },
  {
    key: 'late_duration',
    label: 'Status',
    sortable: true
  }
];

// Fetch attendance records
const fetchAttendanceRecords = async (page: number = 1) => {
  loading.value = true;
  try {
    res.value = await fetchWithCsrf<PaginatedAttendanceRecord>(
      `/api/hr/attendance-records?page=${page}`
    );
  } catch (err) {
    console.error("Failed to fetch attendance records", err);
  } finally {
    loading.value = false;
  }
};

// Format date helper
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format time helper
const formatTime = (timeString: string) => {
  return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Watch for page changes
watch(currentPage, (newPage) => {
  fetchAttendanceRecords(newPage);
});

// Initial fetch
onMounted(() => {
  fetchAttendanceRecords();
});
</script>