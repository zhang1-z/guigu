<template>
  <div class="box">
    <div class="top">
      <p class="title">实时游客统计</p>
      <p class="bg"></p>
      <p class="right">可预约总量<span>99999</span></p>
    </div>
    <div class="number">
      <span v-for="item in people" :key="item">{{item}}</span>
    </div>
    <!-- 盒子将来echarts展示图形图标的节点 -->
    <div class="charts" ref="charts">123</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
//水球图拓展插件
import 'echarts-liquidfill'

const people = ref('216908人')
const charts = ref()
onMounted(() => {
  //获取echarts类的实例对象
  const myChart = echarts.init(charts.value)
  //设置实例的配置项
  myChart.setOption({
    //标题组件
    title: {
      text:'水球图',
      left: 'left'
    },
    //x|y轴组件
    xAxis: {},
    yAxis: {},
    //系列：决定你展示什么样的图形图标
    series: {
      type:'liquidFill',
      data: [0.5],
      radius: '80%'
    },
    //布局组件
    grid:{
      left:0,
      right:0,
      bottom:0,
      top:0,
    }
  })
})
</script>

<style scoped lang="scss">
.box{
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 10px;
  .top{
      margin-left: 20px;
    .title{
      color: white;
      font-size: 20px;
    }
    .bg{
      width: 68px;
      height: 7px;
      background: url(../../images/dataScreen-title.png) no-repeat;
      background-size: 100% 100%;
      margin-top: 10px;
    }
    .right{
      float: right;
      color: white;
      font-size: 20px;
      span{
        color: yellowgreen;
      }
    }
  }
  .number{
    padding: 10px;
    margin-top: 30px;
    display: flex;
    span{
      flex: 1;
      height: 50px;
      text-align: center;
      line-height: 50px;
      background: url(../../images/total.png) no-repeat;
      background-size: 100% 100%;
      color: #29fc29;
    }
  }
  .charts{
    width: 100%;
    height: 280px;
  }
}
</style>