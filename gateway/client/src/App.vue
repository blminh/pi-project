<script setup lang="ts"></script>

<template lang="pug">
v-container(fluid)
  v-app
    v-app-bar(title="Pi Project")
      v-row(align="center" justify="start")
        v-col(cols="auto")
          RouterLink(to="/")
            v-btn(variant="tonal" rounded="xl" size="x-large") Home
        v-col(cols="auto")
          RouterLink(to="/settings")
            v-btn(variant="tonal" rounded="xl" size="x-large") Settings
        v-col(cols="auto")
          RouterLink(to="/history")
            v-btn(variant="tonal" rounded="xl" size="x-large") History      
    v-main
      v-container
        RouterView
</template>
