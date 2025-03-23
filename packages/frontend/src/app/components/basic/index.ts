import { defineAsyncComponent } from 'vue'
// icons
// export * from './icons/icons'

// export * from './icons/countries/countries'

// files icons

export const XlsxIcon = defineAsyncComponent(
  () => import('./files/XlsxIcon.vue')
)
export const JsonIcon = defineAsyncComponent(
  () => import('./files/JsonIcon.vue')
)

// table
export const DPagination = defineAsyncComponent(
  () => import('./table/DPagination.vue')
)
export const DTable = defineAsyncComponent(() => import('./table/DTable.vue'))
export const DTablePendingProcesses = defineAsyncComponent(
  () => import('./table/DTablePendingProcesses.vue')
)

// tab

export const DTab = defineAsyncComponent(() => import('./tab/DTab.vue'))
export const DTabs = defineAsyncComponent(() => import('./tab/DTabs.vue'))

// fields and buttons
export const DBtn = defineAsyncComponent(() => import('./DBtn.vue'))
export const DCard = defineAsyncComponent(() => import('./DCard.vue'))
export const DDropdown = defineAsyncComponent(() => import('./DDropdown.vue'))
export const DFileUploader = defineAsyncComponent(
  () => import('./DFileUploader.vue')
)
export const DIcon = defineAsyncComponent(() => import('./DIcon.vue'))
export const DInfo = defineAsyncComponent(() => import('./DInfo.vue'))
export const DList = defineAsyncComponent(() => import('./DList.vue'))
export const DLoading = defineAsyncComponent(() => import('./DLoading.vue'))
export const DModal = defineAsyncComponent(() => import('./DModal.vue'))
export const DMultiselect = defineAsyncComponent(
  () => import('./DMultiselect.vue')
)
export const DSelectField = defineAsyncComponent(
  () => import('./DSelectField.vue')
)
export const DSelectFieldSearch = defineAsyncComponent(
  () => import('./DSelectFieldSearch.vue')
)
export const DTextAreaField = defineAsyncComponent(
  () => import('./DTextAreaField.vue')
)
// export const DTextField = () => import('./DTextField.vue')
// export { default as DTextField } from './DTextField.vue'
export const DTextField = defineAsyncComponent(() => import('./DTextField.vue'))

export const DToggleField = defineAsyncComponent(
  () => import('./DToggleField.vue')
)

export const DTextContentEditable = defineAsyncComponent(
  () => import('./DTextContentEditable.vue')
)
// form
export const DSubtitle = defineAsyncComponent(() => import('./DSubtitle.vue'))

export const DAlertText = defineAsyncComponent(() => import('./DAlertText.vue'))
