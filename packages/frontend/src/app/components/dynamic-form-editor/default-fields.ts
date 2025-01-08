import { Field } from './types'

export const defaultFields: Field[] = [
  {
    name: 'text_field',
    label: 'Text field',
    type: 'text',
    props: {
      placeholder: '',
      class: 'col-span-2',
    },
    rules: [],
  },
  {
    name: 'number_field',
    label: 'Number field',
    type: 'number',
    props: {
      placeholder: '',
      class: 'col-span-2',
    },
    rules: [],
  },
  {
    name: 'check_field',
    label: 'Check field',
    type: 'check',
    props: {
      placeholder: '',
      class: 'col-span-2',
    },
    rules: [],
  },
  {
    name: 'date_field',
    label: 'Date field',
    type: 'date',
    props: {
      placeholder: '',
      class: 'col-span-2',
    },
    rules: [],
  },
  {
    name: 'select_field',
    label: 'Select field',
    type: 'select',
    props: {
      placeholder: '',
      class: 'col-span-2',
      options: [
        { value: '1', label: 'Opción 1' },
        { value: '2', label: 'Opción 2' },
        { value: '3', label: 'Opción 3' },
      ],
    },
    rules: [],
  },
  {
    name: 'multiselect_field',
    label: 'Multiselect field',
    type: 'multiselect',
    props: {
      placeholder: '',
      class: 'col-span-2',
      options: [
        { value: '1', label: 'Opción 1' },
        { value: '2', label: 'Opción 2' },
        { value: '3', label: 'Opción 3' },
      ],
    },
    rules: [],
  },
  {
    name: 'textarea_field',
    label: 'Textarea field',
    type: 'textarea',
    props: {
      class: 'col-span-6',
      placeholder: '',
    },
    rules: [],
  },
  {
    name: 'file_field',
    label: 'File field',
    type: 'file',
    props: {
      placeholder: '',
      class: 'col-span-6',
    },
    rules: [],
  },
  {
    name: 'subtitle_field',
    label: 'Subtitle field',
    type: 'subtitle',
    props: {
      placeholder: '',
      class: 'col-span-6',
    },
    rules: [],
  },
  {
    name: 'imc_field',
    label: 'IMC field',
    type: 'imc',
    props: {
      placeholder: '',
      class: 'col-span-2',
    },
    rules: [],
  },
  {
    name: 'multiselect_search_field',
    label: 'Multiselect search field',
    type: 'multiselect_search',
    props: {
      placeholder: '',
      class: 'col-span-2',
      options: [
        { value: '1', label: 'Opción 1' },
        { value: '2', label: 'Opción 2' },
        { value: '3', label: 'Opción 3' },
      ],
    },
    rules: [],
  },
]