import { TableDataQuery } from '@/app/core/services/get-table/index'

export interface Field {
  id?: string
  name: string
  label?: string
  type:
    | 'text'
    | 'number'
    | 'check'
    | 'date'
    | 'select'
    | 'simple_multiselect'
    | 'multiselect'
    | 'textarea'
    | 'file'
    | 'subtitle'
    | 'imc'
    | 'multiselect_search'
    | 'audiogram'
  props?: any
  if?: string
  editingProps?: any
  rules?: string[]
  query?: TableDataQuery
  default?: string | number | boolean | Array<string>
  dependsOn?: {
    field: string
    filterTag?: string
  }
}

export interface Group {
  name: string
  description: string
  fields: Field[]
}

export interface Tab {
  groups: Group[]
}
