---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Vue3 for Mapbox"
  text: "Using Vue3.x、TS、Mapbox3.x for development"
  tagline: My great project tagline
  actions:
    - theme: brand
      text: Markdown Examples
      link: /vm-map-container
    - theme: alt
      text: API Examples
      link: /vm-map-container

features:
  - title: Feature A
    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
  - title: Feature B
    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
  - title: Feature C
    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
---

**简而言之：**  
这段配置用于美化和结构化 VitePress 首页，帮助用户快速了解项目名称、技术栈、主要功能和快速入口。实际开发中应将 `features` 和 `actions` 等内容替换为项目真实信息。

## 地图演示

<DemoMap :accessToken="'pk.eyJ1Ijoid2VpbGlibyIsImEiOiJjbGhsYmQxNDgwbG5yM2VvcGpucWs4djBmIn0.3PiHYTsoCPnwQ1xa4HxgnQ'" />

