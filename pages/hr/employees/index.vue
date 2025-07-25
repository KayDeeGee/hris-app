<template>
    <div class="p-4">
        <h1 class="text-xl font-bold mb-4">Employee List</h1>

        <UTable
            :rows="rows"
            :columns="columns"
            :loading="loading"
            :row-key="(row: EmployeeRow) => row.employeeNumber"
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
            title="Quick Edit"
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
                        <UInput v-model="editForm.first_name" />
                    </UFormGroup>
                    <UFormGroup label="Description">
                        <UInput v-model="editForm.last_name" />
                    </UFormGroup>
                    <UFormGroup label="Notice Days">
                        <UInput v-model="editForm.email" type="email" />
                    </UFormGroup>
                    <UFormGroup label="Phone Number">
                        <UInput v-model="editForm.phone" />
                    </UFormGroup>
                    <UFormGroup label="Job Position">
                        <USelect
                            v-model="editForm.job_id"
                            :options="
                                jobStore.jobPosts.map((job) => ({
                                    label: job.title,
                                    value: job.id,
                                }))
                            "
                            placeholder="Select a job position"
                        />
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
const jobStore = useJobPostStore();

const loading = ref(false);


const rows = ref<EmployeeRow[]>([]);
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

//modal functions
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const selectedRow = ref<any | null>(null);

const editForm = ref({
    first_name: "",
    last_name: "",
    email: 0,
    phone: 0,
    job_id: 0,
});

// Transform employee data
const transformEmployees = (data: any[]) => {
    return data.map((emp) => ({
        ...emp,
        fullName: `${emp.firstName} ${emp.lastName}`,
        jobTitle: emp.jobTitle || "—",
    }));
};

const showEdit = (row: any) => {
    console.log("Editing row:", row);
    selectedRow.value = row;

    // Populate the form with current data
    editForm.value = {
        first_name: row.firstName,
        last_name: row.lastName ?? "",
        email: row.email ?? 0,
        phone: row.phone ?? 1,
        job_id: row.job_id ?? 1,
    };

    // Show the modal
    showEditModal.value = true;
};

const showDelete = (row: any) => {
    console.log("Deleting", row);

    showDeleteModal.value = true;
};

const confirmEdit = async () => {
    console.log("Confirmed edit");
    if (!selectedRow.value) return;

    try {
        const updatedData = await fetchWithCsrf(
            "/api/hr/employees/" + selectedRow.value.employeeNumber,
            {
                method: "PUT",
                body: editForm.value,
            }
        );

         // Update the row in the table
        const index = rows.value.findIndex(
            (r) => r.employeeNumber === selectedRow.value!.employeeNumber
        );
        if (index !== -1) {
            rows.value[index] = { ...selectedRow.value, ...editForm.value, fullName: `${editForm.value.first_name} ${editForm.value.last_name}` };
        }

        showDeleteModal.value = false;
        selectedRow.value = null;
        console.log(editForm.value);
    } catch (error) {
        console.error("Failed to delete:", error);
    }
};

const confirmDelete = async () => {
      if (!selectedRow.value) return;

    try {
        await fetchWithCsrf("/api/hr/employees/" + selectedRow.value.employeeNumber, {
            method: "DELETE",
        });

        rows.value = rows.value.filter(
            (row) => row.employeeNumber !== selectedRow.value!.employeeNumber
        );

        showDeleteModal.value = false;
        selectedRow.value = null;
    } catch (error) {
        console.error("Failed to delete:", error);
    }
};

const cancelEdit = () => {
    console.log("Canceled edit");
    selectedRow.value = null;

    editForm.value = {
        first_name: "",
        last_name: "",
        email: 0,
        phone: 0,
        job_id: 0,
    };
    showEditModal.value = false;
};

const cancelDelete = () => {
    selectedRow.value = null;
    showDeleteModal.value = false;
};

onMounted(async () => {
    loading.value = true;
    try {
        const res = await fetchWithCsrf<any[]>("/api/hr/employees");
        rows.value = transformEmployees(res);
        jobStore.fetchJobs();
    } catch (err) {
        console.error("Failed to fetch employees", err);
    } finally {
        loading.value = false;
    }
});
</script>
