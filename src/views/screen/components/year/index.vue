<template>
  <div class="box7">
    <div class="title">
      <p>年度游客量对比</p>
      <img src="../../images/dataScreen-title.png" alt="">
    </div>  
    <div class="charts" ref="charts"></div>

  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue';

const charts = ref()

onMounted(() =>{
  const myChart = echarts.init(charts.value)
  myChart.setOption({
    title: {
      text: '散点图',
      left: 'center',
      textStyle: {
        color: '#fff'
      }
    },
    xAxis: {type:'category'},
    yAxis: {},
    grid: {
      top: 20,
      left: 20,
      right: 0,
      bottom: 20,
    },
    series: {
      type: 'scatter',
      data: [12,88,64,456,1,215,47,66,97,4,464,,4,44,7,4,46,4],
      symbol: 'arrow',
      //图文标签
      label: {
        show: true,
        position: 'top',
        color: 'yellow'
      }
  }
  })
})
</script>

<style scoped lang="scss">
.box7 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 20px 0;
  .title{
  p{
    color: white;
    font-size: 20px;
  }
  }
  .charts{
    height: calc(100% - 20px);
  }
}
</style>