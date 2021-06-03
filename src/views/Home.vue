<template>
  <div class="home">
    <div class="content">
      <div
        v-for="plant in plants"
        :key="plant.id"
        class="plant-container"
        :class="{ 'needs-water': plant.needs_water }"
      >
        <div class="plant-image">
          <img class="image-plant" :src="buildImage(plant.image.path)" alt="" />
          <p>
            <i>{{ plant.Name }}</i>
            <img
              @click="showInfoModal(plant)"
              class="info-ic"
              src="../assets/info_ic.svg"
              alt=""
            />
          </p>
        </div>
        <div class="plant-info">
          <p>Zuletzt gegossen:</p>
          <p>
            <b>{{ plant.watered | timeFrom }}</b>
          </p>
          <p class="amount">{{ plant.amount }} ml</p>
        </div>
        <div class="plant-buttons">
          <button class="water" @click="showModal(plant)">gießen</button>
          <button class="watered" @click="hasWater(plant._id)">gegossen</button>
        </div>
      </div>
    </div>
    <modal @close="closeModal" v-show="isModalVisible">
      <template v-slot:content>
        <p class="moda-body">Menge</p>
        <input
          type="range"
          min="100"
          max="2000"
          :value="sliderValue"
          class="slider"
          step="100"
          id="amount"
          @input="changeValue()"
        />
        <p class="moda-body">{{ sliderValue }} ml</p>
        <button class="water" @click="needsWater()">gießen</button>
      </template>
    </modal>
    <modal @close="closeInfoModal" v-show="isInfoModalVisible">
      <template v-slot:content>
        <p>Information</p>
        <div class="info-text" v-if="selectedPlant">
          <b>Standort</b>
          <p>{{ selectedPlant.location }}</p>
          <b>Temperatur</b>
          <p>{{ selectedPlant.temperature || "-" }}</p>
          <b>Wasserbedarf</b>
          <p>{{ selectedPlant.watercycle || "-" }}</p>
        </div>
      </template>
    </modal>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
import moment from "moment";
import modal from "@/components/Modal.vue";

const _ = require("underscore");
const headerConf = {
  "Cockpit-Token": process.env.VUE_APP_API_TOKEN,
  "Content-Type": "application/json"
};

export default Vue.extend({
  name: "home",
  components: {
    modal
  },
  data() {
    return {
      mood: "",
      plants: [],
      time: new Date(),
      isModalVisible: false,
      sliderValue: 1000,
      plantId: null,
      isInfoModalVisible: false,
      selectedPlant: null
    };
  },
  methods: {
    showModal(plant: any) {
      this.isModalVisible = true;
      this.plantId = plant._id;
      this.sliderValue = plant.amount;
    },
    closeModal() {
      this.isModalVisible = false;
      this.plantId = null;
      this.sliderValue = 1000;
    },
    showInfoModal(plant: any) {
      this.selectedPlant = plant;
      this.isInfoModalVisible = true;
    },
    closeInfoModal() {
      this.isInfoModalVisible = false;
    },
    buildImage(image: string) {
      return "https://toepfer-development.de/" + image;
    },
    changeValue() {
      let sliderAmount = document.getElementById("amount") as HTMLInputElement;
      if (sliderAmount !== null) {
        this.sliderValue = parseInt(sliderAmount.value);
      }
    },
    getPlants() {
      axios
        .get(
          "https://toepfer-development.de/cockpit/api/collections/get/plants",
          {
            headers: headerConf
          }
        )
        .then(response => (this.plants = response.data.entries))
        .catch(error => console.log(error));
    },
    needsWater() {
      var data = JSON.stringify({
        data: {
          _id: this.plantId,
          needs_water: true,
          amount: this.sliderValue
        }
      });
      axios
        .post(
          "https://toepfer-development.de/cockpit/api/collections/save/plants",
          data,
          {
            method: "patch",
            headers: headerConf
          }
        )
        .then(response => (console.log(response), this.getPlants()))
        .catch(error => console.log(error));
      this.plantId = null;
      this.closeModal();
    },
    hasWater(id: string) {
      var currentDate = new Date();
      var currentTime = currentDate.getTime();
      var data = JSON.stringify({
        data: {
          _id: id,
          needs_water: false,
          watered: currentTime
        }
      });
      axios
        .post(
          "https://toepfer-development.de/cockpit/api/collections/save/plants",
          data,
          {
            method: "patch",
            headers: headerConf
          }
        )
        .then(response => (console.log(response), this.getPlants()))
        .catch(error => console.log(error));
    }
  },
  filters: {
    moment: function(date: Date) {
      return moment(date).format("DD.MM.YYYY HH:mm:ss");
    },
    timeFrom: function(time: Date) {
      return moment(time)
        .locale("de")
        .fromNow();
    }
  },
  mounted() {
    this.getPlants();
    let that = this;
    setInterval(function() {
      that.getPlants();
    }, 60000);
  }
});
</script>
<style lang="sass">
@import "../styles/style.sass"
</style>
