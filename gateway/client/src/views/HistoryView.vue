<script setup lang="ts"></script>

<template lang="pug">
v-container
  v-card(title="History")
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
import { ref } from "vue";
import Led from "@/components/Led.vue";
import axios from "axios";

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
  {
    name: "Eclair",
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
    iron: 7,
  },
  {
    name: "Cupcake",
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    iron: 8,
  },
]);

const search = ref("");
</script>
