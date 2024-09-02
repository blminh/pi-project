<script setup lang="ts"></script>

<template lang="pug">
v-container
  NewDialog(
    v-model:isShowDialogModel="newSensorDialogReactive"
  )
    template(v-slot:dialogContent)
      v-row(dense)
        v-col(
          cols="12"
        )
          v-text-field(
            label="Sensor Name"
            require
          )
        v-col(
          cols="12"
        )
          v-text-field(
            label="Topic"
            require
          )
  v-btn.mb-5(
    variant="tonal"
    elevation="4"
    rounded="xl"
    size="x-large"
    color="success"
    @click="showDialog"
  ) Add Sensor
  v-card(title="All sensors")
    template(v-slot:text)
      v-text-field(
        v-model="search"
        label="Search"
        variant="outlined"
        hide-details
        single-line
      )
    v-data-table(
      :headers="headers"
      :items="desserts"
      :search="search"
    )
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import axios from "axios";

import Led from "@/components/Led.vue";
import NewSensorDialog from "@/components/NewSensorDialog.vue";

const headers = ref([
  {
    align: "start",
    key: "name",
    sortable: false,
    title: "Dessert (100g serving)",
  },
  { key: "calories", title: "Calories" },
  { key: "fat", title: "Fat (g)" },
  { key: "carbs", title: "Carbs (g)" },
  { key: "protein", title: "Protein (g)" },
  { key: "iron", title: "Iron (%)" },
]);

const desserts = ref([
  {
    name: "Frozen Yogurt",
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    iron: 1,
  },
  {
    name: "Ice cream sandwich",
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    iron: 1,
  },
]);

const search = ref("");
const newSensorDialogReactive = reactive({ isShow: false });

const showDialog = () => {
  newSensorDialogReactive.isShow = true;
};
</script>
