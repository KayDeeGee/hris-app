<template>
    <div class="max-w-3xl mx-auto p-6">
        <div v-if="employee">
            <h1 class="text-2xl font-bold mb-4">
                {{ employee.firstName }} {{ employee.lastName }}
            </h1>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <div class="text-gray-500 text-sm">Employee Number</div>
                    <div class="font-medium">{{ employee.employeeNumber }}</div>
                </div>

                <div>
                    <div class="text-gray-500 text-sm">Email</div>
                    <div class="font-medium">{{ employee.email }}</div>
                </div>

                <div>
                    <div class="text-gray-500 text-sm">Phone</div>
                    <div class="font-medium">{{ employee.phone }}</div>
                </div>

                <div>
                    <div class="text-gray-500 text-sm">Job Title</div>
                    <div class="font-medium">
                        {{ employee.jobTitle ?? "N/A" }}
                    </div>
                </div>

                <div>
                    <div class="text-gray-500 text-sm">Department</div>
                    <div class="font-medium">
                        {{ employee.department ?? "N/A" }}
                    </div>
                </div>

                <div>
                    <div class="text-gray-500 text-sm">Date Hired</div>
                    <div class="font-medium">{{ employee.dateHired }}</div>
                </div>

                <div>
                    <div class="text-gray-500 text-sm">Status</div>
                    <div class="font-medium">{{ employee.status }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<!-- Reusable info display -->
<script setup lang="ts">
const route = useRoute(); // 👈 access route params dynamically
const { fetchWithCsrf } = useApi();

const employeeNumber = route.params.employeeNumber as string;
console.log(employeeNumber);

const {
    data: employee,
    pending,
    error,
} = await useAsyncData<EmployeeDetail>(`employee-${employeeNumber}`, () =>
    fetchWithCsrf(`/api/hr/employees/${employeeNumber}`)
);
</script>
