<template>
  <div id="data">
    <div class="title-div">
      <div class="title-content">
        <span class="title-name">全国概况</span>
        <span class="end-date">截至{{ date }}</span>
      </div>
    </div>
    <div class="info-card-div">
      <div class="item confirmed split">
        <span class="top-text">
          今日
          <span class="add color">{{confirmedAdd}}</span>
        </span>
        <p class="number color">{{confirmed}}</p>
        <span class="type">确诊</span>
      </div>
      <div class="item wellcure split">
        <span class="top-text">
          今日
          <span class="add color">{{curedAdd}}</span>
        </span>
        <p class="number color">{{cured}}</p>
        <span class="type">治愈</span>
      </div>
      <div class="item confirmed split">
        <span class="top-text">
          今日
          <span class="add color">{{suspectedAdd}}</span>
        </span>
        <p class="number color">{{suspected}}</p>
        <span class="type">疑似</span>
      </div>
      <div class="item cure">
        <span class="top-text">
          今日
          <span class="add color">{{deadAdd}}</span>
        </span>
        <p class="number color">{{dead}}</p>
        <span class="type">死亡</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: 0,
      confirmed: 0,
      suspected: 0,
      cured: 0,
      dead: 0,
      confirmedAdd: 0,
      suspectedAdd: 0,
      curedAdd: 0,
      deadAdd: 0
    };
  },
  methods: {
    init() {
      this.$http
        .get(
          "https://lab.isaaclin.cn/nCoV/api/overall"
          //   "./static/test.json"
        )
        .then(res => {
          let todayData = res.body.results[0];
          // console.log(res);

          //总数
          this.date = this.timeStampToTime(todayData.updateTime);
          this.confirmed = todayData.confirmedCount;
          this.suspected = todayData.suspectedCount;
          this.cured = todayData.curedCount;
          this.dead = todayData.deadCount;
          //今日
          this.confirmedAdd = todayData.confirmedIncr;
          this.suspectedAdd = todayData.suspectedIncr;
          this.curedAdd = todayData.curedIncr;
          this.deadAdd = todayData.deadIncr;
        });
    },
    timeStampToTime(time) {
      let timestamp = new Date(time);
      return (
        timestamp.toLocaleDateString().replace(/\//g, "-") +
        " " +
        timestamp.toTimeString().substr(0, 8)
      );
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style scope>
/* #data {
  width: 100%;
  height: 100px;
  background-color: aqua;
} */
.title-div {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  /* width: 100%; */
  height: 1.7rem;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  padding-left: 0.26rem;
  background-color: #040d3a;
  color: white;
  border-top: 1px solid #807474;
}
.title-div .title-name {
  font-size: 15px;
  font-weight: 600;
  padding: 0.1rem;
}
.title-div .end-date {
  font-size: 12px;
  color: #999;
  font-weight: 300;
}
.info-card-div {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  padding: 0.16rem 0;
  width: 100%;
  margin: 0 auto;
  background-color: #040d3a;
}
.info-card-div .item {
  position: relative;
  width: 33%;
  text-align: center;
}
.info-card-div .item .top-text {
  color: #979797;
  font-size: 12px;
}
.info-card-div .confirmed .color {
  color: red;
}
.info-card-div .item .type {
  font-size: 14px;
  color: #e2e2e2;
}
.info-card-div .wellcure .color {
  color: #00bbc8;
}
.info-card-div .cure .color {
  color: #ffa900;
}
.info-card-div .item .number {
  font-size: 20px;
  font-weight: 600;
  margin: 0.1rem 0;
}
</style>