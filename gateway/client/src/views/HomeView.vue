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
        v-card(
          flat
          width="800px"
        )
          v-card-text
            v-container
              v-row
                v-col(
                  cols="4"
                  class="d-flex child-flex"
                  v-for="img in imgList"
                )
                  v-img(
                    cover
                    aspect-ratio="1"
                    class="bg-grey-lighten-2"
                    :src="img.path"
                  )
      v-tabs-window-item(
        value="system_status"
      )
        v-card(flat)
          v-card-text
            p CPU Temperature - {{ socketState.msg.message }}
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import Led from "@/components/Led.vue";
import axios from "axios";
import { io } from "socket.io-client";

const sensors = ref([]);
const tab = ref("led");
const loading = ref(false);
const socketState = ref({});
const imgPath = ref("");
const imgList = ref([]);

const socket = io("http://0.0.0.0:3000", {
  autoConnect: true,
});

socket.on("temperature", function (data) {
  console.log("Connected to socket server!");
  socketState.value.state = "Connected";
  socketState.value.msg = data;
});

onMounted(() => {
  getAllSensors();
  getImagesList();
  imgPath.value = "http://0.0.0.0:3000/images/";
});

watch(tab, (val) => {
  if (val == "led") getAllSensors();
  else if (val == "camera") getImagesList();
});

const getAllSensors = () => {
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

const getImagesList = () => {
  loading.value = true;
  axios
    .get("/api/sensor/images/")
    .then((res) => {
      imgList.value = res.data.map((el) => ({
        id: el.id,
        path: imgPath.value + el.name,
      }));
      console.log(imgList.value);
    })
    .catch((err) => {
      console.log(`Error: ${err}`);
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>
