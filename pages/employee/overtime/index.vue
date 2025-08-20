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
      <UCard>
        <template #header>Request Overtime</template>
        <form @submit.prevent="submitOvertime" class="space-y-4">
          <UFormGroup label="Date" name="date">
            <UInput type="date" v-model="form.date" required />
          </UFormGroup>

          <UFormGroup label="Hours" name="hours">
            <UInput type="number" v-model="form.hours" min="1" required />
          </UFormGroup>

          <UFormGroup label="Reason" name="reason">
            <UTextarea v-model="form.reason" placeholder="Enter reason" />
          </UFormGroup>

          <UButton type="submit" :loading="loading">Submit</UButton>
        </form>
      </UCard>

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

        <span>Page {{ overtime.current_page }} of {{ overtime.last_page }}</span>

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
const { fetchWithCsrf } = useApi();
const loading = ref(false)
const totalOvertime = ref(0)

const form = ref({
  date: "",
  hours: "",
  reason: "",
})

// Table setup
const columns = [
  { key: "date", label: "Date" },
  { key: "hours", label: "Hours" },
  { key: "reason", label: "Reason" },
  { key: "status", label: "Status" },
]

const overtime = ref({
  data: [],
  current_page: 1,
  last_page: 1,
  next_page_url: null,
  prev_page_url: null,
})

const fetchOvertime = async (page = 1) => {
  const res = await fetchWithCsrf<any>(`/api/employee/overtime?page=${page}`)
  overtime.value = res
}

const fetchTotalOvertime = async () => {
  const res = await fetchWithCsrf<any>("/api/employee/overtime/total")
  totalOvertime.value = res.total
}

const submitOvertime = async () => {
  loading.value = true
  try {
    await fetchWithCsrf<any>("/api/employee/overtime", {
      method: "POST",
      body: form.value,
    })
    await fetchOvertime(overtime.value.current_page) // refresh table
    await fetchTotalOvertime()
    form.value = { date: "", hours: "", reason: "" }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOvertime()
  fetchTotalOvertime()
})
</script>
