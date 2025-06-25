<template>
  <div class="p-4">
    <h2 class="text-xl font-semibold mb-4">Job Applications</h2>

    <table class="w-full table-auto border border-gray-200 rounded-md text-sm">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 text-left">ID</th>
          <th class="px-4 py-2 text-left">Job Post ID</th>
          <th class="px-4 py-2 text-left">User ID</th>
          <th class="px-4 py-2 text-left">Status</th>
          <th class="px-4 py-2 text-left">Applied At</th>
          <th class="px-4 py-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="application in applications" :key="application.id" class="border-t">
          <td class="px-4 py-2">{{ application.id }}</td>
          <td class="px-4 py-2">{{ application.job_post_id }}</td>
          <td class="px-4 py-2">{{ application.user_id }}</td>
          <td class="px-4 py-2 capitalize">{{ application.status }}</td>
          <td class="px-4 py-2">{{ formatDate(application.applied_at) }}</td>
          <td class="px-4 py-2">
            <button class="text-blue-500 hover:underline" @click="viewApplication(application)">
              View
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
const message = useState<JobApplication[] | null>('messageApplication');
const applications = computed(() => message.value ?? []);

const formatDate = (date: string) => {
  return new Date(date).toLocaleString(); // or use dayjs/Intl for better formatting
};

const viewApplication = (app: JobApplication) => {
  console.log("Viewing application", app);
};
</script>
