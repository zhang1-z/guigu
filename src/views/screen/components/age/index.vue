<template>
  <div class="box2">
    <div class="title">
      <p>年龄比例</p>
      <img src="../../images/dataScreen-title.png" alt="">
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { onMounted, ref } from 'vue';

const charts = ref()

onMounted(() => {
  const myChart = echarts.init(charts.value)
  const option = {
    tooltip: {
    trigger: 'item'
    },
    legend: {
      top: '40',
      right: '10',
      orient: 'vertical',
      textStyle: {
        color: '#fff',
        // fontSize:18
      }
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        padAngle: 5,
        itemStyle: {
          borderRadius: 10,
        },
        label: {
          show: true,
          position: 'inside',
          color: '#fff',
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: '军事' },
          { value: 735, name: '新闻' },
          { value: 580, name: '直播' },
          { value: 484, name: '娱乐' },
          { value: 300, name: '财经' }
        ]
      }
    ],
    grid:{
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }
  }
  myChart.setOption(option)
})
</script>

<style scoped lang="scss">
.box2 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  .title{
    margin-left: 20px;
    p{
      color: white;
      font-size: 20px;
    }
  }
  .charts{
    height: 260px;
  }
}
</style>