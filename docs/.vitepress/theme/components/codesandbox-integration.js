import { getParameters } from 'codesandbox/lib/api/define'

/**
 * 使用官方CodeSandbox API创建sandbox
 * @param {string} vueCode - Vue组件代码
 */
export function openCodeSandbox(vueCode) {
  try {
    // 解析Vue组件代码，提取组件名
    const componentNameMatch = vueCode.match(/export\s+default\s+{[\s\S]*?name\s*:\s*['"`]([^'"`]+)['"`]/)
    const componentName = componentNameMatch ? componentNameMatch[1] : 'DemoComponent'

    // 添加Mapbox访问令牌到组件代码
    const codeWithToken = vueCode.replace(
      /accessToken:\s*['"`][^'"`]*['"`]/g,
      `accessToken: 'pk.eyJ1Ijoid2VpbGlibyIsImEiOiJjbGo3MWVpOXcwMTB2M3J0aHJ6MzRoaXIxIn0.S1a7eZlZDaDlJQZCk8UhTw'`
    )

    // 创建文件结构 - 按照官方文档格式
    const files = {
      'package.json': {
        content: JSON.stringify({
          name: `vue-mapbox-demo-${componentName.toLowerCase()}`,
          version: '1.0.0',
          description: `Vue3 + Mapbox组件演示: ${componentName}`,
          main: 'src/main.js',
          scripts: {
            dev: 'vite',
            build: 'vite build',
            preview: 'vite preview'
          },
          dependencies: {
            'vue': '^3.4.0',
            'mapbox-gl': '^3.0.0'
          },
          devDependencies: {
            '@vitejs/plugin-vue': '^5.0.0',
            'vite': '^5.0.0'
          }
        }, null, 2)
      },
      'index.html': {
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vue3 + Mapbox Demo</title>
  <link href='https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.css' rel='stylesheet' />
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>`
      },
      'vite.config.js': {
        content: `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()]
})`
      },
      'src/main.js': {
        content: `import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')`
      },
      'src/App.vue': {
        content: `<template>
  <div id="app">
    <h1>Vue3 + Mapbox 组件演示</h1>
    <div class="demo-container">
      <${componentName} />
    </div>
  </div>
</template>

<script>
import ${componentName} from './${componentName}.vue'

export default {
  name: 'App',
  components: {
    ${componentName}
  },
  mounted() {
    console.log('App mounted successfully')
    console.log('Component:', ${componentName})
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 20px;
}

.demo-container {
  margin-top: 20px;
  width: 100%;
  height: 500px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}
</style>`
      },
      [`src/${componentName}.vue`]: {
        content: codeWithToken
      }
    }

    // 使用官方API生成参数 - 移除template参数
    const parameters = getParameters({
      files
    })

    // 创建URL并打开
    const url = `https://codesandbox.io/api/v1/sandboxes/define?parameters=${parameters}`

    // 在新窗口中打开
    window.open(url, '_blank')

  } catch (error) {
    console.error('CodeSandbox集成错误:', error)
    alert('创建CodeSandbox失败，请稍后重试')
  }
}