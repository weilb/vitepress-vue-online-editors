<template>
    <div class="demo-block">
        <div class="demo-preview">
            <slot name="preview"></slot>
        </div>
        <div class="demo-actions">
            <button @click="toggleCode" class="demo-button">
                {{ showCode ? '隐藏代码' : '查看代码' }}
            </button>
            <button @click="showEditorModal" class="demo-button">在线调试</button>
        </div>
        <transition
            name="code-slide"
            @enter="onEnter"
            @leave="onLeave"
        >
            <div class="demo-code" v-if="showCode">
                <div v-html="renderedMarkdown"></div>
            </div>
        </transition>

        <!-- 编辑器选择弹窗 -->
        <div v-if="showModal" class="editor-modal-overlay" @click="closeModal">
            <div class="editor-modal" @click.stop>
                <div class="modal-header">
                    <h3>选择在线编辑器</h3>
                    <button @click="closeModal" class="close-btn">&times;</button>
                </div>
                <div class="modal-content">
                    <div class="editor-options">
                        <!-- 1. 首推：Vue SFC Playground (所有浏览器) -->
                        <div
                            class="editor-option recommended"
                            @click="openWithVueSFCPlayground"
                        >
                            <div class="editor-icon">🎮</div>
                            <div class="editor-info">
                                <h4>Vue SFC Playground</h4>
                                <p>官方Vue单文件组件在线编辑器，完整Vue 3支持</p>
                                <div class="editor-tags">
                                    <span class="recommended-tag">首推</span>
                                    <span class="feature-tag">官方</span>
                                    <span class="feature-tag">Vue 3</span>
                                </div>
                            </div>
                        </div>

                        <!-- 2. 次选：StackBlitz (仅Edge浏览器显示) -->
                        <div
                            v-if="isEdgeBrowser && browserInfo.stackblitzCompatible"
                            class="editor-option secondary-recommended"
                            @click="openWithStackBlitz"
                        >
                            <div class="editor-icon">🚀</div>
                            <div class="editor-info">
                                <h4>StackBlitz</h4>
                                <p>完整Vue组件支持，直观模板代码展示</p>
                                <span class="secondary-recommended-tag">次选</span>
                                <span class="best-experience-tag">最佳体验</span>
                                <span class="feature-tag">快速依赖</span>
                            </div>
                        </div>

                        <!-- 3. 第三选择：CodePen (正常边框，不再红色) -->
                        <div
                            class="editor-option"
                            @click="openWithCodePen"
                        >
                            <div class="editor-icon">🖊️</div>
                            <div class="editor-info">
                                <h4>CodePen</h4>
                                <p>缺少直观的组件模板代码展示</p>
                                <span class="neutral-tag">可选</span>
                                <span class="feature-tag">CDN</span>
                            </div>
                        </div>

                        <!-- 4. 其他浏览器的StackBlitz (放在CodePen后面，正常边框) -->
                        <div
                            v-if="!isEdgeBrowser"
                            class="editor-option"
                            @click="openWithStackBlitz"
                        >
                            <div class="editor-icon">🚀</div>
                            <div class="editor-info">
                                <h4>StackBlitz</h4>
                                <p>完整Vue组件支持，直观模板代码展示</p>
                                <span v-if="!browserInfo.stackblitzCompatible" class="warning-tag">兼容性问题</span>
                                <span v-else class="neutral-tag">可选</span>
                                <span class="feature-tag">依赖加载</span>
                            </div>
                        </div>

                        <!-- 5. 禁用：CodeSandbox -->
                        <div
                            class="editor-option disabled"
                            style="opacity: 0.6; cursor: not-allowed;"
                        >
                            <div class="editor-icon">📦</div>
                            <div class="editor-info">
                                <h4>CodeSandbox</h4>
                                <p>暂时不可用（基础设施问题）</p>
                                <span class="disabled-tag">暂停</span>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { componentSourceMap } from './component-source-map.js'
import { openVueSFCPlayground, detectVueSFCPlaygroundCompatibility } from './vue-sfc-playground-integration.js'




// 1. 添加props接收code属性和component属性
const props = defineProps({
    code: {
        type: String,
        required: false,
        default: ''
    },
    component: {
        type: String,
        required: false,
        default: ''
    }
})

const showCode = ref(false)
const showModal = ref(false)

// 检测浏览器类型
const isEdgeBrowser = ref(false)
const isChromeBrowser = ref(false)
const isFirefoxBrowser = ref(false)
const browserInfo = ref({
  name: '',
  stackblitzCompatible: false,
  recommendedEditor: 'stackblitz'
})

// Vue SFC Playground兼容性信息
const vueSFCPlaygroundInfo = ref({
  compatible: false,
  browserName: '',
  recommendationLevel: 'not-recommended'
})

// 初始化浏览器检测
onMounted(() => {
  const userAgent = navigator.userAgent

  // 检测具体浏览器
  isEdgeBrowser.value = userAgent.includes('Edg/')
  isChromeBrowser.value = userAgent.includes('Chrome') && !userAgent.includes('Edg/')
  isFirefoxBrowser.value = userAgent.includes('Firefox')

  // 设置浏览器信息和推荐策略：SFC首推，Edge浏览器增加StackBlitz首推
  if (isEdgeBrowser.value) {
    browserInfo.value = {
      name: 'Edge',
      stackblitzCompatible: true,
      recommendedEditor: 'vue-sfc-playground', // Edge也首推SFC，但StackBlitz作为次选
      secondaryRecommended: 'stackblitz' // Edge浏览器的次选推荐
    }
  } else if (isChromeBrowser.value) {
    browserInfo.value = {
      name: 'Chrome',
      stackblitzCompatible: false,
      recommendedEditor: 'vue-sfc-playground' // 所有浏览器首推SFC
    }
  } else if (isFirefoxBrowser.value) {
    browserInfo.value = {
      name: 'Firefox',
      stackblitzCompatible: false,
      recommendedEditor: 'vue-sfc-playground' // 所有浏览器首推SFC
    }
  } else {
    browserInfo.value = {
      name: 'Unknown',
      stackblitzCompatible: false,
      recommendedEditor: 'vue-sfc-playground' // 所有浏览器首推SFC
    }
  }

  // 检测Vue SFC Playground兼容性
  vueSFCPlaygroundInfo.value = detectVueSFCPlaygroundCompatibility()
})

// 定义 toggleCode 函数
const toggleCode = () => {
  showCode.value = !showCode.value
}

// 显示编辑器选择弹窗
const showEditorModal = () => {
  showModal.value = true
}

// 关闭弹窗
const closeModal = () => {
  showModal.value = false
}

// 使用StackBlitz打开
const openWithStackBlitz = () => {
  closeModal()
  openStackBlitz()
}

// 使用CodePen打开
const openWithCodePen = () => {
  closeModal()
  openCodePenDemo()
}

// 使用Vue SFC Playground打开
const openWithVueSFCPlayground = () => {
  closeModal()
  openVueSFCPlaygroundDemo()
}





// 动画处理函数
const onEnter = (el: Element) => {
  const element = el as HTMLElement
  element.classList.add('animate__animated', 'animate__slideInDown', 'animate__faster')
}

const onLeave = (el: Element) => {
  const element = el as HTMLElement
  element.classList.add('animate__animated', 'animate__slideOutUp', 'animate__faster')
}

// 2. 添加HTML实体解码逻辑
const decodedCode = computed(() => {
    if (!props.code) return ''

    // 先解码HTML实体
    const parser = new DOMParser()
    const decoded = parser.parseFromString(props.code, 'text/html').body.textContent || props.code

    // 如果解码后还是空的，直接返回原始代码
    return decoded || props.code
})

// 3. 获取组件源码或解码后的代码
const displayCode = computed(() => {
    // 如果指定了组件名，优先使用组件源码
    if (props.component && componentSourceMap[props.component]) {
        return componentSourceMap[props.component]
    }
    // 否则使用传入的代码
    return decodedCode.value
})

// 4. 使用VitePress样式的代码高亮
const renderedMarkdown = ref('')

// 异步高亮代码
const highlightCode = async (code: string) => {
    if (!code) {
        renderedMarkdown.value = ''
        return
    }

    try {
        // 动态导入shiki进行语法高亮
        const { codeToHtml } = await import('shiki')

        const html = await codeToHtml(code, {
            lang: 'vue',
            theme: 'dark-plus'  // VS Code默认深色主题
        })

        renderedMarkdown.value = html
    } catch (error) {
        console.warn('Shiki highlighting failed, falling back to plain text:', error)
        // 降级方案：使用One Dark Pro风格的代码块样式
        renderedMarkdown.value = `<div class="language-vue demo-code-dark">
            <button title="Copy Code" class="copy"></button>
            <span class="lang">vue</span>
            <pre class="shiki one-dark-pro vp-code" tabindex="0" style="background-color: #282c34;">
                <code style="color: #abb2bf;">${escapeHtml(code)}</code>
            </pre>
        </div>`
    }
}

// 监听代码变化并重新高亮
onMounted(() => {
    if (displayCode.value) {
        highlightCode(displayCode.value)
    }
})

// 监听displayCode变化
watch(displayCode, (newCode) => {
    if (newCode) {
        highlightCode(newCode)
    }
}, { immediate: true })

// HTML转义函数
function escapeHtml(text: string): string {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
}

// 检测浏览器类型和兼容性
const getBrowserInfo = () => {
  const userAgent = navigator.userAgent
  const isEdge = userAgent.includes('Edg/')
  const isChrome = userAgent.includes('Chrome/') && !isEdge
  const isFirefox = userAgent.includes('Firefox/')
  const isWebContainerSupported = 'serviceWorker' in navigator && 'SharedArrayBuffer' in window

  return { isEdge, isChrome, isFirefox, isWebContainerSupported }
}

// 导入CodePen集成函数
import { openCodePen } from './codepen-integration.js'

// 定义 openStackBlitz 函数
const openStackBlitz = () => {
  try {
    const code = displayCode.value?.trim()

    if (!code) {
      alert('没有找到代码内容，请检查代码块是否正确')
      console.log('当前props.code:', props.code)
      console.log('当前displayCode:', displayCode.value)
      return
    }

    // 检查浏览器兼容性
    const browserInfo = getBrowserInfo()

    // 如果是Edge浏览器，直接继续；如果是其他浏览器且不支持WebContainer，则提示
    if (!browserInfo.isEdge && !browserInfo.isWebContainerSupported) {
      if (confirm('当前浏览器可能不完全支持在线编辑器，建议使用Edge浏览器。是否继续尝试？')) {
        // 继续执行
      } else {
        return
      }
    }

    // 创建StackBlitz项目文件
    const files = createStackBlitzFiles(code)

    // 使用form提交方式创建StackBlitz项目，添加URL参数来控制默认行为
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = 'https://stackblitz.com/run?file=src%2FApp.vue'
    form.target = '_blank'
    form.style.display = 'none'

    // 添加项目文件
    Object.entries(files).forEach(([filename, content]) => {
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = `project[files][${filename}]`
      input.value = content
      form.appendChild(input)
    })

    // 添加项目元数据
    const titleInput = document.createElement('input')
    titleInput.type = 'hidden'
    titleInput.name = 'project[title]'
    titleInput.value = 'Vue3 Mapbox 组件库演示'
    form.appendChild(titleInput)

    const descInput = document.createElement('input')
    descInput.type = 'hidden'
    descInput.name = 'project[description]'
    descInput.value = '基于Vue3和Mapbox的地图组件库在线演示'
    form.appendChild(descInput)

    const templateInput = document.createElement('input')
    templateInput.type = 'hidden'
    templateInput.name = 'project[template]'
    templateInput.value = 'node'
    form.appendChild(templateInput)

    document.body.appendChild(form)
    form.submit()

    // 清理
    setTimeout(() => {
      if (document.body.contains(form)) {
        document.body.removeChild(form)
      }
    }, 100)

  } catch (error) {
    console.error('StackBlitz集成错误:', error)
    alert('打开在线编辑器失败，请稍后重试')
  }
}

// 定义 openCodePenDemo 函数
const openCodePenDemo = () => {
  try {
    const code = displayCode.value?.trim()

    if (!code) {
      alert('没有找到代码内容，请检查代码块是否正确')
      console.log('当前props.code:', props.code)
      console.log('当前displayCode:', displayCode.value)
      return
    }

    // 调用CodePen集成函数
    openCodePen(code)

  } catch (error) {
    console.error('CodePen集成错误:', error)
    alert('打开CodePen失败，请稍后重试')
  }
}

// 定义 openVueSFCPlaygroundDemo 函数
const openVueSFCPlaygroundDemo = () => {
  try {
    const code = displayCode.value?.trim()

    if (!code) {
      alert('没有找到代码内容，请检查代码块是否正确')
      console.log('当前props.code:', props.code)
      console.log('当前displayCode:', displayCode.value)
      return
    }

    // 检查浏览器兼容性
    if (!vueSFCPlaygroundInfo.value.compatible) {
      if (!confirm(`当前浏览器(${vueSFCPlaygroundInfo.value.browserName})可能不完全支持Vue SFC Playground，建议使用现代浏览器。是否继续尝试？`)) {
        return
      }
    }

    // 获取组件名称
    const componentName = props.component || 'DemoComponent'

    // 调用Vue SFC Playground集成函数
    openVueSFCPlayground(componentName, code)

  } catch (error) {
    console.error('Vue SFC Playground集成错误:', error)
    alert('打开Vue SFC Playground失败，请稍后重试')
  }
}

// 创建StackBlitz项目文件
function createStackBlitzFiles(vueSFCCode: string) {
  return {
    'package.json': JSON.stringify({
      name: 'vue3-mapbox-demo',
      version: '1.0.0',
      type: 'module',
      scripts: {
        dev: 'vite --host',
        build: 'vite build',
        preview: 'vite preview --host'
      },
      dependencies: {
        vue: '3.3.4',
        'mapbox-gl': '2.15.0'
      },
      devDependencies: {
        '@vitejs/plugin-vue': '4.4.0',
        vite: '4.5.0'
      },
      stackblitz: {
        startCommand: "npm run dev"
      }
    }, null, 2),
    'vite.config.js': `import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    host: true
  },
  optimizeDeps: {
    include: ["vue", "mapbox-gl"]
  },
  define: {
    global: 'globalThis'
  }
})`,
    'index.html': `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vue3 Mapbox 演示</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"><\/script>
</body>
</html>`,
    'src/main.js': `import { createApp } from "vue"
import App from "./App.vue"
import "mapbox-gl/dist/mapbox-gl.css"
import "./style.css"

const app = createApp(App)
app.mount("#app")`,
    'src/App.vue': vueSFCCode,
    'src/style.css': `body {
  margin: 0;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: #f8f9fa;
}

#app {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  overflow: hidden;
  padding: 24px;
}

/* 地图容器样式 */
.demo-map-wrapper {
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
}

.demo-map-container {
  width: 100%;
  height: 100%;
}

.demo-map-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.9);
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  color: #666;
}

.demo-map-error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 0, 0, 0.1);
  color: #d32f2f;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
}`
  }
}

</script>

<style scoped>
.demo-block {
    margin: 2rem 0;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
}

.demo-preview {
    padding: 1rem;
    background-color: #f9fafb;
    min-height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 2;
}

.demo-actions {
    padding: 0.5rem;
    background-color: #f3f4f6;
    display: flex;
    gap: 0.5rem;
    position: relative;
    z-index: 3;
}

.demo-button {
    padding: 0.25rem 0.75rem;
    border: none;
    border-radius: 4px;
    background-color: #3b82f6;
    color: white;
    cursor: pointer;
    font-size: 0.875rem;
}

.demo-button:hover {
    background-color: #2563eb;
}

.demo-code {
    padding: 0;
    background-color: #1e1e1e;
    color: #d4d4d4;
    overflow-x: auto;
    position: relative;
    z-index: 1;
}

/* 强制VS Code Dark+主题样式 */
.demo-code :deep(.language-vue) {
    background-color: #1e1e1e !important;
    margin: 0;
}

.demo-code :deep(.shiki) {
    background-color: #1e1e1e !important;
}

.demo-code :deep(pre) {
    background-color: #282c34 !important;
    margin: 0;
    padding: 1rem;
    font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
    line-height: 1.5;
}

.demo-code :deep(code) {
    font-family: inherit;
}

.demo-code :deep(.copy) {
    background-color: #3e4451;
    border: 1px solid #4b5263;
    color: #abb2bf;
}

.demo-code :deep(.copy:hover) {
    background-color: #4b5263;
}

.demo-code :deep(.lang) {
    color: #5c6370;
}

/* 编辑器选择弹窗样式 */
.editor-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.editor-modal {
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow: hidden;
}

.modal-header {
    padding: 20px 24px 16px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
}

.close-btn {
    background: none;
    border: none;
    font-size: 24px;
    color: #6b7280;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: all 0.2s;
}

.close-btn:hover {
    background: #f3f4f6;
    color: #374151;
}

.modal-content {
    padding: 20px 24px 24px;
}

.editor-options {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
}

.editor-option {
    display: flex;
    align-items: center;
    padding: 16px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    background: #fafafa;
}

.editor-option:hover {
    border-color: #3b82f6;
    background: #f8faff;
}

.editor-option.recommended {
    border-color: #10b981;
    background: #f0fdf4;
}

.editor-option.recommended:hover {
    border-color: #059669;
    background: #ecfdf5;
}

.editor-option.secondary-recommended {
    border-color: #10b981;
    background: #f0fdf4;
}

.editor-option.secondary-recommended:hover {
    border-color: #059669;
    background: #ecfdf5;
}

.editor-option.not-recommended {
    border-color: #ef4444;
    background: #fef2f2;
    opacity: 0.8;
}

.editor-option.not-recommended:hover {
    border-color: #dc2626;
    background: #fee2e2;
    opacity: 1;
}



.editor-icon {
    font-size: 32px;
    margin-right: 16px;
    flex-shrink: 0;
}

.editor-info {
    flex: 1;
}

.editor-info h4 {
    margin: 0 0 4px 0;
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
}

.editor-info p {
    margin: 0 0 8px 0;
    font-size: 14px;
    color: #6b7280;
}

.recommended-tag {
    display: inline-block;
    background: #10b981;
    color: white;
    font-size: 12px;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 12px;
}

.secondary-recommended-tag {
    display: inline-block;
    background: #3b82f6;
    color: white;
    font-size: 12px;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 12px;
}

.warning-tag {
    display: inline-block;
    background: #f59e0b;
    color: white;
    font-size: 12px;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 12px;
}

.not-recommended-tag {
    display: inline-block;
    background: #ef4444;
    color: white;
    font-size: 12px;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 12px;
    margin-right: 6px;
}

.info-tag {
    display: inline-block;
    background: #3b82f6;
    color: white;
    font-size: 12px;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 12px;
}

.disabled-tag {
    display: inline-block;
    background: #9ca3af;
    color: white;
    font-size: 12px;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 12px;
}

.neutral-tag {
    display: inline-block;
    background: #6b7280;
    color: white;
    font-size: 12px;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 12px;
}

.feature-tag {
    display: inline-block;
    background: #8b5cf6;
    color: white;
    font-size: 12px;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 12px;
}

.best-experience-tag {
    display: inline-block;
    background: #10b981;
    color: white;
    font-size: 12px;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 12px;
}





</style>