<script lang="ts" setup>
import { ref, watch } from "vue";
import {
  Pin01Icon,
  Pin02Icon,
  LifeBuoy01Icon,
  Settings01Icon,
  User03Icon,
  ChevronDownIcon,
  LogOut03Icon,
} from "@components/basic/icons";
import DIcon from "@components/basic/DIcon.vue";

import Popper from "vue3-popper";

type MenuItem = {
  name: string;
  icon?: string;
  route?: string;
  idMenu?: string;
  children?: MenuItem[];
  showItems?: boolean;
};

type user = {
  role: any;
  roleCode: any;
  name: any;
  photoUrl: any;
  email: any;
};

const props = defineProps<{
  menu?: MenuItem[];
  user?: user;
}>();

const emit = defineEmits([
  "change:route",
  "change:role",
  "support",
  "config",
  "logout",
]);

const isPinUp = ref(false); // false
const subMenuItems = ref<MenuItem[]>([]);
const activeRoute = ref("");
const activeMenu = ref("");

/**
 * Marcar sidebar como fijo o no fijo
 */
const pinUp = () => {
  isPinUp.value === false ? (isPinUp.value = true) : (isPinUp.value = false);
};

/**
 * Ocultar sidebar
 */
const onCloseSidebar = () => {
  if (isPinUp.value) {
    document.getElementById("nav-secondary")!.style.marginLeft = "0";
  } else {
    if (window.innerWidth <= 639) {
      document.getElementById("nav-secondary")!.style.marginLeft = "-224px";
    } else {
      document.getElementById("nav-secondary")!.style.marginLeft = "-288px";
    }
  }
};

/**
 * Mostrar sidebar
 */
const openSidebar = (items?: MenuItem[], menuItem?: any) => {
  activeMenu.value = menuItem.name;
  if (!items) {
    if (menuItem.route) changeRoute(menuItem.route);
    onCloseSidebar();
    return;
  }
  const childrens = document.querySelectorAll(".showItems");
  const showChildrens = document.querySelectorAll(".rotateArrow");
  for (let x = 0; x < childrens.length; x++) {
    for (let y = 0; y < showChildrens.length; y++) {
      if (
        showChildrens[y].attributes[2].value ===
        childrens[x].attributes[2].value
      ) {
        childrens[x].attributes[3].value =
          "height: " + childrens[x].children.length * 48 + "px";
        break;
      } else {
        childrens[x].attributes[3].value = "height: 0px;";
      }
    }
  }

  document.getElementById("nav-secondary")!.style.marginLeft = "0";
  subMenuItems.value = items;
};

/**
 * Mostrar submenus del sidebar
 */
const showChildren = (id: any, arrow: any, childrens: any) => {
  const children = document.getElementById(id);
  const arrowMenu = document.getElementById(arrow);
  if (children!.style.height === "0px") {
    children!.style.height = childrens * 48 + "px";
    arrowMenu!.classList.add("rotateArrow");
  } else {
    arrowMenu!.classList.remove("rotateArrow");
    children!.style.height = "0px";
  }
};

/**
 * Cambiar de ruta al seleccionar una opción del sidebar
 */
const changeRoute = (route?: string) => {
  if (!route) return;
  activeRoute.value = route;
  emit("change:route", route);
};

/**
 * Capturar cuando el menú cambia por cambio de rol
 * para ocultar todos los hijos del menú
 */
watch(
  () => props.menu,
  () => {
    const hideItems = document.querySelectorAll(".showItems");
    const rotateArrows = document.querySelectorAll(".rotateArrow");
    for (let i = 0; i < hideItems.length; i++) {
      hideItems[i].attributes[3].value = "height: 0px;";
    }
    rotateArrows.forEach((arrow) => {
      arrow.classList.remove("rotateArrow");
    });
  }
);

const emitRole = () => {
  emit("change:role");
};

const emitSupport = () => {
  emit("support");
};

const emitConfig = () => {
  emit("config");
};

const emitLogout = () => {
  emit("logout");
};
</script>

<template>
  <div
    class="flex h-screen shadow-md shadow-gray-700 z-10"
    @focusout="onCloseSidebar"
    tabindex="0"
  >
    <!-- NAV VISIBLE -->
    <div
      class="nav-main flex flex-col items-center h-screen w-16 sm:w-20 bg-blue-600 z-20"
    >
      <div
        class="nav-main-logo mt-4 relative flex justify-center items-center p-4 select-none"
      >
        <img
          @click="changeRoute('/home')"
          src="../../assets/logo.svg"
          class="text-white w-12 cursor-pointer"
          alt="Logo"
        />
      </div>
      <div
        class="nav-main-menu overflow-x-hidden overflow-y-auto h-full scroll-sidebar"
      >
        <ul>
          <li
            v-for="(menuItem, i) of menu"
            :key="i"
            class="flex mt-2 flex-col justify-center w-12 h-12 items-center rounded-md cursor-pointer"
            :class="[
              activeMenu === menuItem.name
                ? 'bg-white text-blue-800'
                : 'text-white',
            ]"
            @click="openSidebar(menuItem.children, menuItem)"
          >
            <Popper
              arrow
              offsetDistance="18"
              :content="menuItem.name"
              :hover="true"
              placement="left"
              class="tooltip"
            >
              <DIcon
                v-if="menuItem.icon"
                :name="menuItem.icon"
                class="h-6 w-6"
              />
            </Popper>
          </li>
        </ul>
      </div>
      <div
        class="nav-main-footer relative mt-auto flex flex-col items-center justify-around px-2 mb-3 select-none"
      >
        <div>
          <div
            @click="emitSupport"
            class="flex flex-col justify-center items-center rounded-md hover:bg-blue-500 text-blue-300 hover:text-lime-50 w-12 h-12 cursor-pointer"
          >
            <Popper
              offsetDistance="18"
              arrow
              content="Soporte"
              :hover="true"
              placement="right"
              class="tooltip"
            >
              <LifeBuoy01Icon class="w-7 h-7" />
            </Popper>
          </div>
          <div
            @click="emitConfig"
            class="flex flex-col justify-center items-center mt-1 rounded-md hover:bg-blue-500 text-blue-300 hover:text-lime-50 w-12 h-12 cursor-pointer"
          >
            <Popper
              offsetDistance="18"
              arrow
              content="Actualizar&nbsp;información"
              :hover="true"
              placement="right"
              class="tooltip"
            >
              <Settings01Icon class="w-7 h-7" />
            </Popper>
          </div>
        </div>
        <hr class="border-blue-200 w-full my-5" />
        <div
          class="bg-white rounded-full select-none mb-4 mt-2 overflow-hidden cursor-pointer"
          @click="openSidebar([], '')"
        >
          <User03Icon class="w-12 h-12 text-gray-300"></User03Icon>
        </div>
      </div>
    </div>
    <!-- NAV INVISIBLE -->
    <div
      class="nav-secondary h-screen flex flex-col w-56 sm:w-72 bg-white p-4 z-10"
      id="nav-secondary"
    >
      <div class="nav-secondary-open relative flex justify-end">
        <span class="mt-4 mb-5">
          <Pin01Icon
            v-if="isPinUp"
            @click="pinUp"
            class="w-5 text-blue-700 cursor-pointer"
          />
          <Pin02Icon
            v-else
            @click="pinUp"
            class="w-5 text-gray-300 cursor-pointer"
          />
        </span>
      </div>
      <div
        class="nav-secondary-menu flex flex-col overflow-hidden overflow-y-auto scroll pr-2"
        style="margin-right: -8px"
      >
        <template v-for="(menuItem, j) of menu" :key="j">
          <ul
            :style="
              activeMenu === menuItem.name ? 'display: block' : 'display: none'
            "
          >
            <li
              class="mt-1"
              v-for="(subMenu, index) of menuItem.children"
              :key="index"
            >
              <div
                :data-id="`children${subMenu.idMenu}${index}`"
                @click="
                  subMenu.children
                    ? showChildren(
                        `children${subMenu.idMenu}${index}`,
                        `arrow-menu${subMenu.idMenu}${index}`,
                        subMenuItems[index].children?.length
                      )
                    : changeRoute(subMenu.route)
                "
                class="rounded-md cursor-pointer"
                :class="[
                  subMenu.route === activeRoute ? 'bg-blue-600' : 'bg-gray-50',
                  subMenu.route === activeRoute
                    ? 'text-white'
                    : 'text-blue-700',
                ]"
              >
                <div
                  class="flex h-11 justify-between items-center tracking-wider font-bold px-2 border border-transparent hover:border-blue-700 rounded-md"
                >
                  <span class="select-none truncate">{{ subMenu.name }}</span>
                  <div class="flex">
                    <ChevronDownIcon
                      v-if="subMenu.children"
                      class="arrow-menu w-5"
                      :id="`arrow-menu${subMenu.idMenu}${index}`"
                      :data-id="`children${subMenu.idMenu}${index}`"
                    />
                  </div>
                </div>
              </div>
              <!-- LISTA DE OPCIONES DE MENU -->
              <ul
                class="showItems"
                :id="`children${subMenu.idMenu}${index}`"
                style="height: 0px"
              >
                <li
                  class="mt-1"
                  @click="changeRoute(thirdMenu.route)"
                  v-for="(thirdMenu, index) of subMenu?.children"
                  :key="index"
                >
                  <div
                    class="h-11 flex items-center rounded-md border border-transparent hover:border-blue-600 font-medium cursor-pointer"
                    :title="thirdMenu.name"
                    :class="[
                      thirdMenu.route === activeRoute
                        ? 'bg-blue-600'
                        : 'bg-gray-50',
                      thirdMenu.route === activeRoute
                        ? 'text-white'
                        : 'text-blue-700',
                    ]"
                  >
                    <p class="ml-8 mr-8 select-none truncate ...">
                      {{ thirdMenu.name }}
                    </p>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </template>
      </div>
      <div
        class="nav-secondary-footer relative mt-auto pt-5 pb-2 flex flex-row items-end justify-between"
      >
        <div>
          <Popper
            arrow
            content="Cambiar rol"
            :hover="true"
            placement="right"
            class="tooltip"
          >
            <p
              @click="emitRole"
              class="select-none font-medium text-base hover:underline hover:text-blue-700 cursor-pointer"
            >
              {{ user?.role }}
            </p>
          </Popper>
          <p
            class="select-none text-blue-700 font-semibold text-ellipsis whitespace-nowrap overflow-hidden w-44 sm:w-52"
          >
            {{ user?.name }}
          </p>
          <p
            class="select-none text-gray-500 text-ellipsis whitespace-nowrap overflow-hidden w-44 sm:w-52"
          >
            {{ user?.email }}
          </p>
        </div>
        <Popper
          arrow
          content="Cerrar Sesión"
          :hover="true"
          placement="right"
          class="tooltip"
        >
          <LogOut03Icon
            class="w-6 mb-0.5 text-blue-600 self-end cursor-pointer"
            @click="emitLogout"
          />
        </Popper>
      </div>
    </div>
  </div>
</template>
<style scoped>
#nav-secondary {
  margin-left: -288px;
  -webkit-transition: margin 0.8s;
  transition: margin 0.8s;
}
@media (max-width: 639px) {
  #nav-secondary {
    margin-left: -224px;
  }
}
.showItems {
  overflow: hidden;
  cursor: pointer;
  transition: height 0.3s linear 0s;
}
.arrow-menu {
  display: block;
  transition: all 0.4s ease;
}
.arrow-menu.rotateArrow {
  transform: rotate(180deg);
}
</style>
