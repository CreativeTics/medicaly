<script setup lang="ts">
import { computed } from 'vue'
import Loading02Icon from './icons/Loading02Icon.vue'
import DIcon from './DIcon.vue'

const props = withDefaults(
  defineProps<{
    color?: string
    loading?: boolean
    disabled?: boolean
    type?: 'submit' | 'reset' | 'button'
    icon?: string
  }>(),
  {
    color: 'default',
    loading: false,
    disabled: false,
    type: 'submit',
    icon: ''
  }
)

const classes = computed(() => {
  switch (props.color) {
    case 'disabled':
      return 'bg-gray-300 text-gray-500 cursor-not-allowed'
    case 'success':
      return 'bg-green-500 text-white hover:bg-green-700 focus:ring-green-500 cursor-pointer'
    case 'warning':
      return 'bg-orange-500 text-white hover:bg-orange-700 focus:ring-orange-500 cursor-pointer'
    case 'danger':
      return 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 cursor-pointer'
    case 'secondary':
      return 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-300 cursor-pointer'
    case 'white':
      return 'bg-white text-gray-800 hover:bg-gray-100 focus:ring-gray-100 cursor-pointer'
    case 'light':
      return 'bg-white-400 text-indigo-700 hover:bg-indigo-700 hover:text-white border-4 border-indigo-300 text-black focus:ring-white cursor-pointer'
    default:
      return 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 cursor-pointer'
  }
})
</script>
<template>
  <button
    :disabled="disabled"
    :type="type"
    class="inline-flex text-sm justify-center items-center py-1.5 px-4 border border-transparent shadow-sm rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
    :class="[classes, { 'cursor-pointer': !disabled, 'cursor-not-allowed': disabled }]">
    <DIcon class="text-white pr-2 w-7" v-if="icon" :name="icon" />
    <Loading02Icon v-if="loading" class="rotate"></Loading02Icon>
    <slot v-else />
  </button>
</template>
<style>
.rotate {
  animation: rotation 2s infinite linear;
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>
