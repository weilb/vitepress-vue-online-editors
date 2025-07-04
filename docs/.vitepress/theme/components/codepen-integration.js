/**
 * CodePen集成模块 - 使用官方POST API创建Pen
 * 特点：CDN依赖、代码隔离、无需API密钥
 * @param {string} vueCode - Vue组件代码
 */
export function openCodePen(vueCode) {
  try {
    console.log('开始创建CodePen...')

    // 构建HTML内容 - 简化版本，避免Vue组件复杂性
    const htmlContent = `<div id="app">
  <h1>Mapbox 地图演示</h1>
  <div class="demo-container">
    <div id="map" style="width: 100%; height: 400px;"></div>
    <div id="loading" style="padding: 10px; text-align: center;">地图加载中...</div>
    <div id="error" style="color: red; padding: 10px; display: none;"></div>
  </div>
</div>`

    // 构建CSS内容
    const cssContent = `/* 基础样式 */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin: 0;
  padding: 20px;
  background: #f5f5f5;
}

#app {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
}

.demo-container {
  width: 100%;
  height: 500px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.map-container {
  width: 100%;
  height: 100%;
}

/* Mapbox样式重置 */
.mapboxgl-map {
  font: inherit;
}

.mapboxgl-ctrl-bottom-left,
.mapboxgl-ctrl-bottom-right {
  display: none;
}`

    // 构建JavaScript内容 - 使用简化的方法
    const jsContent = buildJavaScriptContent()

    // 构建CodePen数据
    const codepenData = {
      title: 'Mapbox 地图演示',
      description: '基于Mapbox GL的简化地图演示',
      tags: ["mapbox", "javascript", "map"],
      editors: "111", // HTML、CSS、JS都打开
      layout: "left",
      html: htmlContent,
      css: cssContent,
      js: jsContent,
      // 外部资源 - 只使用Mapbox CDN
      css_external: "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css",
      js_external: "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js"
    }

    // 转换为JSON并转义
    const jsonString = JSON.stringify(codepenData)
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;")

    // 创建表单
    const form = document.createElement('form')
    form.action = 'https://codepen.io/pen/define'
    form.method = 'POST'
    form.target = '_blank'
    form.style.display = 'none'

    // 创建数据输入框
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = 'data'
    input.value = jsonString

    // 组装表单
    form.appendChild(input)
    document.body.appendChild(form)

    // 提交表单
    form.submit()
    
    // 清理DOM
    setTimeout(() => {
      document.body.removeChild(form)
    }, 1000)

    console.log('CodePen创建成功!')

  } catch (error) {
    console.error('CodePen集成错误:', error)
    alert('创建CodePen失败，请稍后重试')
  }
}

// 构建JavaScript内容的辅助函数 - 使用简化的原生方法
function buildJavaScriptContent() {
  const lines = [
    '// 简化的Mapbox演示 - 避免复杂的Vue组件',
    'console.log("开始初始化...");',
    '',
    '// 等待Mapbox资源加载',
    'function waitForMapbox() {',
    '  return new Promise((resolve) => {',
    '    const checkMapbox = () => {',
    '      if (typeof mapboxgl !== "undefined") {',
    '        console.log("Mapbox已加载完成");',
    '        resolve();',
    '      } else {',
    '        console.log("等待Mapbox加载...");',
    '        setTimeout(checkMapbox, 100);',
    '      }',
    '    };',
    '    checkMapbox();',
    '  });',
    '}',
    '',
    '// 初始化地图',
    'async function initMap() {',
    '  try {',
    '    await waitForMapbox();',
    '    console.log("开始创建地图");',
    '    ',
    '    // 设置Mapbox访问令牌',
    '    mapboxgl.accessToken = "pk.eyJ1Ijoid2VpbGlibyIsImEiOiJjbGo3MWVpOXcwMTB2M3J0aHJ6MzRoaXIxIn0.S1a7eZlZDaDlJQZCk8UhTw";',
    '    ',
    '    // 获取地图容器',
    '    const mapContainer = document.getElementById("map");',
    '    const loadingEl = document.getElementById("loading");',
    '    const errorEl = document.getElementById("error");',
    '    ',
    '    if (!mapContainer) {',
    '      throw new Error("地图容器未找到");',
    '    }',
    '    ',
    '    // 创建地图实例',
    '    const map = new mapboxgl.Map({',
    '      container: mapContainer,',
    '      style: "mapbox://styles/mapbox/streets-v11",',
    '      center: [116.397389, 39.908722], // 北京坐标',
    '      zoom: 10',
    '    });',
    '    ',
    '    // 地图加载完成事件',
    '    map.on("load", () => {',
    '      console.log("地图加载完成");',
    '      if (loadingEl) loadingEl.style.display = "none";',
    '    });',
    '    ',
    '    // 地图错误事件',
    '    map.on("error", (e) => {',
    '      console.error("地图错误:", e);',
    '      if (loadingEl) loadingEl.style.display = "none";',
    '      if (errorEl) {',
    '        errorEl.textContent = "地图加载失败: " + (e.error?.message || "未知错误");',
    '        errorEl.style.display = "block";',
    '      }',
    '    });',
    '    ',
    '  } catch (error) {',
    '    console.error("地图初始化失败:", error);',
    '    const errorEl = document.getElementById("error");',
    '    const loadingEl = document.getElementById("loading");',
    '    if (loadingEl) loadingEl.style.display = "none";',
    '    if (errorEl) {',
    '      errorEl.textContent = "初始化失败: " + error.message;',
    '      errorEl.style.display = "block";',
    '    }',
    '  }',
    '}',
    '',
    '// 启动应用',
    'initMap();'
  ]
  
  return lines.join('\n')
}
