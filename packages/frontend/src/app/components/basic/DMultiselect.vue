<script setup lang="ts">
import { ref, watchEffect, toRefs } from "vue";
import DBtn from "./DBtn.vue";
import DTextField from "./DTextField.vue";
import DList from "./DList.vue";
import { ChevronDownIcon, Loading02Icon } from "./icons";

const openMultiSelect = ref(false);
const searchValue = ref("");
const itemsList = ref();
watchEffect(() => {
  itemsList.value = props.options;
});
const arraySelected = ref<any[]>([]);
const count = ref(0);
const selected = ref();
const copyItems = ref();
const copySelected = ref();
const countCopy = ref();

const props = withDefaults(
  defineProps<{
    label: string;
    modelValue: any[];
    options: any[];
    headerTitle?: string;
    showKey?: string;
    valueKey?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    class?: string;
    field?: any;
    readonly?: string | boolean;
    allModel?: any;
    //openMultiSelect: boolean
  }>(),
  {
    label: "",
    modelValue: () => [],
    options: () => [],
    headerTitle: "",
    showKey: "name",
    valueKey: "id",
    error: "",
    disabled: false,
    required: false,
    class: "",
    //openMultiSelect: false
  }
);

const { modelValue } = toRefs(props);

const emits = defineEmits(["update:modelValue", "change", "filter", "file"]);

const emitUpdate = (val: any) => {
  emits("update:modelValue", val);
};

const emitChange = () => {
  emits("change");
};

const addSelected = (item: any) => {
  arraySelected.value.push(item);
  itemsList.value = filter(itemsList.value, arraySelected.value);
  count.value += 1;
};

const deleteSelected = (item: any) => {
  itemsList.value.push(item);
  arraySelected.value = filter(arraySelected.value, itemsList.value);
  count.value -= 1;
};

const filter = (items: any[], listFilter: any[]) => {
  listFilter = listFilter.map((_: { [x: string]: any }) => _[props.valueKey]);
  items = items.filter(
    (item: { [x: string]: any }) =>
      listFilter.indexOf(item[props.valueKey]) == -1
  );
  return items;
};

const openSelect = () => {
  if (props.options?.length > 0) openMultiSelect.value = true;
  copyItems.value = [...itemsList.value];
  copySelected.value = [...arraySelected.value];
  countCopy.value = count.value;
  if (props.modelValue.length == props.options.length) {
    checkAll();
  } else {
    let itemSelected = itemsList.value.filter(
      (item: { [x: string]: any }) =>
        props.modelValue.indexOf(String(item[props.valueKey])) > -1
    );
    for (const item of itemSelected) {
      addSelected(item);
    }
  }
};

const checkAll = () => {
  arraySelected.value = [];
  arraySelected.value = [...props.options];
  itemsList.value = [];
  count.value = arraySelected.value?.length;
};

const uncheckAll = () => {
  arraySelected.value = [];
  itemsList.value = props.options;
  count.value = 0;
};

const saveSelection = () => {
  selected.value = arraySelected.value;
  //emitUpdate(selected.value.map((_) => _[props.valueKey].toString()))
  emitUpdate(
    selected.value.map((_: { [x: string]: any }) =>
      typeof _[props.valueKey] == "number"
        ? _[props.valueKey].toString()
        : _[props.valueKey]
    )
  );
  emitChange();
  openMultiSelect.value = false;
};

const cancelSelection = () => {
  itemsList.value = copyItems.value;
  arraySelected.value = copySelected.value;
  openMultiSelect.value = false;
  count.value = arraySelected.value?.length;
};
</script>
<template>
  <div class="w-full" :class="class">
    <label class="block text-left text-sm font-medium text-gray-700 mb-1.5">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <label
      class="block w-full py-2 px-2 rounded-md shadow-sm border h-9_3"
      :class="[error === '' ? 'border-gray-300' : 'border-red-500']"
    >
      <div
        class="w-full h-full items-center justify-between flex"
        v-if="options?.length > 0"
      >
        <span class="text-sm truncate ...">
          {{ `${modelValue?.length} Opciones Seleccionadas` }}
        </span>
        <ChevronDownIcon class="w-4 h-4" />
      </div>

      <div class="w-full h-full items-center justify-between flex" v-else>
        <span class="text-gray-400 pl-2 text-sm truncate ...">
          {{ `Esperando datos...` }}
        </span>
        <Loading02Icon class="rotate text-gray-400" />
      </div>

      <input
        class="opacity-0 hidden"
        @click="openSelect"
        @input="($event: any) => emitUpdate($event.target.value)"
        :value="modelValue"
      />
    </label>
    <span class="text-xs text-red-500">{{ error }}</span>
  </div>

  <div
    class="fixed z-10 inset-0 overflow-hidden bg-gray-500 bg-opacity-75 transition-opacity h-full"
    v-if="openMultiSelect"
  >
    <div
      class="w-screen h-full flex justify-center flex-col items-center align-bottom overflow-hidden shadow-2xl transform transition-all px-3"
    >
      <div class="card-container bg-white rounded-lg overflow-hidden">
        <div>
          <header
            class="sticky inset-x-0 top-0 bg-gray-100 w-full h-16 px-4 flex items-center justify-center gap-3 border"
          >
            <!-- <slot name="title_header"></slot> -->
            <h1 class="font-bold text-xl">{{ headerTitle }}</h1>
            <div
              class="flex justify-center items-center rounded-full bg-blue-600 text-white w-9 h-9 font-bold"
            >
              {{ count }}
            </div>
          </header>
          <article>
            <div class="p-3">
              <d-text-field
                placeholder="Buscar..."
                v-model="searchValue"
              ></d-text-field>
            </div>

            <div class="flex flex-row items-start">
              <div
                class="w-screen h-full border-2 border-white border-r-gray-200 py-5 px-2 max-h-96 overflow-y-auto overflow-x-hidden"
              >
                <a
                  :class="[
                    { 'cursor-not-allowed pointer-events-none': disabled },
                  ]"
                  class="text-gray-400 cursor-pointer underline"
                  @click.prevent="checkAll"
                >
                  Marcar Todos
                </a>
                <d-list
                  v-for="(item, index) in itemsList.filter(function (x: any) {
                    return (
                      searchValue == '' ||
                      x[showKey]
                        .toUpperCase()
                        .indexOf(searchValue.toUpperCase()) > -1
                    );
                  })"
                  :key="index"
                  :nameItem="item[showKey]"
                  @clicked="addSelected(item)"
                  :class="[
                    { 'cursor-not-allowed pointer-events-none': disabled },
                  ]"
                >
                </d-list>
              </div>
              <div
                class="w-screen h-full py-5 px-2 max-h-96 overflow-y-auto overflow-x-hidden"
              >
                <a
                  class="text-gray-400 cursor-pointer underline"
                  :class="[
                    { 'cursor-not-allowed pointer-events-none': disabled },
                  ]"
                  @click.prevent="uncheckAll"
                >
                  Desmarcar Todos
                </a>
                <d-list
                  v-for="(item, index) in arraySelected.filter(function (x) {
                    return (
                      searchValue == '' ||
                      x[showKey]
                        .toUpperCase()
                        .indexOf(searchValue.toUpperCase()) > -1
                    );
                  })"
                  :key="index"
                  :nameItem="item[showKey]"
                  @clicked="deleteSelected(item)"
                  :class="[
                    { 'cursor-not-allowed pointer-events-none': disabled },
                  ]"
                >
                </d-list>
              </div>
            </div>
          </article>
          <footer
            class="sticky inset-x-0 bottom-0 right-0 w-full flex justify-center items-center sm:justify-end h-16 gap-2 border-2 border-white border-t-gray-200 px-5"
          >
            <d-btn color="secondary" @click="cancelSelection()">Cancelar</d-btn>
            <d-btn @click.prevent="saveSelection">Aceptar</d-btn>
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.card-container {
  width: 100vw;
  max-width: 750px;
}
.h-9_3 {
  height: 2.375rem;
}
</style>
