# 快速开始

本节将指导你如何快速在项目中集成和使用 Vue3 Mapbox 组件库。

## 安装依赖

```bash
npm install vue3-mapbox mapbox-gl
```

## 最小用例

```vue
<script setup lang="ts">
import { ref } from 'vue'
</script>

<template>
  <vm-map-container :accessToken="'你的MapboxToken'" />
</template>
```

## 依赖说明
- 需提前在 [Mapbox 官网](https://account.mapbox.com/) 获取 accessToken。
- 组件库依赖 Vue3、TypeScript、MapboxGL。 