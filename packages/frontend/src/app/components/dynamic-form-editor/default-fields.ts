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
        { id: '1', name: 'Opción 1' },
        { id: '2', name: 'Opción 2' },
        { id: '3', name: 'Opción 3' },
      ],
    },
    rules: [],
  },
  {
    name: 'simple_multiselect_field',
    label: 'Simple multiselect field',
    type: 'simple_multiselect',
    default: ['Opción 1'],
    props: {
      required: true,
      placeholder: 'Placeholder de ejemplo',
      options: [
        {
          id: 'Opción 1',
          name: 'Opción 1',
        },
        {
          id: 'Opción 2',
          name: 'Opción 2',
        },
        {
          id: 'Opción 3',
          name: 'Opción 3',
        },
      ],
    },
    rules: ['required-array'],
  },
  {
    name: 'multiselect_field',
    label: 'Multiselect field',
    type: 'multiselect',
    props: {
      placeholder: '',
      class: 'col-span-2',
      options: [
        { id: '1', name: 'Opción 1' },
        { id: '2', name: 'Opción 2' },
        { id: '3', name: 'Opción 3' },
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
      accept: 'application/pdf',
      size: 5, // MB
    },
    rules: [],
  },
  {
    name: 'subtitle_field',

    type: 'subtitle',
    props: {
      text: 'Subtitle Text',
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
        { id: '1', name: 'Opción 1' },
        { id: '2', name: 'Opción 2' },
        { id: '3', name: 'Opción 3' },
      ],
    },
    rules: [],
  },
  {
    name: 'audiogram_field',
    label: 'EXAMEN DE AUDIOMETRIA',
    type: 'audiogram',
    props: {
      placeholder: 'Placeholder de ejemplo',
      class: 'col-span-6',
    },
    rules: [],
  },
]
