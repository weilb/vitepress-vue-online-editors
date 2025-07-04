# 使用指南

## 组件注册

### 全局注册

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import Vue3Mapbox from 'vue3-mapbox'

const app = createApp(App)
app.use(Vue3Mapbox)
app.mount('#app')
```

### 按需引入

```vue
<script setup lang="ts">
import { VmMapContainer } from 'vue3-mapbox'
</script>
```

## 常见用法

- 地图容器嵌套图层、控件等子组件
- 通过 props 配置地图参数
- 监听地图事件 