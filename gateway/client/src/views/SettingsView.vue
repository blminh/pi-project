<script setup lang="ts"></script>

<template lang="pug">
v-container
  div.d-flex.flex-row
    v-tabs.u-tabs(
      v-model="tab"
      color="primary"
      direction="vertical"
    )
      v-tab.u-tab(
        text="List sensors"
        value="sensors"
      )
        v-icon.u-tab-icon(icon="mdi-list-box-outline")
        span.u-tab-title List sensors
      v-tab.u-tab(
        text="New sensor"
        value="new_sensor"
      )
        v-icon.u-tab-icon(icon="mdi-shape-plus-outline")
        span.u-tab-title New sensor
      v-tab.u-tab(
        text="Sensor type"
        value="sensor_type"
      )
        v-icon.u-tab-icon(icon="mdi-shape-outline")
        span.u-tab-title Sensor type
    v-tabs-window.u-tabs-window(
      v-model="tab"
    )
      v-tabs-window-item.u-tabs-item(
        value="sensors"
      )
        v-card.u-card(
          title="All sensors"
        )
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
            :items="allSensors"
            :search="search"
          )
      v-tabs-window-item.u-tabs-item(
        value="new_sensor"
      )
        NewCard.u-card(
          title="New Sensor"
          width="500"
          @click:onSave="onAddNewSensor()"
          @click:onClearFiled="onClear()"
        )
          template(v-slot:cardContent)
            v-row(dense)
              v-col(cols="12")
                v-text-field(
                  label="Sensor Name"
                  require
                  variant="outlined"
                  v-model="newSensor.name"
                )
              v-col(cols="12")
                v-select(
                  label="Sensor Type"
                  variant="outlined"
                  :items="allSensorType"
                  item-title="name"
                  item-value="id"
                  v-model="newSensor.sensor_type_id"
                )
              v-col(cols="12")
                v-text-field(
                  label="Topic"
                  require
                  variant="outlined"
                  v-model="newSensor.topic"
                )
              v-col(cols="12")
                v-text-field(
                  label="Details"
                  require
                  variant="outlined"
                  v-model="newSensor.details"
                )        
      v-tabs-window-item.u-tabs-item(
        value="sensor_type"
      )
        NewCard.u-card(
          title="Sensor Type"
          width="500"
          @click:onSave="onAddNewSensorType()"
          @click:onClearFiled="onClear()"
        )
          template(v-slot:cardContent)
            v-row(dense)
              v-col(cols="12")
                v-text-field(
                  label="Sensor Type Name"
                  require
                  variant="outlined"
                  v-model="newSensorType.name"
                )
              v-col(cols="12")
                v-text-field(
                  label="Topic"
                  require
                  variant="outlined"
                  v-model="newSensorType.topic"
                )
              v-col(cols="12")
                v-text-field(
                  label="Details"
                  require
                  variant="outlined"
                  v-model="newSensorType.details"
                )     
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import _ from "lodash";

import Led from "@/components/Led.vue";
import NewCard from "@/components/NewCard.vue";

const tab = ref("sensors");
const loading = ref(false);
const search = ref("");
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
const allSensors = ref([]);
const allSensorType = ref([]);
const newSensor = ref({
  name: "",
  sensor_type_id: 0,
  topic: "",
  details: "",
});
const newSensorType = ref({
  name: "",
  topic: "",
  details: "",
});

onMounted(() => {
  getAllSensors();
  getAllSensorType();
});

watch(tab, (val) => {
  if (val == "new_sensor") getAllSensorType();
  else if (val == "sensors") getAllSensors();
});

const getAllSensors = () => {
  loading.value = true;
  axios
    .get("/api/sensor/")
    .then((res) => {
      console.log("get all sensors:");
      console.log(res);
      allSensors.value = res.data.map((el) => ({
        ...el,
        topic: `${el.sensor_type.topic}/${el.topic}`,
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

const getAllSensorType = () => {
  loading.value = true;
  axios
    .get("/api/sensor/type")
    .then((res) => {
      console.log(res);
      if (!_.isEmpty(res.data)) {
        allSensorType.value = res.data;
        newSensor.value.sensor_type_id = res.data[0].id;
      }
    })
    .catch((err) => {
      console.log(`Error: ${err}`);
    })
    .finally(() => {
      loading.value = false;
    });
};

const onAddNewSensor = () => {
  console.log("New sensor data: " + newSensor.value);
  console.log(newSensor.value);

  loading.value = true;
  axios
    .post("/api/sensor/add", newSensor)
    .then((res) => {
      console.log(res);
      onClearSensor();
    })
    .catch((err) => {
      console.log(`Error: ${err}`);
    })
    .finally(() => {
      loading.value = false;
    });
};

const onAddNewSensorType = () => {
  console.log(newSensorType.value);

  loading.value = true;
  axios
    .post("/api/sensor/type/add", newSensorType)
    .then((res) => {
      console.log(res);
      onClearSensorType();
    })
    .catch((err) => {
      console.log(`Error: ${err}`);
    })
    .finally(() => {
      loading.value = false;
    });
};

const onClearSensor = () => {
  newSensor.value = {
    name: "",
    sensor_type_id: 0,
    topic: "",
    details: "",
  };
};

const onClearSensorType = () => {
  newSensorType.value = {
    name: "",
    topic: "",
    details: "",
  };
};
</script>

<style scoped lang="scss">
@import "../styles/_tab";

.v-tabs-window {
  width: -webkit-fill-available;
}
</style>
