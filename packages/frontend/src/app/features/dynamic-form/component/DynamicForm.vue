<script setup lang="ts">
import { markRaw, onMounted, reactive, ref } from "vue";
import { useValidation } from "../../../core/composable/validation/index";
import { DTab, DTabs, DBtn } from "../../../components/basic";
import DynamicField from "./DynamicField.vue";
import { useNotificationsStore } from "../../../../store/notifications";

const notifications = useNotificationsStore();

const props = defineProps({
  formSchema: { type: Object, required: true, default: () => {} },
  initialModel: { type: Object, required: false, default: () => {} },
  readonly: { type: Boolean, required: false, default: false },
  titleBtnSave: { type: String, required: false, default: "" },
  getData: { type: Boolean, required: false, default: false },
  fixedHeight: { type: Boolean, required: false, default: true },
  gridClass: {
    required: false,
    default: "grid grid-cols-8 px-6 py-4",
  },
});

const emit = defineEmits([
  "submit",
  "cancel",
  "update",
  "dataFile",
  "updateField",
]);

const tabs = markRaw<any[]>(props.formSchema.tabs);

/**
 * Datos componente Loading
 */
const loading = ref(false);

const {
  model,
  validationSchema,
  handleValidation,
  addDependencyValidation,
  addValidation,
  setInitialModel,
} = useValidation();

const defaultValues = ref<any>({});
const files = reactive<any>([]);

const onHandleSubmit = async () => {
  if (handleValidation()) {
    loading.value = true;
    // for (const file of files) {
    //   model[file.field] = await saveFile(file.content, file.name);
    // }
    loading.value = false;
    emit("submit", model);
  } else {
    notifications.addNotification({
      title: "Campos obligatorios",
      text: "Faltan campos obligatorios por completar",
      type: "error",
      time: 10000,
    });
  }
};

const handleUpdateField = (name: string, value: any) => {
  handleValidation();
  emit("updateField", { name, value });
};

const setFieldsRules = () => {
  for (const tab of tabs) {
    for (const group of tab.groups || []) {
      for (const field of group.fields || []) {
        if (field.rules?.length > 0) {
          addValidation(field.name, field.rules);
          if (field.if) {
            addDependencyValidation({
              key: field.name,
              dependKey: field.if,
            });
          }
        }
        if (field?.default) {
          if (field.type === "multiselect") {
            defaultValues.value[field.name] = [
              // replacePayrollTags(field.default[0]),
            ];
          } else {
            defaultValues.value[field.name] = field.default;
          }
        } else {
          let defaultValue: any = "";
          defaultValue = field.type === "check" ? false : defaultValue;
          defaultValue = field.type === "multiselect" ? [] : defaultValue;
          defaultValue = field.type === "number" ? undefined : defaultValue;

          defaultValues.value[field.name] = defaultValue;
        }
      }
    }
  }
};

const overrideEditingProps = () => {
  for (const tab of tabs) {
    for (const group of tab.groups || []) {
      for (const field of group.fields || []) {
        if (
          field.editingProps &&
          model[field.name] !== undefined &&
          props.titleBtnSave !== "Guardar"
        ) {
          field.props = {
            ...field.props,
            ...field.editingProps,
          };
        }
      }
    }
  }
};

onMounted(() => {
  console.log("props.initialModel", props.initialModel);
  setFieldsRules();
  setInitialModel({
    ...defaultValues.value,
    ...props.initialModel,
  });
  overrideEditingProps();
});

const setModelValue = (fieldName: string, value: any) => {
  model[fieldName] = value;
  handleValidation();
};

const getModelValue = (fieldName: string) => {
  return model[fieldName];
};

defineExpose<{
  getModelValue: (fieldName: string) => any;
  setModelValue: (fieldName: string, value: any) => void;
  setFieldsRules: () => any;
}>({
  getModelValue,
  setModelValue,
  setFieldsRules,
});
</script>

<template>
  <form class="pt-responsive w-full" @submit.prevent="onHandleSubmit">
    <DTabs :fixed-eight="fixedHeight">
      <template v-slot:default="slotProps">
        <DTab
          v-for="tab in tabs"
          :key="tab.name"
          :title="tab.name"
          :selected-title="slotProps?.selectedTitle"
        >
          <div
            v-for="(group, index) in tab.groups as any[]"
            :key="index"
            :class="gridClass"
          >
            <div
              v-if="group.if ? !!model[group.if] : true"
              class="col-span-8 sm:col-span-3 lg:col-span-2 flex flex-col pb-2 sm:pb-0"
            >
              <span class="text-base font-semibold text-gray-700 pb-2">
                {{ group.name }}
              </span>
              <span class="text-xs font-light text-gray-400">
                {{ group.description }}
              </span>
            </div>
            <div
              v-if="group.if ? !!model[group.if] : true"
              class="col-span-8 sm:col-span-5 lg:col-span-6 grid grid-cols-6 gap-x-6 gap-y-4"
            >
              <DynamicField
                v-for="(field, index) in group.fields as any []"
                class="col-span-8 sm:col-span-6 lg:col-span-3 xl:col-span-2"
                :count="index"
                :key="index"
                :field="field"
                v-model="model[field.name]"
                :error="validationSchema[field.name]?.errors.join(',')"
                :query="field.query"
                :depends-on="field.dependsOn"
                :all-model="model"
                :readonly="readonly"
                @update:model-value="
                  handleValidation, handleUpdateField(field.name, $event)
                "
                @update:file="
                  files.push({
                    field: field.name,
                    ...$event,
                  })
                "
              />
            </div>
            <hr
              class="col-span-8 mt-14"
              v-if="index != tab.groups.length - 1"
            />
          </div>
        </DTab>
      </template>
    </DTabs>
    <div class="p-5 bg-white shadow-md h-24 rounded-br-md rounded-bl-md">
      <hr class="pb-5" />
      <div class="flex items-center justify-end">
        <div>
          <DBtn
            type="button"
            class="font-semibold py-1 text-base mr-3"
            color="secondary"
            @click="emit('cancel')"
          >
            {{ getData ? "Volver" : "Cancelar" }}
          </DBtn>
          <DBtn
            v-if="!getData && !readonly"
            class="font-semibold py-1 text-base"
          >
            {{ titleBtnSave }}
          </DBtn>
        </div>
      </div>
    </div>
  </form>
</template>
