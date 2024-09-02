<script setup lang="ts"></script>

<template lang="pug">
v-container(fluid)
  v-dialog(
    max-width="500"
    v-model="isShowDialogModel.isShow"
  )
    v-card(title="New Sensor")
      v-card-text
        slot(name="dialogContent")
      v-divider
      v-card-actions
        v-spacer
          v-btn(
            text="Close"
            variant="plain"
            @click="isShowDialogModel.isShow = false"
          )
          v-btn(
            color="primary"
            text="Save"
            variant="tonal"
            @click="isShowDialogModel.isShow = false"
          )
</template>

<script setup lang="ts">
import { ref } from "vue";

const isShowDialogModel = defineModel("isShowDialogModel");
console.log("Child: " + isShowDialogModel.value.isShow);
</script>
