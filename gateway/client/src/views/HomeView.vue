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
          v-for="item in items"
          :label="item.name"
          v-model:ledStatusModel="item.status"
          @update:ledStatus="changeStatus(item)"
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
import { ref } from "vue";
import Led from "@/components/Led.vue";
import axios from "axios";

const items = ref([
  { id: 1, name: "Led 1", pin: 23, status: false },
  { id: 2, name: "Led 2", pin: 26, status: false },
]);

const tab = ref("led");

async function changeStatus(item) {
  console.log(`From parent: ${item.name} - ${item.status}`);

  axios
    .post("/api/change", item)
    .then((res) => {
      console.log(`Send success! ${res.data}`);
      console.log(res);
    })
    .catch((err) => {
      console.log(`Error: ${err}`);
      console.log(err);
    });
}
</script>
