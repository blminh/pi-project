<script setup lang="ts"></script>

<template lang="pug">
v-container(fluid)
  v-card(
    :title="title"
    :max-width="width"
  )
    v-card-text
      slot(name="cardContent")
    v-divider
    v-card-actions
      v-spacer
        v-btn.ml-1.mr-1(
          text="Close"
          variant="flat"
          color="grey-lighten-3"
          @click="$emit('click:onClearFiled')"
        )
        v-btn.ml-1.mr-1(
          text="Save"
          variant="flat"
          color="success"
          @click="$emit('click:onSave')"
        )
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  width: string;
}>();
</script>
