<template>
    <div>
        <UTable :rows="rows" :columns="columns" :loading="loading">
            <template #actions-data="{ row }">
                <div class="flex gap-2">
                    <UButton
                        icon="i-heroicons-pencil"
                        size="xs"
                        @click="edit(row)"
                    />
                    <UButton
                        icon="i-heroicons-trash"
                        size="xs"
                        color="red"
                        @click="remove(row)"
                    />
                </div>
            </template>
        </UTable>
        
        <!-- Modal outside the table -->
        <!-- <BaseModal v-model="showModal" title="Edit Leave Type">
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
            <template #footer>
                <div class="flex justify-end gap-2">
                    <UButton variant="outline" @click="cancelEdit">
                        Cancel
                    </UButton>
                    <UButton @click="saveEdit">
                        Save Changes
                    </UButton>
                </div>
            </template>
        </BaseModal> -->
    </div>
</template>

<script setup lang="ts">
import BaseModal from '~/components/BaseModal.vue';

const { fetchWithCsrf } = useApi();

const rows = ref<LeaveType[]>([]);
const loading = ref(false);
const showModal = ref(false);
const selectedRow = ref<LeaveType | null>(null);

// Form data for editing
const editForm = ref({
    name: '',
    description: '',
    notice_days: 0,
    value: 0
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
        sortable: false
    },
];

function edit(row: LeaveType) {
    console.log("Editing row:", row);
    
    // Store the selected row
    selectedRow.value = row;
    
    // Populate the form with current data
    editForm.value = {
        name: row.name,
        description: row.description ?? '',
        notice_days: row.notice_days ?? 0,
        value: row.value ?? 1
    };
    
    // Show the modal
    showModal.value = true;
}

function cancelEdit() {
    showModal.value = false;
    selectedRow.value = null;
    // Reset form
    editForm.value = {
        name: '',
        description: '',
        notice_days: 0,
        value: 0
    };
}

async function saveEdit() {
    if (!selectedRow.value) return;
    
    try {
        const updatedData = await fetchWithCsrf('/api/hr/leave-types/' + selectedRow.value.id, {
            method: 'PUT',
            body: editForm.value
        });
        
        console.log("Saving:", editForm.value);
        
        // Update the row in the table
        const index = rows.value.findIndex(r => r.id === selectedRow.value!.id);
        if (index !== -1) {
            rows.value[index] = { ...selectedRow.value, ...editForm.value };
        }
        
        // Close modal
        showModal.value = false;
        selectedRow.value = null;
        
    } catch (error) {
        console.error('Failed to save changes:', error);
    }
}

function remove(row: LeaveType) {
    console.log("Removing row:", row);
    // You can add a confirmation modal here too if needed
}

onMounted(async () => {
    loading.value = true
    try {
        const response = await fetchWithCsrf<LeaveType[]>('/api/hr/leave-types')
        rows.value = response
    } catch (error) {
        console.error('Failed to fetch leave types', error)
    } finally {
        loading.value = false
    }
})
</script>