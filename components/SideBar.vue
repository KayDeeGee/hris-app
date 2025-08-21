<!-- components/Sidebar.vue -->
<template>
  <aside class="h-screen w-64 bg-gray-800 text-white flex flex-col shadow-lg">
    <!-- Logo / App Name -->
    <div class="p-6 text-2xl font-bold border-b border-gray-700">
      MyApp
    </div>

    <!-- Navigation Links -->
    <nav class="flex-1 p-4 space-y-6 overflow-y-auto">
      <!-- Employee Section -->
      <div>
        <h3 class="px-4 text-xs uppercase tracking-wider text-gray-400 mb-2">
          Employee
        </h3>
        <div class="space-y-1">
          <NuxtLink
            v-for="link in employeeLinks"
            :key="link.to"
            :to="link.to"
            class="block px-4 py-2 rounded-lg hover:bg-gray-700 transition"
            active-class="bg-gray-700"
          >
            {{ link.label }}
          </NuxtLink>
        </div>
      </div>

      <!-- HR Section -->
      <!-- <div>
        <h3 class="px-4 text-xs uppercase tracking-wider text-gray-400 mb-2">
          HR
        </h3>
        <div class="space-y-1">
          <NuxtLink
            v-for="link in hrLinks"
            :key="link.to"
            :to="link.to"
            class="block px-4 py-2 rounded-lg hover:bg-gray-700 transition"
            active-class="bg-gray-700"
          >
            {{ link.label }}
          </NuxtLink>
        </div>
      </div> -->

      <!-- Manager Section -->
      <!-- <div>
        <h3 class="px-4 text-xs uppercase tracking-wider text-gray-400 mb-2">
          Manager
        </h3>
        <div class="space-y-1">
          <NuxtLink
            v-for="link in managerLinks"
            :key="link.to"
            :to="link.to"
            class="block px-4 py-2 rounded-lg hover:bg-gray-700 transition"
            active-class="bg-gray-700"
          >
            {{ link.label }}
          </NuxtLink>
        </div>
      </div> -->
    </nav>

    <!-- Footer -->
    <div class="p-4 border-t border-gray-700 text-sm text-gray-400">
      © 2025 MyApp
    </div>
  </aside>
</template>

<script setup lang="ts">
const employeeLinks = [
  { label: "Dashboard", to: "/employee" },
  { label: "Profile", to: "/employee/profile" },
  { label: "Leaves", to: "/employee/leaves" },
  { label: "Overtime", to: "/employee/overtime" },
  { label: "Equipments", to: "/employee/equipments" },
]

// const hrLinks = [
//   { label: "Dashboard", to: "/hr/dashboard" },
//   { label: "Employees", to: "/hr/employees" },
//   { label: "Leave Requests", to: "/hr/leaves" },
//   { label: "Reports", to: "/hr/reports" },
// ]

// const managerLinks = [
//   { label: "Dashboard", to: "/manager/dashboard" },
//   { label: "Team", to: "/manager/team" },
//   { label: "Approvals", to: "/manager/approvals" },
//   { label: "Analytics", to: "/manager/analytics" },
// ]
</script>
