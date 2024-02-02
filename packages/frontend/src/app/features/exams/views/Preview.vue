<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DynamicFormWithOutTabs from '../../dynamic-form/component/DynamicFormWithOutTabs.vue'

import { getEntity } from '../services'

const modulePath = 'exams'
const route = useRoute()
const router = useRouter()

let exam = ref<any>({})
const loading = ref(false)

const back = () => {
  console.log('Back')
  router.push({ name: `${modulePath}.list` })
}

onBeforeMount(async () => {
  loading.value = true

  console.log('Mounted', route.params.id)
  if (route.params.id) {
    exam.value = await getEntity(route.params.id as string)
  }
  loading.value = false
})
</script>

<template>
  <div class="h-full px-5 bg-white overflow-auto">
    <div class="bg-gray-50 pb-4">
      <div class="leading-4 pt-responsive">
        <p class="text-3xl font-semibold text-shadow text-blue-900">
          Visualizar {{ exam?.code }} : {{ exam?.name }}
        </p>
      </div>
    </div>
    <DynamicFormWithOutTabs
      v-if="exam?.form"
      ref="dynamicForm"
      :form-schema="JSON.parse(exam?.form ?? '{}')"
      :initial-model="{}"
      gridClass="grid grid-cols-6 px-6 pb-5 w-full"
      :hideSubmitButton="true"
      @cancel="back"
    />
  </div>
</template>
