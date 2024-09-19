<script setup lang="ts"></script>

<template lang="pug">
v-container
  v-card.u-card(title="History")
    template(v-slot:text)
      v-text-field(
        v-model="search"
        label="Search"
        variant="outlined"
        prepend-inner-icon="mdi-magnify"
        hide-details
        single-line
      )
    v-data-table(
      :headers="headers"
      :items="histories"
      :search="search"
    )
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Led from "@/components/Led.vue";
import axios from "axios";

const headers = ref([
  {
    align: "start",
    key: "sensor",
    sortable: false,
    title: "Sensor",
  },
  { key: "sensor_status", title: "Sensor Status" },
  { key: "topic", title: "Topic" },
  { key: "message_type", title: "Type" },
  { key: "status", title: "Message Status" },
  { key: "details", title: "Details" },
  { key: "timestamp", title: "Timestamp" },
]);

const histories = ref([]);
const search = ref("");
const loading = ref(false);

onMounted(() => {
  getAll();
});

const getAll = () => {
  loading.value = true;
  axios
    .get("/api/history/")
    .then((res) => {
      histories.value = res.data.map((el) => ({
        ...el,
        sensor: el.sensor.name,
        timestamp: new Date(el.updatedAt).toLocaleString("en-US", {
          timeZone: "Asia/Ho_Chi_Minh",
        }),
      }));
    })
    .catch((err) => {
      console.log(`Error: ${err}`);
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>

<style lang="scss" scoped>
@import "../styles/HistoryView";
</style>
