<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { Tab } from './types'
import { DTextContentEditable } from '../basic'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Trash01Icon,
  Copy01Icon,
  PlusIcon,
  Code01Icon,
} from '@/app/components/basic/icons'
import Popper from 'vue3-popper'
import { deepClone } from '@/app/core/util/objects'
import FieldEditor from './FieldEditor.vue'
import DBtn from '@components/basic/DBtn.vue'
import { defaultFields } from './default-fields'

const props = withDefaults(
  defineProps<{
    modelValue: string
    label: string
    required: boolean
    error: string
  }>(),
  {
    label: '',
    required: false,
    error: '',
  }
)
const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const formSchema = reactive<Tab>({
  groups: [],
})

const codeMode = ref(false)

const textSchema = ref('')

watch(
  () => formSchema,
  () => {
    updateModel(JSON.stringify(formSchema, null, 2))
  },
  { deep: true }
)

watch(
  () => props.modelValue,
  () => {
    loadModel(props.modelValue)
  }
)

watch(
  () => textSchema.value,
  () => {
    loadModel(textSchema.value)
  }
)

const updateModel = (value: string) => {
  emit('update:modelValue', value)
}

const errorMessage = ref('')
const loadModel = (textSchema: string) => {
  try {
    formSchema.groups = JSON.parse(textSchema).groups
    errorMessage.value = ''
  } catch (error) {
    console.error('Error loading model', error)
    errorMessage.value = 'Formulario no válido!'
  }
}
onMounted(() => {
  loadModel(props.modelValue)
})

// ui actions

const changeMode = () => {
  if (codeMode.value) {
    codeMode.value = false
    return
  }

  textSchema.value = JSON.stringify(formSchema, null, 2)
  codeMode.value = true
}

const validateSchema = () => {
  try {
    JSON.parse(textSchema.value)
    errorMessage.value = ''
  } catch (error: any) {
    errorMessage.value = error.message
  }
}

const saveChanges = () => {
  loadModel(textSchema.value)
  textSchema.value = ''
  errorMessage.value = ''

  codeMode.value = false
}

// group actions
const addGroup = () => {
  formSchema.groups.push({
    name: 'Titulo',
    description: 'Descripción',
    fields: [],
  })
  if (codeMode.value) {
    textSchema.value = JSON.stringify(formSchema, null, 2)
  }
}

const duplicateGroup = (index: number) => {
  const newGroup = deepClone(formSchema.groups[index])
  // change fields id
  newGroup.fields = newGroup.fields.map((field) => {
    field.id = Math.random().toString(36).substring(7)
    return field
  })
  formSchema.groups.push(newGroup)
}

const moveGroup = (index: number, direction: 'up' | 'down') => {
  const newIndex = direction === 'up' ? index - 1 : index + 1
  const temp = formSchema.groups[index]
  formSchema.groups[index] = formSchema.groups[newIndex]
  formSchema.groups[newIndex] = temp
}

const deleteGroup = (index: number) => {
  formSchema.groups.splice(index, 1)
}

// field actions
const fieldTypes = defaultFields.map((f) => f.type)
const newFieldType = ref('text')

const addField = (groupIndex: number) => {
  const field = defaultFields.find((f) => f.type === newFieldType.value)
  if (!field) return

  formSchema.groups[groupIndex].fields.push({
    ...field,
    name: `field_${Math.random().toString(36).substring(7)}`,
  })
}

// Drag and drop
const startDrag = (
  evt: any,
  originGroupIndex: number,
  originFieldIndex: number
) => {
  evt.dataTransfer.dropEffect = 'move'
  evt.dataTransfer.effectAllowed = 'move'
  evt.dataTransfer.setData('groupIndex', originGroupIndex)
  evt.dataTransfer.setData('fieldIndex', originFieldIndex)
}

const onDrop = (evt: any, newGroupIndex: number, newFieldIndex: number) => {
  const originGroupIndex = evt.dataTransfer.getData('groupIndex')
  const originFieldIndex = evt.dataTransfer.getData('fieldIndex')

  if (!originGroupIndex || !originFieldIndex) return

  if (
    newGroupIndex === parseInt(originGroupIndex) &&
    newFieldIndex === parseInt(originFieldIndex)
  ) {
    return
  }

  const originGroup = formSchema.groups[parseInt(originGroupIndex)]

  const draggedField = originGroup.fields.splice(parseInt(originFieldIndex), 1)
  if (draggedField) {
    formSchema.groups[newGroupIndex].fields.splice(
      newFieldIndex,
      0,
      draggedField[0]
    )
  }
}
</script>
<template>
  <div class="w-full flex flex-col bg-gray-50">
    <div class="w-full flex justify-between bg-white">
      <span class="block text-sm font-medium text-gray-800 mb-1.5" v-if="label">
        {{ label }} <span v-if="required" class="text-red-500">*</span>
      </span>

      <div class="flex gap-2">
        <Popper
          arrow
          offsetDistance="12"
          content="Modo codigo "
          :hover="true"
          placement="top"
          class="tooltip"
        >
          <div
            class="rounded-md py-2"
            :class="codeMode ? 'bg-green-200' : 'bg-gray-50'"
            @click="changeMode"
          >
            <Code01Icon class="h-6 w-6 mx-2 cursor-pointer text-gray-600" />
          </div>
        </Popper>

        <Popper
          arrow
          offsetDistance="12"
          content="Agregar grupo"
          :hover="true"
          placement="top"
          class="tooltip"
        >
          <div class="bg-gray-50 rounded-md py-2" @click="addGroup">
            <PlusIcon class="h-6 w-6 mx-2 cursor-pointer text-gray-600" />
          </div>
        </Popper>
      </div>
    </div>
    <div v-if="codeMode">
      <textarea
        v-model="textSchema"
        class="w-full h-96 p-5 bg-white border border-dashed rounded-xl shadow-xl"
        @input="validateSchema"
      ></textarea>
      <DBtn
        class="w-full"
        @click="saveChanges"
        :disabled="!!errorMessage"
        :class="[
          errorMessage
            ? 'bg-red-500 text-white hover:bg-red-700 focus:ring-red-500 cursor-pointer'
            : 'bg-green-500 text-white hover:bg-green-700 focus:ring-green-500 cursor-pointer',
        ]"
      >
        Guardar edición
      </DBtn>
    </div>
    <!-- Grupos -->
    <div
      v-else
      v-for="(group, groupIndex) in formSchema.groups"
      class="w-auto m-5 flex flex-col border border-dashed rounded-xl"
    >
      <!-- group header -->
      <div
        class="w-full flex justify-between bg-white shadow-lg rounded-xl p-2"
      >
        <div class="flex flex-1 justify-start">
          <div>
            <DTextContentEditable
              v-model="group.name"
              class="w-40 text-base font-semibold text-gray-700"
            />
            <DTextContentEditable
              v-model="group.description"
              class="ml-5 text-xs font-light text-gray-400"
            />
          </div>
        </div>
        <div class="flex gap-2">
          <Popper
            arrow
            offsetDistance="12"
            content="Duplicar"
            :hover="true"
            placement="top"
            class="tooltip"
          >
            <div
              class="bg-gray-50 rounded-md py-2"
              @click="duplicateGroup(groupIndex)"
            >
              <Copy01Icon class="h-4 w-4 mx-2 cursor-pointer text-gray-600" />
            </div>
          </Popper>
          <Popper
            v-if="groupIndex > 0"
            arrow
            offsetDistance="12"
            content="Subir"
            :hover="true"
            placement="top"
            class="tooltip"
          >
            <div
              class="bg-gray-50 rounded-md py-2"
              @click="moveGroup(groupIndex, 'up')"
            >
              <ChevronUpIcon
                class="h-4 w-4 mx-2 cursor-pointer text-gray-600"
              />
            </div>
          </Popper>
          <Popper
            v-if="groupIndex < formSchema.groups.length - 1"
            arrow
            offsetDistance="12"
            content="Bajar"
            :hover="true"
            placement="top"
            class="tooltip"
          >
            <div
              class="bg-gray-50 rounded-md py-2"
              @click="moveGroup(groupIndex, 'down')"
            >
              <ChevronDownIcon
                class="h-4 w-4 mx-2 cursor-pointer text-gray-600"
              />
            </div>
          </Popper>
          <Popper
            arrow
            offsetDistance="12"
            content="Eliminar Grupo"
            :hover="true"
            placement="top"
            class="tooltip"
          >
            <div
              class="bg-gray-50 rounded-md py-2"
              @click="deleteGroup(groupIndex)"
            >
              <Trash01Icon class="h-4 w-4 mx-2 cursor-pointer text-gray-600" />
            </div>
          </Popper>
        </div>
      </div>
      <!-- group fields -->
      <div class="w-full grid grid-cols-6 px-6 py-4 gap-3">
        <div
          v-for="(field, fieldIndex) in group.fields"
          class="p-3 flex flex-col justify-between relative bg-white rounded-xl shadow-sm cursor-pointer hover:shadow-lg"
          :class="field.props.class"
          draggable="true"
          @dragstart="startDrag($event, groupIndex, fieldIndex)"
          @drop="onDrop($event, groupIndex, fieldIndex)"
          @dragover.prevent
          @dragenter.prevent
        >
          <span class="absolute -top-3 left-0 text-gray-500">
            {{ field.type }}
          </span>

          {{ field.label }}

          <FieldEditor
            v-model="group.fields[fieldIndex]"
            class="absolute -top-3 right-0"
          />
        </div>
        <div
          class="col-span-2 border border-dashed p-3 flex justify-center text-gray-500 rounded-lg cursor-pointer hover:scale-105 hover:bg-gray-100"
          @drop="onDrop($event, groupIndex, group.fields.length)"
          @dragover.prevent
          @dragenter.prevent
        >
          <select name="type" class="w-full" v-model="newFieldType">
            <option v-for="type in fieldTypes" :value="type">{{ type }}</option>
          </select>

          <Popper
            arrow
            offsetDistance="12"
            content="Agregar campo"
            :hover="true"
            placement="top"
            class="tooltip"
          >
            <div
              class="bg-gray-50 rounded-md py-2"
              @click="addField(groupIndex)"
            >
              <PlusIcon class="h-6 w-6 mx-2 cursor-pointer text-gray-600" />
            </div>
          </Popper>
        </div>
      </div>
    </div>
    <span class="text-red-500">
      {{ errorMessage }}
    </span>
  </div>
</template>
