<script setup lang="ts"></script>

<template lang="pug">
v-container
  div.d-flex.flex-row
    v-tabs(
      v-model="tab"
      color="primary"
      direction="vertical"
    )
      v-tab(
        text="Led"
        value="led"
      )
      v-tab(
        text="Camera"
        value="camera"
      )
      v-tab(
        text="System Status"
        value="system_status"
      )
    v-tabs-window(
      v-model="tab"
    )
      v-tabs-window-item(
        value="led"
      )
        Led(
          v-for="sensor in sensors"
          :label="sensor.name"
          :sensor="sensor"
          v-model:ledSensorModel="sensor.status"
        )
      v-tabs-window-item(
        value="camera"
      )
        v-card(flat)
          v-card-text
            p Camera!
      v-tabs-window-item(
        value="system_status"
      )
        v-card(flat)
          v-card-text
            p System status!
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Led from "@/components/Led.vue";
import axios from "axios";

const sensors = ref([]);
const tab = ref("led");
const loading = ref(false);

onMounted(() => {
  getAll();
  getSystemStatus();
});

const getAll = () => {
  loading.value = true;
  axios
    .get("/api/sensor/")
    .then((res) => {
      console.log(res.data);
      sensors.value = res.data.map((el) => ({
        ...el,
        status: el.status == "on" ? true : false,
      }));
      console.log(sensors.value);
    })
    .catch((err) => {
      console.log(`Error: ${err}`);
    })
    .finally(() => {
      loading.value = false;
    });
};

const getSystemStatus = () => {
  loading.value = true;
  axios
    .get("/api/sensor/")
    .then((res) => {
      console.log(res.data);
      sensors.value = res.data.map((el) => ({
        ...el,
        status: el.status == "on" ? true : false,
      }));
      console.log(sensors.value);
    })
    .catch((err) => {
      console.log(`Error: ${err}`);
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>
