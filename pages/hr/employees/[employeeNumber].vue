<template>
    <div class="max-w-3xl mx-auto p-6 space-y-8">
        <div v-if="employee">
            <!-- Personal Information -->
            {{ employee }}
            <div class="flex gap-2">
                <UButton @click="pageContent = 'personal'">Personal Details</UButton>
                <UButton @click="pageContent = 'employment'">Employment Details</UButton>
            </div>
            <div class="" v-if="pageContent == 'personal'">
                <section>
                    <h2 class="text-xl font-bold mb-4">Personal Details</h2>
                    <ul class="space-y-1">
                        <li>
                            <strong>Employee Number:</strong>
                            {{ employee.employee_number }}
                        </li>
                        <li><strong>Status:</strong> {{ employee.status }}</li>
                        <li>
                            <strong>Date Hired:</strong>
                            {{ employee.date_hired }}
                        </li>
                        <li>
                            <strong>First Name:</strong>
                            {{ employee.personal_details.first_name }}
                        </li>
                        <li>
                            <strong>Middle Name:</strong>
                            {{ employee.personal_details.middle_name }}
                        </li>
                        <li>
                            <strong>Last Name:</strong>
                            {{ employee.personal_details.last_name }}
                        </li>
                        <li>
                            <strong>Gender:</strong>
                            {{ employee.personal_details.gender }}
                        </li>
                        <li>
                            <strong>Civil Status:</strong>
                            {{ employee.personal_details.civil_status }}
                        </li>
                        <li>
                            <strong>Nationality:</strong>
                            {{ employee.personal_details.nationality }}
                        </li>
                    </ul>
                </section>
                <!-- Contact Information -->
                <section>
                    <h2 class="text-xl font-bold mt-8 mb-4">Contact</h2>
                    <ul class="space-y-1">
                        <li>
                            <strong>Type:</strong> {{ employee.contact.type }}
                        </li>
                        <li>
                            <strong>Value:</strong> {{ employee.contact.value }}
                        </li>
                    </ul>
                </section>
                <!-- Address -->
                <section>
                    <h2 class="text-xl font-bold mt-8 mb-4">Address</h2>
                    <ul class="space-y-1">
                        <li>
                            <strong>Region:</strong>
                            {{ employee.addresses.region }}
                        </li>
                        <li>
                            <strong>Province:</strong>
                            {{ employee.addresses.province }}
                        </li>
                        <li>
                            <strong>City:</strong> {{ employee.addresses.city }}
                        </li>
                        <li>
                            <strong>Barangay:</strong>
                            {{ employee.addresses.barangay }}
                        </li>
                        <li>
                            <strong>Street:</strong>
                            {{ employee.addresses.street }}
                        </li>
                        <li>
                            <strong>House Number:</strong>
                            {{ employee.addresses.house_number }}
                        </li>
                        <li>
                            <strong>ZIP Code:</strong>
                            {{ employee.addresses.zip_code }}
                        </li>
                    </ul>
                </section>
                <section>
                    <h2 class="text-xl font-bold mt-8 mb-4">
                        Emergency Contact
                    </h2>
                    <ul class="space-y-1">
                        <li>
                            <strong>Name:</strong>
                            {{ employee.emergency_contact.name }}
                        </li>
                        <li>
                            <strong>Relationship:</strong>
                            {{ employee.emergency_contact.relationship }}
                        </li>
                        <li>
                            <strong>Contact Number:</strong>
                            {{ employee.emergency_contact.contact_number }}
                        </li>
                        <li>
                            <strong>Email:</strong>
                            {{ employee.emergency_contact.email }}
                        </li>
                        <li>
                            <strong>Address:</strong>
                            {{ employee.emergency_contact.address }}
                        </li>
                    </ul>
                </section>
            </div>

            <!-- Emergency Contact -->

            <!-- Employment Details -->
            <div v-if="pageContent == 'employment'">
                <section>
                    <h2 class="text-xl font-bold mt-8 mb-4">
                        Employment Details
                    </h2>
                    <ul class="space-y-1">
                        <li>
                            <strong>Job Title:</strong>
                            {{ employee.employment_details.job_title }}
                        </li>
                        <li>
                            <strong>Department:</strong>
                            {{ employee.employment_details.department }}
                        </li>
                    </ul>

                    <!-- Reporting -->
                    <div v-if="employee.employment_details.reports_to.length">
                        <h3 class="text-lg font-semibold mt-4">Reports To</h3>
                        <ul>
                            <li
                                v-for="manager in employee.employment_details
                                    .reports_to"
                                :key="manager.id"
                            >
                                {{ manager.full_name }} ({{
                                    manager.relationship_type
                                }})
                            </li>
                        </ul>
                    </div>

                    <div v-if="employee.employment_details.reports_from.length">
                        <h3 class="text-lg font-semibold mt-4">Subordinates</h3>
                        <ul>
                            <li
                                v-for="sub in employee.employment_details
                                    .reports_from"
                                :key="sub.id"
                            >
                                {{ sub.full_name }} ({{
                                    sub.relationship_type
                                }})
                            </li>
                        </ul>
                    </div>

                    <!-- Movements -->
                    <div v-if="employee.employment_details.movements.length">
                        <h3 class="text-lg font-semibold mt-4">Movements</h3>
                        <ul>
                            <li
                                v-for="(move, index) in employee
                                    .employment_details.movements"
                                :key="index"
                            >
                                {{ move.movement_type }} -
                                {{ move.description }} (From:
                                {{ move.from_job_id }} → To:
                                {{ move.to_job_id }})
                            </li>
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<!-- Reusable info display -->
<script setup lang="ts">
import { UButton } from "#components";

const route = useRoute(); // 👈 access route params dynamically
const { fetchWithCsrf } = useApi();

const employeeNumber = route.params.employeeNumber as string;
const pageContent = ref("personal");

console.log(employeeNumber);

const {
    data: employee,
    pending,
    error,
} = await useAsyncData<any>(`employee-${employeeNumber}`, () =>
    fetchWithCsrf(`/api/hr/employees/${employeeNumber}`)
);
</script>
