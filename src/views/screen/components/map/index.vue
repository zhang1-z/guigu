<template>
  <div class="box4" ref="map">
    111
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue';
import chinaJSON from './china.json'

const map = ref()

echarts.registerMap('china', chinaJSON as any)

onMounted(() => {
  const myChart = echarts.init(map.value)
  myChart.setOption({
    //地图组件
    geo: {
      map: 'china',//中国地图
      roam: true,//鼠标缩放的效果
      //地图位置的调试
      left:50,
      top:100,
      right:50,
      bottom:50,
      //地图上的文字的设置
      label: {
        show: true,//文字显示
        color: '#000',//文字颜色
        fontSize: 12,//文字大小
      },
      itemStyle: {
        opacithy: 0.8,//地图的透明度
      }
    },
    series: [
      {
        type: 'lines',//航线的系列
        data: [
          {
            coords: [
              [116.405285, 39.904989],//起点坐标
              [119.306239, 26.075302]//终点坐标
            ],
            lineStyle: {
              color: '#000',//线的颜色
              width: 5//线的宽度
            },
          },
          {
            coords: [
              [116.405285, 39.904989],//起点坐标
              [114.298572, 30.584355]//终点坐标
            ],
            lineStyle: {
              color: '#000',//线的颜色
              width: 5//线的宽度
            },
          }
        ],
        effect: {
          show: true,
          symbol: 'circle',
          color: 'red',
          symbolSize: 5,
        }
      }
    ]
  })
})
</script>

<style scoped>

</style>