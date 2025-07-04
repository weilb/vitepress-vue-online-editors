# VmMapContainer 地图容器

## 交互演示
:::demo DemoMap
:::

## 介绍
用于承载 Mapbox 地图的基础组件，负责地图初始化、生命周期管理及子组件挂载。

## 属性 

| 属性         | 说明           | 类型     | 默认值 |
| ------------ | -------------- | -------- | ------ |
| accessToken  | Mapbox Token   | string   | -      |
| container    | 地图容器元素   | HTMLElement | -   |
| style        | 地图样式       | string   | 'mapbox://styles/mapbox/streets-v11' |
| center       | 地图中心点     | [number, number] | [0, 0] |
| zoom         | 缩放级别       | number   | 0      |

## 事件

| 事件名 | 说明         | 触发时机 |
| ------ | ------------ | -------- |
| load   | 地图加载完成 | 地图初始化完成后 |
| error  | 地图异常     | 地图加载失败时 |

## 方法

| 方法名 | 说明         | 参数 |
| ------ | ------------ | ---- |
| addControl | 添加控件 | control: Control |
| addSource | 添加数据源 | id: string, source: Source |
| addLayer | 添加图层 | layer: Layer |

## 基础示例

```vue
<template>
  <div ref="mapContainer" style="width: 100%; height: 400px;"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import mapboxgl from 'mapbox-gl'

const mapContainer = ref(null)
let map = null

onMounted(() => {
  mapboxgl.accessToken = '你的MapboxToken'

  map = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [116.397389, 39.908722],
    zoom: 10
  })
})

onUnmounted(() => {
  if (map) map.remove()
})
</script>
```

## 注意事项

- 必须设置有效的 accessToken
- 确保在组件卸载时调用 map.remove() 清理资源
- 地图样式可以是 Mapbox 预设样式或自定义样式URL