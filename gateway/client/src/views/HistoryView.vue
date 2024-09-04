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
    title: "Name",
  },
  { key: "topic", title: "Topic" },
  { key: "status", title: "Status" },
  { key: "details", title: "Details" },
  { key: "timestamp", title: "Timestamp" },
]);

const desserts = ref([
  {
    name: "Frozen Yogurt",
    topic: 159,
    status: 6.0,
    details: 24,
    timestamp: 24,
  },
  {
    name: "Ice cream sandwich",
    topic: 237,
    status: 9.0,
    details: 37,
    timestamp: 24,
  },
]);

const search = ref("");
</script>
