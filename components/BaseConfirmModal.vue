<template>
  <UModal v-model="isOpen">
    <UCard>
      <!-- Header -->
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ title }}
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            @click="cancel"
          />
        </div>
      </template>

      <!-- Body content -->
      <div class="text-sm text-gray-700 dark:text-gray-300">
        <slot />
      </div>

      <!-- Footer with built-in buttons -->
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" @click="cancel">
            {{ cancelText }}
          </UButton>
          <UButton  @click="confirm">
            {{ confirmText }}
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  confirmText?: string
  cancelText?: string
  confirmColor?: string
}>(), {
  title: 'Are you sure?',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  confirmColor: 'red'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'close'): void
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
})

function cancel() {
  emit('cancel')
  isOpen.value = false
}

function confirm() {
  emit('confirm')
  isOpen.value = false
}

function close() {
  emit('close')
  isOpen.value = false
}

defineExpose({ cancel, confirm })
</script>
