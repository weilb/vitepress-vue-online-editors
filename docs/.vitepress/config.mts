import { defineConfig } from 'vitepress'
import container from 'markdown-it-container'

export default defineConfig({
  title: "Vue3 for Mapbox",
  description: "Using Vue3.x、TS、Mapbox3.x for development",
  vite: {
    optimizeDeps: {
      include: ['mapbox-gl']
    },
    ssr: {
      noExternal: ['mapbox-gl']
    }
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: "Home", link: "/" }],

    sidebar: [
      {
        text: "开发指南",
        items: [
          { text: "介绍", link: "/introduction" },
          { text: "安装", link: "/installation" },
          { text: "快速开始", link: "/quick-start" },
          { text: "基础用法", link: "/usage" },
        ],
      },
      {
        text: "组件",
        items: [
          {
            text: "VmMapContainer",
            link: "/vm-map-container",
          },
        ],
      },
      {
        text: "API 参考",
        link: "/api-reference",
      },
      {
        text: "常见问题",
        link: "/faq",
      },
    ],
  },
  markdown: {
    config: (md) => {
      md.use(container, 'demo', {
        validate: function(params) {
          // 支持 :::demo 和 :::demo ComponentName 两种语法
          return params.trim().match(/^demo(\s+\w+)?$/)
        },
        render: (tokens, idx) => {
          const token = tokens[idx]

          if (token.nesting === 1) {
            // 开始标签
            const info = token.info.trim()
            const match = info.match(/^demo(\s+(\w+))?$/)
            const componentName = match && match[2] ? match[2] : ''

            if (componentName) {
              // 组件模式：返回完整的组件
              return `<DemoBlock component="${componentName}">
                        <template #preview>
                          <${componentName} />
                        </template>
                      </DemoBlock>`;
            } else {
              // 代码模式：开始标签
              const content = tokens[idx + 1] ? tokens[idx + 1].content.replace(/"/g, '&quot;') : '';
              return `<DemoBlock code="${content}">
                        <template #preview>`;
            }
          } else if (token.nesting === -1) {
            // 结束标签：需要判断是组件模式还是代码模式
            // 通过查找对应的开始标签来判断
            let openTokenIdx = idx - 1;
            while (openTokenIdx >= 0 && tokens[openTokenIdx].nesting !== 1) {
              openTokenIdx--;
            }

            if (openTokenIdx >= 0) {
              const openToken = tokens[openTokenIdx];
              const info = openToken.info.trim();
              const match = info.match(/^demo(\s+(\w+))?$/);
              const componentName = match && match[2] ? match[2] : '';

              if (componentName) {
                // 组件模式：返回空字符串
                return '';
              }
            }

            // 代码模式：返回结束标签
            return `  </template>
                      </DemoBlock>`;
          }

          return '';
        },
      });
    },
  },
});
