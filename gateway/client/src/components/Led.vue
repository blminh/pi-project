<script setup lang="ts"></script>

<template lang="pug">
v-container(fluid)
  v-switch(
    inset
    color="success"
    :label="label"
    v-model="ledSensorModel"
  )
</template>

<script setup lang="ts">
import { watch, onMounted } from "vue";
import axios from "axios";

const props = defineProps<{
  label: string;
  sensor: {};
}>();

const ledSensorModel = defineModel("ledSensorModel");

watch(ledSensorModel, (val) => {
  let data = {
    ...props.sensor,
    status: props.sensor.status ? "on" : "off",
  };

  axios
    .post("/api/sensor/set", data)
    .then((res) => {
      console.log(`Send success! ${res.data}`);
    })
    .catch((err) => {
      console.log(`Error: ${err}`);
    });
});
</script>
