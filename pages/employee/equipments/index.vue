<template>
  <div class="p-6 space-y-6">
    <h1 class="text-2xl font-bold">Employee Equipment</h1>

    <!-- Equipment List -->
    <UTable :rows="equipment" :columns="columns">
      <template #actions-data="{ row }">
        <UButton color="red" @click="removeEquipment(row.id)">
          Remove
        </UButton>
      </template>
    </UTable>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "auth",
})

const { fetchWithCsrf } = useApi()
const route = useRoute()
const employeeId = route.params.id

const equipment = ref([])
const equipmentTypes = ref([])

const columns = [
  { key: 'type.name', label: 'Type' },
  { key: 'serial_number', label: 'Serial' },
  { key: 'status', label: 'Status' },
]

onMounted(async () => {
  await fetchEquipment()
  equipmentTypes.value = await fetchWithCsrf('/api/equipment-types') // endpoint for types
})

async function fetchEquipment() {
  equipment.value = await fetchWithCsrf(`/api/employees/${employeeId}/equipment`)
}

</script>
