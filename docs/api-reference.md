# API 参考

## 全局 API

| 方法名         | 说明             | 参数         | 返回值   |
| -------------- | ---------------- | ------------ | -------- |
| useMapInstance | 获取地图实例     | -            | MapboxGL 实例 |

## 通用 Props

| 属性         | 说明           | 类型     | 默认值 |
| ------------ | -------------- | -------- | ------ |
| accessToken  | Mapbox Token   | string   | -      |
| style        | 地图样式       | string   | 'mapbox://styles/mapbox/streets-v11' |

## 通用事件

| 事件名 | 说明         | 回调参数 |
| ------ | ------------ | -------- |
| load   | 地图加载完成 | -        |
| error  | 地图异常     | Error    | 