<script setup lang="ts">
import {
  DTextAreaField,
  DTextField,
  DSelectFieldSearch,
  DMultiselect,
  DToggleField,
  DSubtitle,
} from '@components/basic'
import DFileAttachment from '@components/attachments/DFileAttachment.vue'
import IMCField from '@components/medical/IMCField.vue'
import MultiSelectSearch from '@components/basic/MultiSelectSearch.vue'
import JsonEditorVue from 'json-editor-vue'
import Audiogram from '@components/audiogram/Audiogram.vue'
import DynamicFormEditor from '@components/dynamic-form-editor/DynamicFormEditor.vue'
import {
  getSelectData,
  TableDataQuery,
  SelectOption,
} from '../../../core/services/get-table/index'
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps({
  count: { type: Number, required: false, default: () => 0 },
  field: { type: Object, required: true, default: () => {} },
  modelValue: {
    type: [String, Boolean, Number, Array],
  },
  error: { type: String, required: false, default: () => '' },
  allModel: { type: Object, required: true, default: () => {} },
  query: {
    type: Object,
    required: false,
    default: () => {},
  },
  readonly: { type: Boolean, required: false, default: false },
  dependsOn: {
    type: Object,
    required: false,
    default: () => null,
  },
})

const emit = defineEmits(['update:modelValue', 'update:file'])
const components = new Map<string, any>([
  ['text', { component: DTextField, defaultProps: { type: 'string' } }],
  ['number', { component: DTextField, defaultProps: { type: 'number' } }],
  ['check', { component: DToggleField, defaultProps: {} }],
  ['date', { component: DTextField, defaultProps: { type: 'date' } }],
  ['select', { component: DSelectFieldSearch, defaultProps: {} }],
  ['multiselect', { component: DMultiselect, defaultProps: {} }],
  ['textarea', { component: DTextAreaField, defaultProps: {} }],
  ['file', { component: DFileAttachment, defaultProps: {} }],
  ['json', { component: JsonEditorVue, defaultProps: {} }],
  ['subtitle', { component: DSubtitle, defaultProps: {} }],
  ['imc', { component: IMCField, defaultProps: {} }],
  ['multiselect_search', { component: MultiSelectSearch, defaultProps: {} }],
  ['audiogram', { component: Audiogram, defaultProps: {} }],
  ['form-editor', { component: DynamicFormEditor, defaultProps: {} }],
])

const isLoading = ref(false)
const options = ref<SelectOption[]>([])
const selectSearchText = ref('')

const optionsFiltered = computed<SelectOption[]>(() =>
  options.value.filter(
    (item) =>
      item.name
        .toLowerCase()
        .indexOf(selectSearchText.value.toString().toLowerCase()) > -1
  )
)

const updateOptions = async (val: any = {}) => {
  if (
    ['text', 'select', 'multiselect', 'multiselect_search'].includes(
      props.field.type
    ) &&
    props.field.props?.options
  ) {
    options.value = props.field.props.options
    return
  }

  if (!props.query || props.field.type === 'table') return
  isLoading.value = true
  const params = new Map<string, string>()
  if (val.name && val.value) {
    params.set(val.name, val.value)
  }
  options.value = await getSelectData<SelectOption[]>(
    props.query as TableDataQuery,
    params,
    props.modelValue as string
    // val.operator
  )
  isLoading.value = false
}

const registerDependsOn = () => {
  if (!props.dependsOn) return

  const dependsOn = props.dependsOn

  watch(
    () => props.allModel[dependsOn.field as string],
    (newVal: string) => {
      if (!newVal) return

      updateOptions({
        name: dependsOn.filterTag ?? dependsOn.field,
        value: newVal,
        operator: dependsOn.operator,
      }).catch(console.error)
    },
    { deep: true }
  )
}

const emitUpdate = (val: any) => {
  if (typeof val === 'string') val = val.trim()
  emit('update:modelValue', val)
}

onMounted(async () => {
  if (!props.dependsOn) {
    await updateOptions()
  }
  registerDependsOn()
})
</script>
<template>
  <component
    :label="field.label"
    v-if="field['if'] ? !!allModel[field?.['if']] : true"
    :is="components.get(field.type)?.component ?? field.type"
    :model-value="modelValue"
    :field="field"
    @update:modelValue="emitUpdate"
    :all-model="allModel"
    :class="field.class"
    :error="error"
    :readonly="readonly"
    :header-title="field.label"
    v-bind="{
      ...(components.get(field.type)?.defaultProps ?? {}),
      ...field.props,
      disabled: readonly ? readonly : field?.props?.disabled ?? false,
    }"
    @filter="selectSearchText = $event"
    :options="optionsFiltered"
    @file="$emit('update:file', $event)"
  />
</template>
