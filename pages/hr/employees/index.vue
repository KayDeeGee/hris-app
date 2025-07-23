<template>
    <div class="p-4">
        <h1 class="text-xl font-bold mb-4">Employee List</h1>

        <UTable
            :rows="rows"
            :columns="columns"
            :loading="loading"
            :ui="{
                td: { base: 'align-top' },
                thead: 'bg-gray-100',
            }"
        >
            <template #actions-data="{ row }">
                <div class="flex gap-2">
                    <NuxtLink
                        :to="`/hr/employees/${row.employeeNumber}`"
                        class="text-blue-600 hover:underline"
                    >
                        View
                    </NuxtLink>
                    <UButton
                        icon="i-heroicons-pencil"
                        size="xs"
                        @click="showEdit(row)"
                    />
                    <UButton
                        icon="i-heroicons-trash"
                        size="xs"
                        color="red"
                        @click="showDelete(row)"
                    />
                </div>
            </template>
        </UTable>

        <BaseConfirmModal
            v-model="showEditModal"
            title="Edit Leave Type?"
            confirmText="Yes, Edit"
            cancelText="Cancel"
            confirmColor="red"
            @confirm="confirmEdit"
            @cancel="cancelEdit"
            @close="cancelEdit"
        >
            <div v-if="selectedRow">
                <div class="">
                    <UFormGroup label="Name">
                        <UInput v-model="editForm.name" />
                    </UFormGroup>
                    <UFormGroup label="Description">
                        <UInput v-model="editForm.description" />
                    </UFormGroup>
                    <UFormGroup label="Notice Days">
                        <UInput v-model="editForm.notice_days" type="number" />
                    </UFormGroup>
                    <UFormGroup label="Value">
                        <UInput v-model="editForm.value" />
                    </UFormGroup>
                </div>
            </div>
        </BaseConfirmModal>
        <BaseConfirmModal
            v-model="showDeleteModal"
            title="Delete Leave Type?"
            confirmText="Yes, Delete"
            cancelText="Cancel"
            confirmColor="red"
            @confirm="confirmDelete"
            @cancel="cancelDelete"
            @close="cancelDelete"
        >
            <div v-if="selectedRow" class="space-y-2 text-sm text-gray-700">
                <p><strong>Name:</strong> {{ selectedRow.name }}</p>
                <p>
                    <strong>Description:</strong> {{ selectedRow.description }}
                </p>
                <p>
                    <strong>Notice Days:</strong> {{ selectedRow.notice_days }}
                </p>
                <p><strong>Value:</strong> {{ selectedRow.value }}</p>
            </div>
        </BaseConfirmModal>
    </div>
</template>

<script setup lang="ts">
const { fetchWithCsrf } = useApi();
const loading = ref(false);
const rows = ref<any[]>([]);

const columns = [
    { key: "employeeNumber", label: "Employee #" },
    {
        key: "fullName",
        label: "Name",
        sortable: false,
    },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "jobTitle", label: "Job Title" },
    { key: "actions", label: "Actions" },
];

// Transform employee data
const transformEmployees = (data: any[]) => {
    return data.map((emp) => ({
        ...emp,
        fullName: `${emp.firstName} ${emp.lastName}`,
        jobTitle: emp.jobTitle || "—",
    }));
};

onMounted(async () => {
    loading.value = true;
    try {
        const res = await fetchWithCsrf<any[]>("/api/hr/employees");
        rows.value = transformEmployees(res);
    } catch (err) {
        console.error("Failed to fetch employees", err);
    } finally {
        loading.value = false;
    }
});

const showEdit = (row: any) => {
    console.log("Editing", row);
    // TODO: open edit modal with row data
};

const showDelete = (row: any) => {
    console.log("Deleting", row);
    // TODO: open delete confirm modal with row
};
</script>
