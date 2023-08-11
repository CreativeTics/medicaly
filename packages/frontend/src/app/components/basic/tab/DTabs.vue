<script setup lang="ts">
import { ref, useSlots, onMounted } from "vue";

const slots = useSlots();
const selectedTitle = ref("");
const tabs = ref<any[]>([]);

const calculateTabs = () => {
  if (!slots.default) return;

  const rawTabs: any =
    Number(slots.default()[0].children?.length) > 0
      ? slots.default()?.[0]?.children
      : slots.default();

  selectedTitle.value = rawTabs?.[0]?.props?.title ?? "";

  tabs.value = [...(rawTabs as [])].map((tab: any) => {
    return {
      title: tab?.props?.title,
      isActive: tab?.props?.isActive,
    };
  });
};

onMounted(() => {
  calculateTabs();
});
</script>
<template>
  <div>
    <div>
      <ul class="h-full flex flex-row overflow-auto px-4 scroll">
        <li
          v-for="tab in tabs"
          :key="tab.title"
          class="w-min text-base font-semibold tracking-normal p-3 text-center cursor-pointer break-words whitespace-nowrap overflow-hidden"
          :class="
            selectedTitle === tab.title
              ? 'border-b-2 border-blue-600 text-blue-600 '
              : 'text-gray-400 border-b-2 border-gray-200'
          "
          @click="selectedTitle = tab.title"
        >
          {{ tab.title }}
        </li>
      </ul>
    </div>
    <div
      class="shadow-md content rounded-b-none scroll rounded-md overflow-y-auto w-full bg-white pt-1.5"
    >
      <slot :selectedTitle="selectedTitle"></slot>
    </div>
  </div>
</template>
<style scoped>
.content {
  height: calc(100vh - 18rem);
}
.content-modal {
  height: calc(100vh - 20rem);
}
.w-min {
  min-width: 12rem;
}
@media (max-width: 850px) {
  .content {
    height: calc(100vh - 22rem);
  }
  .content-modal {
    height: calc(100vh - 19rem);
  }
}
</style>
