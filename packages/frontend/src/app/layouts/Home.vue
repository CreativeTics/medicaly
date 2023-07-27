<script setup lang="ts">
import Sidebar from "@components/Sidebar.vue";

import { menu } from "../../config";
</script>

<template>
  <DToastStack class="left-14" />
  <main class="h-screen w-screen text-gray-900 bg-gray-50 flex">
    <Sidebar :menu="menu"> </Sidebar>
    <div class="w-full overflow-hidden mb-1">
      <div class="w-full p-5">
        <slot></slot>
      </div>
    </div>
  </main>
</template>
