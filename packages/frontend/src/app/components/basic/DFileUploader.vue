<script setup lang="ts">
import { UploadCloud01Icon, File06Icon } from "./icons";
import DBtn from "./DBtn.vue";

const props = withDefaults(
  defineProps<{
    label: string;
    mode: string;
    modelValue: string;
    helpText: string;
    multiple: boolean;
    accept: string;
    disabled: boolean;
    error: string;
  }>(),
  {
    label: "edit",
    mode: "",
    modelValue: "",
    helpText: "Carga tu archivo",
    multiple: false,
    accept: "",
    disabled: false,
    error: "",
  }
);

const emit = defineEmits(["update:modelValue", "file", "handleFileDownload"]);

const emitUpdate = (val: any) => {
  emit("update:modelValue", val.target.value);
};

const inputFileChange = (e: any) => {
  const files = e.target.files;
  if (files.length > 0) {
    const file = files[0];
    if (file.type.match(props.accept)) {
      onFileChange(file);
    }
  }
};

const onFileChange = (file: any) => {
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.onload = (e) => {
    const data = _arrayBufferToBase64(e.target?.result);
    emit("file", { content: data, name: file.name });
  };
};

const _arrayBufferToBase64 = (buffer: any) => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

const deleteFile = () => {
  emit("update:modelValue", "");
};
</script>

<template>
  <div>
    <div class="w-full min-w-full" v-if="mode == 'edit'">
      <label class="block text-sm font-medium text-gray-700 mb-1.5">{{
        label
      }}</label>
      <label
        class="flex justify-center items-center rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-gray-100 h-32"
        @input="emitUpdate($event)"
        :disabled="disabled"
        :class="[
          { error },
          { 'bg-gray-200': disabled, 'pointer-events-none': disabled },
        ]"
      >
        <span
          v-if="modelValue"
          class="flex flex-col justify-center items-center"
        >
          <File06Icon class="h-10 w-10 text-gray-300" />
          {{
            modelValue.indexOf("\\") >= 0
              ? modelValue
                  .split("\\")
                  [modelValue.split("\\").length - 1].indexOf("UpHere") >= 0
                ? modelValue
                    .split("\\")
                    [modelValue.split("\\").length - 1].split("UpHere")[
                    modelValue
                      .split("\\")
                      [modelValue.split("\\").length - 1].split("UpHere")
                      .length - 1
                  ]
                : modelValue.split("\\")[modelValue.split("\\").length - 1]
              : modelValue
                  .split("/")
                  [modelValue.split("/").length - 1].indexOf("UpHere") >= 0
              ? modelValue
                  .split("/")
                  [modelValue.split("/").length - 1].split("UpHere")[
                  modelValue
                    .split("/")
                    [modelValue.split("/").length - 1].split("UpHere").length -
                    1
                ]
              : modelValue.split("/")[modelValue.split("/").length - 1]
          }}
        </span>
        <span v-else class="flex flex-col justify-center items-center">
          {{ helpText }}
          <UploadCloud01Icon class="h-10 w-10 text-gray-300" />
        </span>
        <input type="file" class="opacity-0 hidden" @change="inputFileChange" />
      </label>
      <DBtn
        v-if="modelValue !== ''"
        :disabled="disabled"
        :color="disabled ? 'disabled' : 'default'"
        class="mt-2"
        type="button"
        @click="deleteFile()"
      >
        Borrar archivo
      </DBtn>
      <span class="text-xs text-red-500">{{ error }}</span>
    </div>
    <div v-else>
      <label class="block text-sm font-medium text-gray-700">{{ label }}</label>
      <div class="flex mt-1">
        <input
          class="focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-transparent block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md py-2 px-2"
          :class="[
            { 'bg-gray-200': disabled, 'pointer-events-none': disabled },
          ]"
          type="text"
          :value="modelValue"
          :disabled="mode == 'view'"
        />
        <div>
          <DBtn type="button" @click="$emit('handleFileDownload', modelValue)">
            Descargar
          </DBtn>
        </div>
      </div>
    </div>
  </div>
</template>
