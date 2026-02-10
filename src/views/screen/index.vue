<template>
  <div class="container">
    <!-- 数据大屏展示内容区域 -->
     <div class="screen" ref="screen">
      <div class="top">
        <Top />
      </div>
      <div class="bottom">
        <div class="left">
          <tourist class="tourist"></tourist>
          <sex class="sex"></sex>
          <age class="age"></age>
        </div>
        <div class="center">
          <Map class="map"></Map>
          <Line class="line"></Line>
        </div>
        <div class="right">
          <rank class="rank"></rank>
          <year class="year"></year>
          <counter class="counter"></counter>
        </div>
      </div>
     </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Top from './components/top/index.vue'
import Tourist from './components/tourist/index.vue'
import Sex from './components/sex/index.vue'
import Age from './components/age/index.vue'
import Map from './components/map/index.vue'
import Line from './components/line/index.vue'
import Rank from './components/rank/index.vue'
import Year from './components/year/index.vue'
import Counter from './components/counter/index.vue'

//获取数据大屏展示内容盒子的DOM元素
const screen = ref()

//定义大屏缩放比列
function getScale(w=1920, h=1080) {
  const ww = window.innerWidth/w
  const wh = window.innerHeight/h
  return ww > wh? wh : ww
}
window.onresize = () => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`
}

onMounted(() => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`
})
</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  background: url(./images/bg.png) no-repeat;
  background-size: cover;
  .screen {
    position: fixed;
    width: 1920px;
    height: 1080px;
    top: 50%;
    left: 50%;
    transform-origin: left top;
    .top{
      height: 40px;
      width: 100%;
    }
    .bottom{
      display: flex;
      .right{
        margin-left: 20px;
        flex:1;
        display: flex;
        flex-direction: column;
        .rank{
          flex: 1.5;
        }
        .year{
          flex: 1;
        }
        .counter{
          flex: 1;
        }
      }
      .left{
        flex:1;
        height: 1040px;
        display: flex;
        flex-direction: column;
        .tourist{
          flex:1;
        }
        .sex{
          flex:1;
        }
        .age{
          flex:1;
        }
      }
      .center{
        flex:1.5;
        display: flex;
        flex-direction: column;
        .map{
          flex: 4;
        }
        .line{
          flex: 1;
        }
      }
    }
  }
}
</style>
