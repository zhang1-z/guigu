<template>
  <div class="box6">
    <div class="title">
      <p>热门景区排行</p>
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
      text: '景区排行',
      link: 'https://www.baidu.com',
      left: 'center',
      textStyle: {
        color: 'yellowgreen',
        fontSize: 20
      },
      //子标题
      subtext: '各大景区排行',
      subtextStyle: {
        color: 'yellowgreen',
        fontSize: 16
      }
    },
    xAxis: {
      type: 'category',//图形图标在x轴均匀分布
    },
    yAxis: {},
    grid: {
      left: 20,
      bottom: 20,
      right: 20,
    },
    series: [
      {
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20],
        label: {
          show: true,
          //文字位置
          position: 'insideTop'
        },
        showBackground: true,
        backgroundStyle: {
          color: '#ccc'
        },
        itemStyle: {
          borderRadius: 5,
          color: function(data: any) {
            const arr = ['#5793f3', '#d14a61', '#675bba', '#f69899', '#34495e', '#7f8c8d']
            return arr[data.dataIndex]
          }
        }
      },
      {
        type: 'line',
        data: [5, 20, 36, 10, 10, 20],
        smooth: true,
      }
    ],
    tooltip: {
      backgroundColor: 'rgba(255,255,255,0.8)',
    }
  })
})
</script>

<style scoped lang="scss">
.box6{
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
    height: calc(100% - 20px);
  }
}

</style>