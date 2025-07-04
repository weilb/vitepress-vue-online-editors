<template>
  <div class="demo-map-wrapper">
    <div ref="mapContainer" class="demo-map-container"></div>
    <div v-if="error" class="demo-map-error">{{ error }}</div>
    <div v-if="loading" class="demo-map-loading">地图加载中...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import mapboxgl from 'mapbox-gl'

const props = withDefaults(defineProps<{
  accessToken?: string
  style?: string
  center?: [number, number]
  zoom?: number
}>(), {
  accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: () => [116.397389, 39.908722],
  zoom: 12
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
      // 添加数据源
      map.addSource('beijing-point', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [116.397389, 39.908722]
          },
          properties: {
            name: '北京'
          }
        }
      })

      // 添加圆形图层
      map.addLayer({
        id: 'beijing-circle',
        type: 'circle',
        source: 'beijing-point',
        paint: {
          'circle-radius': 10,
          'circle-color': '#007cbf'
        }
      })

      // 添加标记
      const marker = new mapboxgl.Marker()
        .setLngLat([116.397389, 39.908722])
        .addTo(map)

      loading.value = false
    })
    
    map.on('error', (e) => {
      error.value = `地图加载失败: ${e.error?.message || '未知错误'}`
      loading.value = false
    })

    // 添加导航控件
    map.addControl(new mapboxgl.NavigationControl())
    
    // 添加缩放控件
    map.addControl(new mapboxgl.ScaleControl())
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
