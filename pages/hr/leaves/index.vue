<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Leave Requests</h1>
    <NuxtLink to="/hr/leave/create" class="btn btn-primary mb-4">+ Request Leave</NuxtLink>

    <table class="min-w-full text-sm">
      <thead>
        <tr>
          <th class="px-4 py-2 text-left">Date</th>
          <th class="px-4 py-2 text-left">Type</th>
          <th class="px-4 py-2 text-left">Status</th>
          <th class="px-4 py-2 text-left">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="leave in leaves" :key="leave.id">
          <td class="px-4 py-2">{{ leave.created_at }}</td>
          <td class="px-4 py-2">{{ leave.leave_type?.name }}</td>
          <td class="px-4 py-2 capitalize">{{ leave.status }}</td>
          <td class="px-4 py-2">
            <NuxtLink :to="`/hr/leave/${leave.id}`" class="text-blue-600 hover:underline">View</NuxtLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
const { fetchWithCsrf } = useApi();

const { data: leaves } = await useAsyncData<LeaveRequest[]>("leaves", () =>
  fetchWithCsrf("/api/hr/leave-requests")
);
</script>
