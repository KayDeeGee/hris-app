<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

// Define sidebar links per role
const menuByRole = {
  HR: [
    { name: 'Dashboard', icon: 'i-heroicons-home', path: '/hr/dashboard' },
    { name: 'Employees', icon: 'i-heroicons-users', path: '/hr/employees' },
    { name: 'Leave Requests', icon: 'i-heroicons-calendar', path: '/hr/leaves' },
  ],
  Manager: [
    { name: 'Team Dashboard', icon: 'i-heroicons-home', path: '/manager/dashboard' },
    { name: 'Leave Approvals', icon: 'i-heroicons-check-circle', path: '/manager/leaves' },
  ],
  Employee: [
    { name: 'My Profile', icon: 'i-heroicons-user', path: '/employee/profile' },
    { name: 'My Leaves', icon: 'i-heroicons-calendar', path: '/employee/leaves/credits' },
  ]
}

// Reactive menu for the logged-in user's role
const menuItems = computed(() => menuByRole[authStore.role] || [])
</script>

<template>
  <aside class="bg-gray-900 text-white w-64 min-h-screen p-4">
    <div class="mb-8 text-xl font-bold">HRIS</div>
    <nav class="space-y-2">
      <button
        v-for="item in menuItems"
        :key="item.path"
        @click="router.push(item.path)"
        class="flex items-center space-x-2 w-full text-left px-3 py-2 rounded hover:bg-gray-700 transition"
      >
        <span :class="item.icon"></span>
        <span>{{ item.name }}</span>
      </button>
    </nav>
  </aside>
</template>
