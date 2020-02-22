<template>
  <div id="app">
    <div id="mapdiv" ref="mapContainer">
      <div id="my_title">2019-nCoV 疫情态势</div>
      <div id="layers">
        <span class="mui-icon mui-icon-bars" @click="showLayerPanel=!showLayerPanel"></span>
      </div>
      <transition name="slide-fade">
        <div id="layerPanel" v-if="showLayerPanel">
          <div class="mui-input-row mui-checkbox mui-left">
            <label>热力图-确诊人数</label>
            <input
              v-model="heatConfirmChecked"
              name="checkbox"
              value="Item 1"
              type="checkbox"
              @click="showHeatmap"
            />
          </div>
          <div class="mui-input-row mui-checkbox mui-left">
            <label>聚合图-确诊人数</label>
            <input
              v-model="clusterConfirmChecked"
              name="checkbox"
              type="checkbox"
              @click="showCluster"
            />
          </div>
        </div>
      </transition>
      <div id="date">
        <div>
          <span class="mui-icon mui-icon-refresh" @click="playByDate()"></span>
          {{date}}
        </div>
      </div>
    </div>
    <OverAllData />
  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import OverAllData from "./components/OverAllData.vue";
import { getBetweenDateStr } from "./lib/dateUtil.js";
export default {
  components: { OverAllData },
  name: "App",
  data() {
    return {
      date: null,
      dateArray: null,
      map: null,
      showLayerPanel: false,
      heatConfirmChecked: true,
      clusterConfirmChecked: false,
      heatmapPaint: {
        "heatmap-intensity": 1,
        "heatmap-weight": 1,
        "heatmap-opacity": 1,
        "heatmap-color": [
          "interpolate",
          ["linear"],
          ["heatmap-density"],
          0,
          "rgba(0, 0, 255, 0)",
          0.1,
          "royalblue",
          0.3,
          "cyan",
          0.5,
          "lime",
          0.7,
          "yellow",
          1,
          "red"
        ],
        "heatmap-radius": [
          "interpolate",
          ["linear"],
          ["get", "confirmed"],
          2,
          1,
          5,
          3,
          10,
          5,
          20,
          6,
          50,
          8,
          100,
          10,
          1000,
          15,
          2000,
          20
        ]
      },
      clusterPaint: {
        "circle-color": [
          "step",
          ["get", "confirmed"],
          "#9ad5ff",
          0,
          "#9af6ff",
          20,
          "cyan",
          200,
          "yellow",
          400,
          "#f1f075",
          800,
          "#f9b196",
          1000,
          "#f28cb1",
          2000,
          "#f28cb1"
        ],
        "circle-radius": [
          "step",
          ["get", "confirmed"],
          8,
          100,
          10,
          500,
          15,
          1000,
          20,
          10000,
          25
        ],
        "circle-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          0,
          0.95,
          7,
          0.95,
          8,
          0.7
        ]
      }
    };
  },
  methods: {
    init() {
      this.dateArray = getBetweenDateStr("2020-01-23", "2020-02-21");
      this.date = this.dateArray[this.dateArray.length - 1];
      //创建地图对象
      mapboxgl.accessToken =
        "pk.eyJ1Ijoiamltd2VpIiwiYSI6ImNqN3ZoczZhZjZiZm0zMm8yeW00b2VkdjkifQ.Q_wogxtnFE11PatzGRkHEA";
      this.map = new mapboxgl.Map({
        container: this.$refs.mapContainer,
        style: "mapbox://styles/jimwei/ck6t66b9m0ekp1ioboifd3o0k", // "mapbox://styles/jimwei/ck4mcmd4l7ufr1cpmh965ht2a",
        zoom: 2.12,
        center: [105, 32]
      });
      // console.log(this.map);
      this.map.on("load", () => {
        this.map.addSource("initSource-heat", {
          type: "geojson",
          data:
            "./static/everyday/" +
            this.dateArray[this.dateArray.length - 1] +
            ".json"
        });
        this.map.addSource("initSource-cluster", {
          type: "geojson",
          cluster: true,
          clusterRadius: 28,
          clusterProperties: {
            confirmed: ["+", ["get", "confirmed"]]
          },
          data:
            "./static/everyday/" +
            this.dateArray[this.dateArray.length - 1] +
            ".json"
        });
        this.map.addLayer({
          id: "confirmed-heat",
          filter: [">=", "confirmed", 0],
          type: "heatmap",
          source: "initSource-heat",
          paint: this.heatmapPaint
        });
      });
    },

    playByDate() {
      for (var i = 0; i < this.dateArray.length; i++) {
        var j = 0;
        setTimeout(() => {
          let date = this.dateArray[j++];
          this.date = date;
          this.$http
            .get(
              "./static/everyday/" + date + ".json"
              //   "./static/test.json"
            )
            .then(res => {
              this.map.getSource("initSource-heat").setData(res.body);
              this.map.getSource("initSource-cluster").setData(res.body);
            });

          // this.map
          //   .getSource("initSource-heat")
          //   .setData("./static/everyday/" + date + ".json");
          // this.map
          //   .getSource("initSource-cluster")
          //   .setData("./static/everyday/" + date + ".json");
        }, i * 1000);
      }
    },
    showHeatmap() {
      this.heatConfirmChecked = !this.heatConfirmChecked;
      if (this.map.getLayer("confirmed-heat") !== undefined) {
        this.map.removeLayer("confirmed-heat");
      } else {
        this.map.addLayer({
          id: "confirmed-heat",
          filter: [">=", "confirmed", 0],
          type: "heatmap",
          source: "initSource-heat",
          paint: this.heatmapPaint
        });
      }
    },
    showCluster() {
      this.clusterConfirmChecked = !this.clusterConfirmChecked;
      if (this.map.getLayer("clusters-map") !== undefined) {
        this.map.removeLayer("clusters-map");
        this.map.removeLayer("clusters-count");
      } else {
        this.map.addLayer({
          id: "clusters-map",
          filter: [">=", "confirmed", 1],
          type: "circle",
          source: "initSource-cluster",
          filter: [">=", ["get", "confirmed"], 1],
          paint: this.clusterPaint
        });
        this.map.addLayer({
          id: `clusters-count`,
          type: "symbol",
          source: `initSource-cluster`,
          filter: [">=", ["get", "confirmed"], 1],
          // minzoom: 6,
          layout: {
            "text-field": "{confirmed}",
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 11,
            "text-allow-overlap": true
          },
          paint: {
            // "text-translate": [0, 20]
          }
        });
      }
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style>
body {
  margin: 0;
}
#mapdiv {
  width: 100%;
  height: 450px;
}
#layers {
  position: absolute;
  top: 418px;
  right: 16px;
  color: #ffffff;
  z-index: 1000;
  padding: 1px;
}
#layers > .mui-icon {
  font-size: 20px;
  font-weight: bold;
}
#my_title {
  position: absolute;
  top: 10px;
  left: 10px;
  color: white;
  font-family: "Helvetica Neue", Helvetica, STHeiTi, sans-serif;
  z-index: 10000;
  text-shadow: 0em 0.1em 0.1em #bbb4b4;
  font-size: 1.3em;
}
#date {
  position: absolute;
  top: 420px;
  left: 15px;
  z-index: 11111;
  color: white;
  display: inline-flex;
}
#layerPanel {
  z-index: 1000;
  position: absolute;
  border: 1px solid rgb(151, 151, 151);
  background: rgba(10, 37, 86, 0.62);
  right: 18px;
  top: 340px;
}
.mui-checkbox.mui-left input[type="checkbox"],
.mui-radio.mui-left input[type="radio"] {
  left: 10px;
}
.mui-checkbox.mui-left label,
.mui-radio.mui-left label {
  padding-right: 15px;
  padding-left: 35px;
  color: white;
  font-size: 14px;
  border-bottom: 0.5px solid gray;
}
.mui-checkbox input[type="checkbox"]:checked:before,
.mui-radio input[type="radio"]:checked:before {
  color: #dbdddf;
}

.mui-checkbox input[type="checkbox"]:before,
.mui-radio input[type="radio"]:before {
  font-size: 20px;
  line-height: 1.3;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
