import { TableDataQuery } from "@/app/core/services/get-table/index";

export interface Field {
  name: string;
  label?: string;
  type: string;
  props?: any;
  if?: string;
  editingProps?: any;
  rules?: string[];
  query?: TableDataQuery;
  default?: string | number | boolean | [];
  dependsOn?: {
    field: string;
    filterTag?: string;
  };
}

interface Group {
  name: string;
  description?: string;
  fields: Field[];
}

interface Tab {
  name: string;
  description?: string;
  groups: Group[];
}

export interface Form {
  entity: string;
  tabs: Tab[];
}
