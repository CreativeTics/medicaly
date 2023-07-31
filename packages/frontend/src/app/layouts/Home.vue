<script setup lang="ts">
import Sidebar from "@components/Sidebar.vue";
import DToastStack from "@components/DToastStack.vue";

import { useRouter } from "vue-router";

import { menu } from "../../config";

const router = useRouter();

const changeRoute = (route: string) => {
  console.log(route);
  router.push(route);
};
</script>

<template>
  <DToastStack class="left-14" />
  <main class="h-screen w-screen text-gray-900 bg-gray-50 flex">
    <Sidebar :menu="menu" @change:route="changeRoute"> </Sidebar>
    <div class="w-full overflow-hidden mb-1">
      <div class="w-full p-5">
        <slot></slot>
      </div>
    </div>
  </main>
</template>
