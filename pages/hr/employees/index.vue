<template>
    <div class="p-4">
        <h1 class="text-xl font-bold mb-4">Employee List</h1>
        <div class="overflow-auto rounded shadow">
            <table class="min-w-full text-sm text-left border border-gray-200">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="px-4 py-2 border">Employee #</th>
                        <th class="px-4 py-2 border">Name</th>
                        <th class="px-4 py-2 border">Email</th>
                        <th class="px-4 py-2 border">Phone</th>
                        <th class="px-4 py-2 border">Job Title</th>
                        <th class="px-4 py-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(employee, index) in employees"
                        :key="index"
                        class="hover:bg-gray-50"
                    >
                        <td class="px-4 py-2 border">
                            {{ employee.employeeNumber }}
                        </td>
                        <td class="px-4 py-2 border">
                            {{ employee.firstName }} {{ employee.lastName }}
                        </td>
                        <td class="px-4 py-2 border">{{ employee.email }}</td>
                        <td class="px-4 py-2 border">{{ employee.phone }}</td>
                        <td class="px-4 py-2 border">
                            {{ employee.jobTitle ?? "—" }}
                        </td>
                        <td class="px-4 py-2 border space-x-2">
                            <NuxtLink
                                :to="`/hr/employees/${employee.employeeNumber}`"
                                class="text-blue-600 hover:underline"
                            >
                                View
                            </NuxtLink>
                            <button class="text-green-600 hover:underline">
                                Edit
                            </button>
                            <button class="text-red-600 hover:underline">
                                Delete
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
const { fetchWithCsrf } = useApi();

const { data: employees } = await useAsyncData<any>("employees", () =>
    fetchWithCsrf("/api/hr/employees")
);
</script>

<style scoped></style>
