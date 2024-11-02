<script setup lang="ts">
import { markRaw, onMounted, reactive, ref } from 'vue'
import { useValidation } from '../../../core/composable/validation/index'
import { DBtn } from '../../../components/basic'
import DynamicField from './DynamicField.vue'
import { useNotificationsStore } from '../../../../store/notifications'

const notifications = useNotificationsStore()

const props = defineProps({
  formSchema: { type: Object, required: true, default: () => {} },
  initialModel: { type: Object, required: false, default: () => {} },
  readonly: { type: Boolean, required: false, default: false },
  titleBtnSave: { type: String, required: false, default: '' },
  getData: { type: Boolean, required: false, default: false },
  gridClass: {
    required: false,
    default: 'grid grid-cols-8 px-6 py-4',
  },
  hideCancelButton: { type: Boolean, required: false, default: false },
  hideSubmitButton: { type: Boolean, required: false, default: false },
})

const emit = defineEmits([
  'submit',
  'cancel',
  'update',
  'dataFile',
  'updateField',
])

const groups = markRaw<any[]>(props.formSchema.groups)

const {
  model,
  validationSchema,
  handleValidation,
  addDependencyValidation,
  addValidation,
  setInitialModel,
} = useValidation()

const defaultValues = ref<any>({})
const files = reactive<any>([])

const onHandleSubmit = async () => {
  if (handleValidation()) {
    emit('submit', model)
  } else {
    notifications.addNotification({
      title: 'Campos obligatorios',
      text: 'Faltan campos obligatorios por completar',
      type: 'error',
      time: 10000,
    })
  }
}

const handleUpdateField = (name: string, value: any) => {
  handleValidation()
  emit('updateField', { name, value })
}

const setFieldsRules = () => {
  for (const group of groups || []) {
    for (const field of group.fields || []) {
      if (field.rules?.length > 0) {
        addValidation(field.name, field.rules)
        if (field.if) {
          addDependencyValidation({
            key: field.name,
            dependKey: field.if,
          })
        }
      }
      if (field?.default) {
        if (field.type === 'multiselect') {
          defaultValues.value[field.name] = [
            // replacePayrollTags(field.default[0]),
          ]
        } else {
          defaultValues.value[field.name] = field.default
        }
      } else {
        let defaultValue: any = ''
        defaultValue = field.type === 'check' ? false : defaultValue
        defaultValue = field.type === 'multiselect' ? [] : defaultValue
        defaultValue = field.type === 'number' ? undefined : defaultValue
        defaultValue = field.type === 'multiselect_search' ? [] : defaultValue

        defaultValues.value[field.name] = defaultValue
      }
    }
  }
}

const overrideEditingProps = () => {
  for (const group of groups || []) {
    for (const field of group.fields || []) {
      if (
        field.editingProps &&
        model[field.name] !== undefined &&
        props.titleBtnSave !== 'Guardar'
      ) {
        field.props = {
          ...field.props,
          ...field.editingProps,
        }
      }
    }
  }
}

onMounted(() => {
  console.log('props.initialModel', props.initialModel)
  setFieldsRules()
  setInitialModel({
    ...defaultValues.value,
    ...props.initialModel,
  })
  overrideEditingProps()
})

const setModelValue = (fieldName: string, value: any) => {
  model[fieldName] = value
  handleValidation()
}

const getModelValue = (fieldName: string) => {
  return model[fieldName]
}

const getAllModel = () => {
  return model
}

defineExpose<{
  getModelValue: (fieldName: string) => any
  setModelValue: (fieldName: string, value: any) => void
  setFieldsRules: () => any
  getAllModel: () => any
}>({
  getModelValue,
  setModelValue,
  setFieldsRules,
  getAllModel,
})
</script>

<template>
  <div class="w-full">
    <div v-for="(group, index) in groups" :key="index" :class="gridClass">
      <div
        v-if="group.if ? !!model[group.if] : true"
        class="col-span-8 flex gap-4 items-center py-3"
      >
        <span class="text-base font-semibold text-gray-700">
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
          class="col-span-6"
          :class="[
            !field.class?.includes('sm:col-span')
              ? 'sm:col-span-3'
              : field.class,
            !field.class?.includes('lg:col-span')
              ? 'lg:col-span-3'
              : field.class,
            !field.class?.includes('xl:col-span')
              ? 'xl:col-span-2'
              : field.class,
          ]"
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
    </div>

    <div class="p-5 bg-white shadow-md h-24 rounded-br-md rounded-bl-md">
      <hr class="pb-5" />
      <div class="flex items-center justify-end">
        <div>
          <DBtn
            v-if="!hideCancelButton"
            type="button"
            class="font-semibold py-1 text-base mr-3"
            color="secondary"
            @click="emit('cancel')"
          >
            {{ getData ? 'Volver' : 'Cancelar' }}
          </DBtn>

          <slot name="save-btn" v-bind:onHandleSubmit="onHandleSubmit">
            <DBtn
              v-if="!getData && !readonly && !hideSubmitButton"
              class="font-semibold py-1 text-base"
              @click.prevent="onHandleSubmit"
            >
              {{ titleBtnSave }}
            </DBtn>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>
