<script setup lang="ts"></script>

<template lang="pug">
v-container.ma-2.pa-0.u-container
  v-app.u-app
    v-app-bar.u-app-bar(title="Pi Project")
      v-row.u-app-items(align="center" justify="start")
        v-col.u-app-item(cols="auto")
          RouterLink(to="/")
            v-btn(variant="tonal" rounded="xl" size="x-large") Home
        v-col.u-app-item(cols="auto")
          RouterLink(to="/settings")
            v-btn(variant="tonal" rounded="xl" size="x-large") Settings
        v-col.u-app-item(cols="auto")
          RouterLink(to="/history")
            v-btn(variant="tonal" rounded="xl" size="x-large") History
      v-menu.u-app-content
        template( v-slot:activator="{ props }")
          v-btn.u-menu-btn(icon="mdi-dots-vertical" variant="text" v-bind="props")
        v-list(density="compact")
          v-list-item(
            link
            v-for="(item, i) in menu"
            :key="i"
            :to="item.url"
          )
            v-list-item-title(v-text="item.name")
    v-main
      RouterView
</template>

<script setup>
import { ref } from "vue";

const menu = ref([
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Settings",
    url: "/settings",
  },
  {
    name: "History",
    url: "/history",
  },
]);
</script>

<style scoped lang="scss">
@import "./styles/app.scss";
</style>
