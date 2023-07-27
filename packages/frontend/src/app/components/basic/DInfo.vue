<script setup>
import { ref, watch } from 'vue'
import { XCircleIcon, InfoCircleIcon } from './icons'

const info = ref(null)
const open = ref(true)

watch(info, (newValue) => {
  if (newValue != null && open.value == true) {
    info.value.focus()
  }
})

const props = defineProps({
  title: { type: String, default: '' },
  formula: { type: String, default: '' },
  errors: Array,
  icon: { type: String, default: 'info' },
  td: { type: String, default: '' }
})

const onClose = () => {
  open.value = false
}

const whenOpen = (id) => {
  open.value = true
  //
  setTimeout(() => {
    if (document.getElementById(id).clientHeight > 200) {
      document.getElementById(id).style.width = '500px'
    } else {
      document.getElementById(id).style.width = '300px'
    }
    document
      .getElementById(id)
      .scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'end' })
  }, 10)
}
</script>
<template>
  <div class="flex ml-1">
    <XCircleIcon
      v-if="icon === 'error'"
      @click="whenOpen(td)"
      class="mr-1.5 w-6 text-red-600 cursor-pointer" />
    <InformationCircleIcon
      v-if="icon === 'info'"
      @click="whenOpen(td)"
      class="w-6 text-blue-600 cursor-pointer" />

    <div
      ref="info"
      :id="td"
      @focusout="onClose"
      tabindex="0"
      v-if="open"
      class="absolute z-10 bg-white overflow-hidden flex flex-col border-2 border-gray-200 rounded-md h-auto shadow-2xl focus:outline-none ml-6">
      <header class="bg-gray-100 text-base py-2 px-4">
        <h1 class="font-semibold">{{ title }}</h1>
      </header>
      <main class="py-3 px-4 flex flex-col gap-3 max-h-96 overflow-y-auto">
        <template v-if="icon === 'info'">
          <p class="break-words text-sm leading-4">
            {{ formula }}
          </p>
        </template>
        <template v-else>
          <ul class="text-base leading-4">
            <li
              type="disc"
              class="ml-5"
              v-for="ListError in errors"
              v-bind:key="ListError">
              {{ ListError.value }}
            </li>
          </ul>
        </template>
        <slot></slot>
      </main>
    </div>
  </div>
</template>
