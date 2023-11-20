<template>
  <div class="dashboard-container">
    <div class="el-card-body">
      <div class="user-box">
        <div class="userInfo">
          <div class="avatar">
            <el-avatar :src="uerInfo.avatar" />
          </div>
          <div style="margin-left: 10px;">
            <span>{{ uerInfo.nickname }}</span>
          </div>
        </div>
      </div>
      <div>
        {{ hoursTip }}
        <!-- {{ greetings }} -->
      </div>
      <div>
        {{ tip }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

import { computed, onMounted, ref } from 'vue';
import { getUserPage } from '@/api/amap/index'
import { useUserStore, } from "@/store/modules/user"

let uerInfo = useUserStore()
// console.log(uerInfo);

const hoursTip = computed(() => {
  let dataTime = new Date();
  if (dataTime.getHours() >= 6 && dataTime.getHours() < 12) {
    return "上午好🌞!";
  } else if (dataTime.getHours() >= 12 && dataTime.getHours() < 13) {
    return "中午好☀!";
  } else if (dataTime.getHours() >= 13 && dataTime.getHours() < 18) {
    return "下午好☕ !";
  } else if (dataTime.getHours() >= 18 && dataTime.getHours() < 19) {
    return "傍晚好🌇!";
  } else if (dataTime.getHours() >= 19 && dataTime.getHours() < 23) {
    return "晚上好🌃!";
  } else {
    return "深夜好🌉!";
  }
})

const greetings = computed(() => {
  let dataTime = new Date();
  if (dataTime.getHours() >= 6 && dataTime.getHours() < 12) {
    return "新的一天开始啦，加油！";
  } else if (dataTime.getHours() >= 12 && dataTime.getHours() < 13) {
    return "午餐时间到咯！";
  } else if (dataTime.getHours() >= 13 && dataTime.getHours() < 18) {
    return "喝杯水，休息一会儿吧！";
  } else if (dataTime.getHours() >= 18 && dataTime.getHours() < 19) {
    return "如果天气好的且天还没黑的话，那抬头看看窗外那美丽的晚霞吧！";
  } else if (dataTime.getHours() >= 19 && dataTime.getHours() < 23) {
    return "忙碌了一天了，早点休息吧！";
  } else {
    return "黑夜不会亏待晚睡的人，它会赐你黑眼圈";
  }
});

const tip = "💥官方从零到一文档"


onMounted(() => {



})


/**
 * 
 * 
 // 使用高德地图API获取城市信息
const apiKey = '1da6c89cce27b1c5e9005459cdb880d3';
const apiUrl = `https://restapi.amap.com/v3/ip?key=${apiKey}`;
// const data = {
//   key: apiKey
// }

// getUserPage(data).then((Res: any) => {
//   console.log(Res);

// })

axios.get(apiUrl, {
  params: {
    key: apiKey
  }
})
  .then(response => {
    console.log(response);

    const city = response.data.city;
    const adcode = response.data.adcode;

    // 在这里处理城市和城市代码
  })
  .catch(error => {
    console.error("Error fetching city information:", error);
  });
 * 
 */



</script>
<style lang="scss" scoped>
$whiteBg: #ffffff;
$shadowcolor:#66666629;

.dashboard-container {
  padding: 24px;

  .el-card-body {
    padding: 20px;
    background: $whiteBg;
    display: flex;
    justify-content: space-between;
    justify-self: center;
    justify-items: center;
    align-items: center;
    border-radius: 5px;
    box-shadow: 1px 1px 1px $shadowcolor;
  }
}
.userInfo{
  display: flex;
  align-items: center;
  
}
</style>