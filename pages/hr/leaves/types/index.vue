<template>
    <div>
        <UTable :rows="rows" :columns="columns" :loading="loading">
            <template #actions-data="{ row }">
                <div class="flex gap-2">
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

const rows = ref<LeaveType[]>([]);
const loading = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const selectedRow = ref<LeaveType | null>(null);

// Form data for editing
const editForm = ref({
    name: "",
    description: "",
    notice_days: 0,
    value: 0,
});

const columns = [
    {
        key: "name",
        label: "Name",
    },
    {
        key: "description",
        label: "Description",
    },
    {
        key: "notice_days",
        label: "Notice Days",
    },
    {
        key: "value",
        label: "Value",
    },
    {
        key: "actions",
        label: "Actions",
        sortable: false,
    },
];

function showEdit(row: LeaveType) {
    console.log("Editing row:", row);

    // Store the selected row
    selectedRow.value = row;

    // Populate the form with current data
    editForm.value = {
        name: row.name,
        description: row.description ?? "",
        notice_days: row.notice_days ?? 0,
        value: row.value ?? 1,
    };

    // Show the modal
    showEditModal.value = true;
}

function cancelEdit() {
    showEditModal.value = false;
    selectedRow.value = null;
    // Reset form
    editForm.value = {
        name: "",
        description: "",
        notice_days: 0,
        value: 0,
    };
}

async function confirmEdit() {
    if (!selectedRow.value) return;

    try {
        const updatedData = await fetchWithCsrf(
            "/api/hr/leave-types/" + selectedRow.value.id,
            {
                method: "PUT",
                body: editForm.value,
            }
        );

        console.log("Saving:", editForm.value);

        // Update the row in the table
        const index = rows.value.findIndex(
            (r) => r.id === selectedRow.value!.id
        );
        if (index !== -1) {
            rows.value[index] = { ...selectedRow.value, ...editForm.value };
        }

        // Close modal
        showEditModal.value = false;
        selectedRow.value = null;
    } catch (error) {
        console.error("Failed to save changes:", error);
    }
}

function showDelete(row: LeaveType) {
    console.log("Removing row:", row);
    selectedRow.value = row;

    showDeleteModal.value = true;
}

const confirmDelete = async () => {
    if (!selectedRow.value) return;

    try {
        await fetchWithCsrf("/api/hr/leave-types/" + selectedRow.value.id, {
            method: "DELETE",
        });

        // Remove the deleted row from the table
        rows.value = rows.value.filter(
            (row) => row.id !== selectedRow.value!.id
        );

        console.log(`Deleted leave type ID: ${selectedRow.value.id}`);

        // Close modal and reset state
        showDeleteModal.value = false;
        selectedRow.value = null;
    } catch (error) {
        console.error("Failed to delete:", error);
    }
};

const cancelDelete = () => {
    selectedRow.value = null;

    showDeleteModal.value = false;
};

onMounted(async () => {
    loading.value = true;
    try {
        const response = await fetchWithCsrf<LeaveType[]>(
            "/api/hr/leave-types"
        );
        rows.value = response;
    } catch (error) {
        console.error("Failed to fetch leave types", error);
    } finally {
        loading.value = false;
    }
});
</script>
