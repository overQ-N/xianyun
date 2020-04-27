<template>
  <div class="wrap">
    <h2>高德地图</h2>
    <el-row type="flex" :gutter="20" align="center">
      <el-col :span="12">
        <div id="container" />
      </el-col>
      <el-col :span="12">
        <el-tabs v-model="activeName" @tab-click="handleClick(activeName)">
          <el-tab-pane label="驾车" name="first" />
          <el-tab-pane label="公交" name="second" />
          <el-tab-pane label="乘骑" name="third" />
          <el-tab-pane label="步行" name="fourth" />
        </el-tabs>
        <el-form>
          <el-form-item label="起始位置">
            <el-input v-model.trim="start" />
          </el-form-item>
          <el-form-item label="终点位置">
            <el-input v-model.trim="end" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width:100%" @click="query">
              查询
            </el-button>
          </el-form-item>
        </el-form>
        <div id="panel" />
      </el-col>
      <script
        src="https://webapi.amap.com/maps?v=2.0&key=7179779dbf7533b3b406fdd4449307bd&plugin=AMap.Driving,AMap.Geolocation"
      />
    </el-row>
  </div>
</template>
<!-- 并不会加载这里的代码，只不过不加Eslint会报错 -->
<script
src="https://webapi.amap.com/maps?v=1.4.15&key=7179779dbf7533b3b406fdd4449307bd&plugin=AMap.Driving"></script>
<script>
export default {
  data() {
    return {
      activeName: "first",
      start: "", //起始位置
      end: "", //终点位置,
      map: "",
      driving: ""
    };
  },
  mounted() {
    this.map = new AMap.Map("container", {});
    const marker = new AMap.Marker({
      position: new AMap.LngLat(113.3245904, 23.1066805),
      zoom: 13,
      title: "广州塔"
    });
    var content = `<div class="marker-route marker-marker-bus-from" style="width:40px;height:40px;background:url('/1.jpg');background-size:cover;border-radius:50%;"></div>`;
    var marker1 = new AMap.Marker({
      content: content, // 自定义点标记覆盖物内容
      position: [113.3245904, 23.1266805], // 基点位置
      offset: new AMap.Pixel(-17, -42) // 相对于基点的偏移位置
    });
    this.map.add([marker, marker1]); //添加到地图
    setTimeout(()=>{
      this.locationCity()
    },1000)
  },
  methods: {
    handleClick(tab) {
      // 驾车
      if (tab === "first") {
        console.log(1);
      }
    },
    query() {
      // 清空上次查询的路线规划
      if (this.driving) {
          this.driving.clear();
        }
      if (this.activeName === "first") {
        this.handleDrive(this.start, this.end);
      }
     if(this.activeName==='second'){
       this.handleTransfer(this.start,this.end)
     }
    },
    // 驾车规划
    handleDrive(start, end) {
      AMap.plugin("AMap.Driving", () => {
        this.driving = new AMap.Driving({
          policy: AMap.DrivingPolicy.LEAST_TIME,
          map: this.map,
          showTraffic: true,
          panel: "panel"
        });
        var points = [
          { keyword: start, city: "广州" },
          { keyword: end, city: "广州" }
        ];

        this.driving.search(points, function(status, result) {
          // 未出错时，result即是对应的路线规划方案
        });
      });
    },
    handleTransfer(start,end){
      AMap.plugin('AMap.Transfer',()=>{
        this.driving = new AMap.Transfer({
          policy: AMap.DrivingPolicy.LEAST_TIME,
          map: this.map,
          panel: "panel"
        })
        var points = [
          { keyword: start, city: "广州" },
          { keyword: end, city: "广州" }
        ];

        this.driving.search(points, function(status, result) {
          // 未出错时，result即是对应的路线规划方案
        });
      })
    },
    locationCity(){
   const mapObj = this.map
mapObj.plugin('AMap.Geolocation', function () {
    const geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
        maximumAge: 0,           //定位结果缓存0毫秒，默认：0
        convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        showButton: true,        //显示定位按钮，默认：true
        buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
        showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
        zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
    });
    mapObj.addControl(geolocation);
    geolocation.getCurrentPosition();
    console.log(geolocation)
    AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
    AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
});
    }
  }
};
</script>

<style lang='less' scoped>
.wrap {
  height: 100%;
  width: 1000px;
  margin: 0 auto;
}
#container {
  width: 100%;
  height: 700px;
}
#panel {
  background-color: white;
  max-height: 400px;
  overflow-y: auto;

  width: 100%;
}
#panel .amap-call {
  background-color: #009cf9;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
#panel .amap-lib-driving {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  overflow: hidden;
}
</style>
