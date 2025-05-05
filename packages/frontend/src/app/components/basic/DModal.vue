<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DBtn from './DBtn.vue'
import { AnnotationQuestionIcon } from './icons'

const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    typeAlert?: 'question' | 'success' | 'error' | ''
    open?: boolean
    acceptQuestion?: string
    nameButtonClose?: string
    time?: number
    size?: string
    form?: boolean
  }>(),
  {
    title: '',
    description: '',
    typeAlert: '',
    open: false,
    acceptQuestion: 'Si, continuar',
    nameButtonClose: 'Cerrar',
    time: 0,
    size: 'w-full md:w-2/3 2xl:w-1/3',
    form: false,
  }
)

const emit = defineEmits(['closeModal', 'otherMethod'])

const percent = ref(100)

const onClose = () => {
  emit('closeModal')
}

const counter = () => {
  const total = props.time / 10
  let actual = total
  const interval = setInterval(() => {
    actual -= 1
    percent.value = (100 * actual) / total
    if (percent.value <= 0) {
      clearInterval(interval)
      onClose()
    }
  }, 10)
}

onMounted(() => {
  if (props.time > 0) {
    counter()
  }
})
</script>

<template>
  <div
    class="fixed z-40 inset-0 overflow-hidden bg-gray-500 bg-opacity-75 transition-opacity"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
    v-show="open"
  >
    <div
      class="w-screen h-full flex pt-10 justify-start flex-col items-center relative align-bottom rounded-lg overflow-hidden shadow-2xl transform transition-all px-3"
    >
      <div
        class="card overflow-hidden rounded-lg bg-white relative"
        :class="size"
      >
        <div class="content-modal flex flex-col items-center py-6 px-4">
          <template v-if="!form">
            <!------Logo----->
            <div
              class="flex items-center justify-center rounded-full sm:mx-0 h-14 w-14"
              :class="[
                {
                  'bg-gray-50 ': typeAlert === 'question',
                  hidden: typeAlert === '',
                },
              ]"
            >
              <AnnotationQuestionIcon
                v-if="typeAlert === 'question'"
                class="h-10 w-10 text-yellow-300"
              />
            </div>
            <!----Content------>
            <div class="flex flex-col pt-6 gap-3 items-center">
              <h3
                class="text-2xl text-center leading-6 font-medium text-gray-900"
                v-if="title"
              >
                {{ title }}
              </h3>
              <slot name="title"></slot>
              <p
                class="text-center text-medium text-gray-500"
                v-if="description"
              >
                {{ description }}
              </p>
              <div class="text-center max-h-full overflow-y-auto">
                <slot name="description"></slot>
              </div>
            </div>
          </template>
          <slot name="form"></slot>
        </div>
        <div>
          <slot name="actions">
            <footer
              v-if="typeAlert != 'question' && !form"
              class="sticky inset-x-0 bottom-0 bg-gray-100 w-full flex justify-center items-center sm:justify-end h-16"
            >
              <div
                class="absolute top-0 w-full bg-gray-300 h-1"
                v-if="time > 0"
              >
                <div
                  class="h-1"
                  :style="{ width: `${percent}%` }"
                  :class="'bg-blue-500'"
                ></div>
              </div>
              <div>
                <DBtn
                  type="button"
                  color="secondary"
                  class="mx-5"
                  @click="$emit('closeModal')"
                >
                  {{ nameButtonClose }}
                </DBtn>
              </div>
            </footer>
            <footer
              v-if="typeAlert == 'question' || form"
              class="sticky inset-x-0 bottom-0 bg-gray-100 w-full flex items-center pt-5 pb-5 h-17"
              :class="[form ? 'justify-end' : 'justify-center']"
            >
              <div>
                <DBtn
                  type="button"
                  color="secondary"
                  class="py-2 px-8 mx-2"
                  @click="$emit('closeModal')"
                >
                  Cancelar
                </DBtn>
              </div>
              <div>
                <DBtn
                  type="button"
                  :color="form ? '' : 'danger'"
                  class="py-2 px-8 mx-2"
                  @click="$emit('otherMethod')"
                >
                  {{ acceptQuestion }}
                </DBtn>
              </div>
            </footer>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>
