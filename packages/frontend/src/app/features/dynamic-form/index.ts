import Form from "./Form.vue";

export { default as DynamicForm } from "./component/DynamicForm.vue";
export * from "./types";

export const dynamicRoutes = [
  {
    path: "/form",
    name: "DynamicForm",
    component: Form,
    meta: {
      auth: false,
      layout: "public",
    },
  },
];
