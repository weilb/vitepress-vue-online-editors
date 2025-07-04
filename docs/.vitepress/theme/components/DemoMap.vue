<template>
  <div class="demo-map-wrapper">
    <div ref="mapContainer" class="demo-map-container"></div>
    <div v-if="error" class="demo-map-error">{{ error }}</div>
    <div v-if="loading" class="demo-map-loading">地图加载中...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import mapboxgl from 'mapbox-gl'

const props = withDefaults(defineProps<{
  accessToken?: string
  style?: string
  center?: [number, number]
  zoom?: number
}>(), {
  accessToken: 'pk.eyJ1Ijoid2VpbGlibyIsImEiOiJjbGo3MWVpOXcwMTB2M3J0aHJ6MzRoaXIxIn0.S1a7eZlZDaDlJQZCk8UhTw',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: () => [116.397389, 39.908722],
  zoom: 10
})

const mapContainer = ref<HTMLElement | null>(null)
const error = ref<string>('')
const loading = ref<boolean>(true)
let map: mapboxgl.Map | null = null

onMounted(() => {
  if (!mapContainer.value) {
    error.value = '地图容器未找到'
    loading.value = false
    return
  }

  try {
    mapboxgl.accessToken = props.accessToken

    map = new mapboxgl.Map({
      container: mapContainer.value,
      style: props.style,
      center: props.center,
      zoom: props.zoom
    })

    map.on('load', () => {
      loading.value = false
    })

    // map.on('error', (e) => {
    //   error.value = `地图加载失败: ${e.error?.message || '未知错误'}`
    //   loading.value = false
    // })
  } catch (err) {
    error.value = `初始化失败: ${err instanceof Error ? err.message : '未知错误'}`
    loading.value = false
  }
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})

watch(() => props.style, (newStyle) => {
  if (map && newStyle) {
    map.setStyle(newStyle)
  }
})
</script>

<style scoped>
.demo-map-wrapper {
  position: relative;
  width: 100%;
  margin-bottom: 24px;
}

.demo-map-container {
  width: 100%;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e1e5e9;
  background-color: #f8f9fa;
}

.demo-map-error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fee;
  color: #c33;
  padding: 12px 16px;
  border-radius: 4px;
  border: 1px solid #fcc;
  z-index: 10;
}

.demo-map-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  color: #666;
  padding: 12px 16px;
  border-radius: 4px;
  border: 1px solid #ddd;
  z-index: 10;
}


</style> 