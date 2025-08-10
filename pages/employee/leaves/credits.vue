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
      <UCard class="hover:shadow-lg transition-shadow cursor-pointer" @click="$router.push('/leaves/credits')">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Total Leave Credits</h3>
            <UIcon name="i-heroicons-calendar" class="w-6 h-6 text-blue-500" />
          </div>
        </template>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">Available</span>
            <span class="text-3xl font-bold text-blue-600">{{ totalCredits.available }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">Used This Year</span>
            <span class="text-lg font-medium text-gray-800 dark:text-gray-200">{{ totalCredits.used }}</span>
          </div>
          <UProgress :value="usagePercentage" class="mt-3" color="blue" />
          <div class="text-center pt-2">
            <UBadge color="blue" variant="soft">View Details</UBadge>
          </div>
        </div>
      </UCard>

      <!-- Apply Leave Card -->
      <UCard class="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800" @click="$router.push('/leaves/apply')">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-green-800 dark:text-green-200">Apply for Leave</h3>
            <UIcon name="i-heroicons-plus-circle" class="w-6 h-6 text-green-500" />
          </div>
        </template>
        <div class="text-center space-y-4">
          <UIcon name="i-heroicons-calendar-plus" class="w-16 h-16 text-green-500 mx-auto" />
          <p class="text-sm text-green-700 dark:text-green-300">
            Submit a new leave request
          </p>
          <UButton color="green" size="lg" block>
            Apply Now
          </UButton>
        </div>
      </UCard>

      <!-- Leave Schedule Card (Placeholder) -->
      <UCard class="hover:shadow-lg transition-shadow cursor-pointer opacity-75" @click="showComingSoon = true">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-600">Leave Schedule</h3>
            <UIcon name="i-heroicons-calendar-days" class="w-6 h-6 text-gray-400" />
          </div>
        </template>
        <div class="text-center space-y-4">
          <UIcon name="i-heroicons-clock" class="w-16 h-16 text-gray-400 mx-auto" />
          <p class="text-sm text-gray-500">
            View team leave calendar
          </p>
          <UBadge color="gray" variant="soft">Coming Soon</UBadge>
        </div>
      </UCard>
    </div>

    <!-- Leave Requests Table -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold flex items-center">
            <UIcon name="i-heroicons-list-bullet" class="w-5 h-5 mr-2 text-purple-500" />
            Recent Leave Requests
          </h3>
          <div class="flex items-center space-x-3">
            <USelectMenu
              v-model="statusFilter"
              :options="statusOptions"
              placeholder="Filter by Status"
              class="w-40"
              size="sm"
            />
            <UButton
              icon="i-heroicons-funnel"
              color="gray"
              variant="ghost"
              size="sm"
              @click="clearFilters"
            >
              Clear
            </UButton>
          </div>
        </div>
      </template>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-8">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin w-6 h-6" />
      </div>

      <!-- Table -->
      <UTable
        v-else-if="filteredLeaveRequests.length > 0"
        :rows="filteredLeaveRequests"
        :columns="leaveColumns"
        class="w-full"
      >
        <!-- Leave Type -->
        <template #leave_type-data="{ row }">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full" :class="getLeaveTypeColor(row.leave_type.name)"></div>
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
              {{ row.leave_details.length }} day{{ row.leave_details.length > 1 ? 's' : '' }}
            </div>
          </div>
        </template>

        <!-- Total Value -->
        <template #total_value-data="{ row }">
          <span class="font-mono text-sm font-medium">
            {{ row.total_value }} day{{ row.total_value > 1 ? 's' : '' }}
          </span>
        </template>

        <!-- Status -->
        <template #status-data="{ row }">
          <UBadge
            :variant="row.status === 'pending' ? 'soft' : 'solid'"
            size="sm"
          >
            {{ row.status.charAt(0).toUpperCase() + row.status.slice(1) }}
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

      <!-- Empty State -->
      <div v-else-if="!loading" class="text-center py-12">
        <UIcon name="i-heroicons-calendar-x-mark" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No leave requests found
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ statusFilter ? 'No requests match your current filter.' : 'You haven\'t submitted any leave requests yet.' }}
        </p>
        <UButton
          color="primary"
          icon="i-heroicons-plus"
          @click="$router.push('/leaves/apply')"
        >
          Apply for Leave
        </UButton>
      </div>
    </UCard>

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
          <UIcon name="i-heroicons-rocket-launch" class="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <p class="text-gray-600 dark:text-gray-400">
            The Leave Schedule feature is currently under development and will be available soon!
          </p>
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
interface LeaveType {
  id: number;
  name: string;
  description: string;
  notice_days: number;
  value: number;
}

interface LeaveDetail {
  id: number;
  leave_request_id: number;
  date: string;
  length: number; // 0.5 for half day, 1 for full day
}

interface LeaveRequest {
  id: number;
  employee_id: number;
  leave_type_id: number;
  total_value: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  created_at: string;
  updated_at: string;
  leave_type: LeaveType;
  leave_details: LeaveDetail[];
}

interface TotalCredits {
  available: number;
  used: number;
  total: number;
}

// Reactive data
const { fetchWithCsrf } = useApi();
const loading = ref(false);
const showComingSoon = ref(false);
const statusFilter = ref('');

// Sample data (replace with API calls)
// const leaveRequests = ref<LeaveRequest[]>([
//   {
//     id: 1,
//     employee_id: 1,
//     leave_type_id: 1,
//     total_value: 3,
//     reason: "Family vacation",
//     status: "approved",
//     created_at: "2025-07-15T10:30:00Z",
//     updated_at: "2025-07-16T14:20:00Z",
//     leave_type: {
//       id: 1,
//       name: "Vacation Leave",
//       description: "Annual vacation leave",
//       notice_days: 7,
//       value: 15
//     },
//     leave_details: [
//       { id: 1, leave_request_id: 1, date: "2025-08-15", length: 1 },
//       { id: 2, leave_request_id: 1, date: "2025-08-16", length: 1 },
//       { id: 3, leave_request_id: 1, date: "2025-08-19", length: 1 }
//     ]
//   },
//   {
//     id: 2,
//     employee_id: 1,
//     leave_type_id: 2,
//     total_value: 1,
//     reason: "Medical appointment",
//     status: "pending",
//     created_at: "2025-08-01T09:15:00Z",
//     updated_at: "2025-08-01T09:15:00Z",
//     leave_type: {
//       id: 2,
//       name: "Sick Leave",
//       description: "Medical leave",
//       notice_days: 1,
//       value: 10
//     },
//     leave_details: [
//       { id: 4, leave_request_id: 2, date: "2025-08-10", length: 0.5 }
//     ]
//   },
//   {
//     id: 3,
//     employee_id: 1,
//     leave_type_id: 3,
//     total_value: 2,
//     reason: "Family emergency",
//     status: "rejected",
//     created_at: "2025-07-20T16:45:00Z",
//     updated_at: "2025-07-21T11:30:00Z",
//     leave_type: {
//       id: 3,
//       name: "Emergency Leave",
//       description: "Emergency situations",
//       notice_days: 0,
//       value: 5
//     },
//     leave_details: [
//       { id: 5, leave_request_id: 3, date: "2025-07-25", length: 1 },
//       { id: 6, leave_request_id: 3, date: "2025-07-26", length: 1 }
//     ]
//   }
// ]);

const leaveRequests = ref<any[]>([]);

const totalCredits = ref<TotalCredits>({
  available: 22,
  used: 8,
  total: 30
});

// Computed
const usagePercentage = computed(() => {
  return totalCredits.value.total > 0 
    ? (totalCredits.value.used / totalCredits.value.total) * 100 
    : 0;
});

const filteredLeaveRequests = computed(() => {
  if (!statusFilter.value) return leaveRequests.value;
  return leaveRequests.value.filter(request => request.status === statusFilter.value);
});

// Table configuration
const leaveColumns = [
  { key: 'leave_type', label: 'Leave Type' },
  { key: 'dates', label: 'Dates' },
  { key: 'total_value', label: 'Duration' },
  { key: 'reason', label: 'Reason' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' }
];

const statusOptions = [
  { label: 'All Statuses', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Cancelled', value: 'cancelled' }
];

// Helper functions
const getLeaveTypeColor = (leaveType: string) => {
  const colors = {
    'Vacation Leave': 'bg-blue-500',
    'Sick Leave': 'bg-red-500',
    'Emergency Leave': 'bg-orange-500',
    'Maternity Leave': 'bg-pink-500',
    'Paternity Leave': 'bg-purple-500'
  };
  return colors[leaveType as keyof typeof colors] || 'bg-gray-500';
};

const getStatusColor = (status: string) => {
  const colors = {
    pending: 'yellow',
    approved: 'green',
    rejected: 'red',
    cancelled: 'gray'
  };
  return colors[status as keyof typeof colors] || 'gray';
};

const formatDateRange = (leaveDetails: LeaveDetail[]) => {
  if (leaveDetails.length === 0) return '';
  
  const sortedDetails = [...leaveDetails].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const startDate = new Date(sortedDetails[0].date);
  const endDate = new Date(sortedDetails[sortedDetails.length - 1].date);
  
  if (sortedDetails.length === 1) {
    return startDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }
  
  return `${startDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })} - ${endDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })}`;
};

const clearFilters = () => {
  statusFilter.value = '';
};

const viewLeaveDetails = (leave: LeaveRequest) => {
  // Navigate to detailed view or open modal
  console.log('Viewing leave details:', leave);
  // $router.push(`/leaves/${leave.id}`);
};

const editLeaveRequest = (leave: LeaveRequest) => {
  // Navigate to edit form
  console.log('Editing leave request:', leave);
  // $router.push(`/leaves/edit/${leave.id}`);
};

const cancelLeaveRequest = async (leave: LeaveRequest) => {
  // Show confirmation and cancel request
  console.log('Cancelling leave request:', leave);
  // Implement cancellation logic
};

// Fetch data
const fetchLeaveRequests = async () => {
  loading.value = true;
  try {
    // Replace with actual API call
    const response = await fetchWithCsrf<any[]>('/api/employee/leave-requests');
    leaveRequests.value = response;
    // totalCredits.value = response.credits;
  } catch (error) {
    console.error('Failed to fetch leave requests:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchLeaveRequests();
});
</script>