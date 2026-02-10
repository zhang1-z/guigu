<template>
  <div class="box5">
    <div class="title">
      <p>未来七天游客数量趋势图</p>
      <img src="../../images/dataScreen-title.png" alt="">
    </div>
    <div class="charts" ref="line"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { onMounted, ref } from 'vue';

const line = ref()

onMounted(() => {
  const myChart = echarts.init(line.value)
  myChart.setOption({
    title: {
      text: '访问量'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,//两侧不留白
      //分割线不要
      splitLine: {
        show: false
      },
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      //分割线不要
      splitLine: {
        show: false
      },
      //轴线的设置
      axisLine: {
        show: true
      },
      //刻度
      axisTick: {
        show: true
      }
    },
    grid: {
      left: 40,
      top: 0,
      right: 20,
      bottom:20
    },
    series: [
      {
        type: 'line',
        data: [120, 200, 150, 80, 70, 110, 130],
        //平滑曲线的设置
        smooth: true,
        //区域填充样式
        areaStyle: {
          color: 'red'
        }
      }
    ]
  })
})
</script>

<style scoped lang="scss">
.box5 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 0 10px;
  .title{
    margin-left: 10px;
    p{
      color: white;
      font-size: 20px;
    }
  }
  .charts{
    height: calc(100% - 40px);
  }
}
</style>