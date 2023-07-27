import { App } from "vue";
import Login from "@/app/layouts/Login.vue";
import Home from "@/app/layouts/Home.vue";

import {
  Home03Icon,
  Tool02Icon,
  Users01Icon,
  CalculatorIcon,
  File07Icon,
  Shield02Icon,
  PackageIcon,
  SearchLgIcon,
  PlusIcon,
  Mail01Icon,
  User01Icon,
} from "@components/basic/icons";

export function registerGlobalComponents(app: App) {
  app.component("LoginLayout", Login).component("HomeLayout", Home);
  app.component("Home03Icon", Home03Icon);
  app.component("Tool02Icon", Tool02Icon);
  app.component("Users01Icon", Users01Icon);
  app.component("CalculatorIcon", CalculatorIcon);
  app.component("File07Icon", File07Icon);
  app.component("Shield02Icon", Shield02Icon);
  app.component("PackageIcon", PackageIcon);
  app.component("SearchLgIcon", SearchLgIcon);
  app.component("PlusIcon", PlusIcon);
  app.component("Mail01Icon", Mail01Icon);
  app.component("User01Icon", User01Icon);
}
