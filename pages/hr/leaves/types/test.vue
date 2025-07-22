<template>
    <div>
        <UButton color="red" @click="showConfirm = true">Delete</UButton>
<BaseConfirmModal
  v-model="showConfirm"
  title="Delete Leave Type?"
  confirmText="Yes, Delete"
  cancelText="Cancel"
  confirmColor="red"
  @confirm="handleDelete"
/>
    </div>
</template>

<script setup>
const showConfirm = ref(false)

function handleDelete() {
  // Call your API or remove item
}
</script>

<style lang="scss" scoped>

</style>