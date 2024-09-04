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
          v-btn.ml-1.mr-1(
            text="Close"
            variant="flat"
            color="grey-lighten-3"
            @click="isShowDialogModel.isShow = false"
          )
          v-btn.ml-1.mr-1(
            text="Save"
            variant="flat"
            color="success"
            @click="$emit('click:onSave')"
          )
</template>

<script setup lang="ts">
import { ref } from "vue";

const isShowDialogModel = defineModel("isShowDialogModel");
</script>
