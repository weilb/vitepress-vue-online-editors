import DefaultTheme from 'vitepress/theme'
import DemoMap from './components/DemoMap.vue'
import DemoMapWithMarker from './components/DemoMapWithMarker.vue'
import DemoBlock from './components/DemoBlock.vue'
import 'mapbox-gl/dist/mapbox-gl.css'
import 'animate.css'
import './global-layout.css'

export default {
  ...DefaultTheme,
  // enhanceApp 是 VitePress 提供的主题增强钩子，用于在应用初始化时进行自定义组件注册、全局配置等操作。
  enhanceApp({ app }) {
    app.component('DemoMap', DemoMap)
    app.component('DemoMapWithMarker', DemoMapWithMarker)
    app.component('DemoBlock', DemoBlock)
  }
}


