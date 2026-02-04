<script lang="ts" setup>
import { API_URL } from '@/config'
import DToastStack from '@components/DToastStack.vue'
</script>
<template>
  <DToastStack class="left-0" />
  <div class="grid grid-cols-1 gap-1 lg:grid-cols-2 lg:gap-2 bg-white h-screen">
    <div class="m-5 md:m-9">
      <div class="flex justify-center items-center form-login">
        <div class="max-w-md p-4 md:py-0 md:p-8">
          <img
            src="../../assets/logo-blue.svg"
            class="h-20 static mb-8 m-auto"
            alt="Logo"
          />
          <slot />
        </div>
      </div>
      <p class="text-gray-400">© {{ API_URL }}</p>
    </div>
    <div class="lg:flex justify-end items-center bg-gray-100 h-screen bg-login">
      <div class="wallpaper-login"></div>
    </div>
  </div>
</template>
<style>
.wallpaper-login {
  background-image: url(/src/assets/login2.jpg);
  background-size: cover;
  background-position: left;
  height: calc(100vh - 8rem);
  width: 80%;
}
.bg-login {
  background-image:
    url(/src/assets/LinePattern_login.svg),
    url(/src/assets/LinePattern_login.svg);
  background-repeat: no-repeat, no-repeat;
  background-position:
    bottom -32vh left,
    top right;
  background-size: 38vh;
}
.form-login {
  height: calc(100vh - 9rem);
}

@media (max-width: 1024px) {
  .bg-login {
    display: none;
  }
}

@media (max-width: 767px) {
  .logo-aps {
    display: none;
  }
  .form-login {
    height: calc(100vh - 4rem);
  }
}
</style>
