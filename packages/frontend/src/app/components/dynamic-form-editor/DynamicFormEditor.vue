<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue'
import { Tab } from './types'
import { DTextContentEditable } from '../basic'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Trash01Icon,
  Copy01Icon,
  PlusIcon,
} from '@/app/components/basic/icons'
import Popper from 'vue3-popper'

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

watch(
  () => formSchema,
  () => {
    updateModel(JSON.stringify(formSchema))
  },
  { deep: true }
)

const updateModel = (value: string) => {
  emit('update:modelValue', value)
}

const loadModel = () => {
  try {
    formSchema.groups = JSON.parse(props.modelValue).groups
  } catch (error) {
    console.error('Error loading model', error)
  }
}
onMounted(() => {
  loadModel()
})

// group actions
const addGroup = () => {
  formSchema.groups.push({
    name: 'Titulo',
    description: 'Descripción',
    fields: [],
  })
}

const duplicateGroup = (index: number) => {
  formSchema.groups.push(JSON.parse(JSON.stringify(formSchema.groups[index])))
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

const addField = (groupIndex: number) => {
  formSchema.groups[groupIndex].fields.push({
    id: Math.random().toString(36).substring(7),
    name: `field_${Math.random().toString(36).substring(7)}`,
    label: 'Label del campo',
    type: 'text',
  })
}

// Drag and drop
const startDrag = (
  evt: any,
  item: any,
  originGroupIndex: number,
  originFieldIndex: number
) => {
  evt.dataTransfer.dropEffect = 'move'
  evt.dataTransfer.effectAllowed = 'move'
  evt.dataTransfer.setData('itemID', item.id)
  evt.dataTransfer.setData('groupIndex', originGroupIndex)
  evt.dataTransfer.setData('fieldIndex', originFieldIndex)
}

const onDrop = (evt: any, newGroupIndex: number, newFieldIndex: number) => {
  const itemID = evt.dataTransfer.getData('itemID')
  const originGroupIndex = evt.dataTransfer.getData('groupIndex')
  const originFieldIndex = evt.dataTransfer.getData('fieldIndex')

  if (!itemID || !originGroupIndex || !originFieldIndex) return

  if (
    newGroupIndex === parseInt(originGroupIndex) &&
    newFieldIndex === parseInt(originFieldIndex)
  ) {
    return
  }

  const originGroup = formSchema.groups[parseInt(originGroupIndex)]

  const item = originGroup.fields.find((field) => field.id === itemID)

  if (item) {
    formSchema.groups[newGroupIndex].fields.push(item)
    originGroup.fields = originGroup.fields.filter(
      (field) => field.id !== itemID
    )
  }
}

const dragOver = (evt: any, groupIndex: number, fieldIndex: number) => {
  console.log('dragOver', groupIndex, fieldIndex)
  evt.preventDefault()
}
</script>
<template>
  <div class="w-full flex flex-col bg-gray-50">
    <div class="w-full flex justify-between bg-white">
      <span class="block text-sm font-medium text-gray-800 mb-1.5" v-if="label">
        {{ label }} <span v-if="required" class="text-red-500">*</span>
      </span>

      <div>
        <!-- <Popper
          arrow
          offsetDistance="12"
          content="Copiar formulario (texto)"
          :hover="true"
          placement="top"
          class="tooltip"
        >
          <div class="bg-gray-50 rounded-md py-2">
            <Copy01Icon class="h-6 w-6 mx-2 cursor-pointer text-gray-600" />
          </div>
        </Popper> -->

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
    <!-- Grupos -->
    <div
      v-for="(group, groupIndex) in formSchema.groups"
      class="w-auto m-5 flex flex-col border border-dashed rounded-xl"
    >
      <!-- group header -->
      <div
        class="w-full flex justify-between bg-white shadow-lg rounded-xl p-2"
      >
        <span class="flex flex-col min-w-min">
          <DTextContentEditable
            v-model="group.name"
            class="text-base font-semibold text-gray-700"
          />
          <DTextContentEditable
            v-model="group.description"
            class="text-xs font-light text-gray-400"
          />
        </span>
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
      <div class="w-full grid grid-cols-8 px-6 py-4 gap-3">
        <div
          v-for="(field, fieldIndex) in group.fields"
          class="col-span-2 p-3 bg-white rounded-xl shadow-sm cursor-pointer hover:shadow-lg hover:scale-105"
          draggable="true"
          @dragstart="startDrag($event, field, groupIndex, fieldIndex)"
          @drop="onDrop($event, groupIndex, fieldIndex)"
          @dragover="dragOver($event, groupIndex, fieldIndex)"
          @dragenter.prevent
        >
          <div>
            {{ field.type }} id:
            <DTextContentEditable
              v-model="field.name"
              class="text-sm text-blue-800"
            />
          </div>

          <DTextContentEditable v-model="field.label" />
        </div>
        <div
          class="col-span-1 border border-dashed p-3 flex justify-center text-gray-500 rounded-lg cursor-pointer hover:scale-105 hover:bg-gray-100"
          @click="addField(groupIndex)"
        >
          agregar Campo
        </div>
      </div>
    </div>
    {{ formSchema }}
  </div>
</template>
