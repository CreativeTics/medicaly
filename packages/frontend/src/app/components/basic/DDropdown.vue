<script lang="ts" setup>
import { DotsVerticalIcon } from "./icons";

withDefaults(
  defineProps<{
    label: string;
    options: Array<any>;
    icon: boolean;
  }>(),
  {
    label: "",
    icon: true,
  }
);

defineEmits(["action"]);
</script>
<template>
  <div class="dropdown">
    <span>
      <DotsVerticalIcon v-if="icon" class="w-4"></DotsVerticalIcon>
      <p v-else>{{ label }}</p>
    </span>
    <ul>
      <template v-for="option in options">
        <li v-if="option.view" @click="$emit('action', option.action)">
          {{ option.name }}
        </li>
      </template>
    </ul>
  </div>
</template>
<style>
.dropdown {
  position: relative;
  width: auto;
  margin: 0 4px;
}

.dropdown span {
  display: block;
  padding: 5px;
  background: #e9e9e9;
  cursor: pointer;
}

.dropdown ul {
  list-style: none;
  position: absolute;
  right: 0;
  width: 190px;
}

.dropdown ul li {
  background: #ededed;
  color: #343838;
  overflow: hidden;
  cursor: pointer;
  transition: height 0.2s linear 0s;
  height: 0;
  padding: 0 10px;
}

.dropdown ul li:hover,
.dropdown ul li.selected {
  background: #8a8a8a;
  color: #fafafa;
}

.dropdown:hover ul {
  border: 1px solid #6e6e6e;
}

.dropdown:hover ul li {
  height: 36px;
  padding: 5px 10px;
}
</style>
