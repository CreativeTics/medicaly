<script setup>
import { ref } from 'vue'

const props = defineProps({
  tabList: Array
})
const activeTab = ref(1)
</script>

<template>
  <div class="h-full">
    <ul class="flex flex-col md:flex-row md:border-b-2 tracking-widest ml-4">
      <li
        v-for="(tab, index) in props.tabList"
        :key="index"
        class="tab active flex font-bold rounded-t-lg hover:bg-gray-100"
        :class="{
          'border-blue-600 text-blue-600 hover:text-blue-600 border-b-2':
            index + 1 === activeTab,
          'text-gray-400 ': index + 1 !== activeTab
        }">
        <label
          style="display: block"
          :for="`${index}`"
          class="h-full w-full text-sm text-center block p-3 cursor-pointer">
          {{ tab }}
        </label>
        <input
          style="position: absolute; top: -20px"
          :id="`${index}`"
          type="radio"
          :name="`tab`"
          :value="index + 1"
          v-model="activeTab" />
      </li>
    </ul>

    <template v-for="(tab, index) in props.tabList">
      <div class="" :key="index" v-if="index + 1 === activeTab">
        <slot :name="`tabPanel-${index + 1}`" />
      </div>
    </template>
  </div>
</template>

<style></style>
