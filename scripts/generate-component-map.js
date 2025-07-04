const fs = require('fs')
const path = require('path')

function generateComponentSourceMap() {
  const componentsDir = path.resolve(__dirname, '../docs/.vitepress/theme/components')
  const outputPath = path.resolve(__dirname, '../docs/.vitepress/theme/components/component-source-map.js')
  
  console.log('扫描组件目录:', componentsDir)
  
  const components = {}
  
  try {
    const files = fs.readdirSync(componentsDir)
    
    files.forEach(file => {
      if (file.endsWith('.vue') && !file.includes('DemoBlock')) {
        const componentName = path.basename(file, '.vue')
        const filePath = path.join(componentsDir, file)
        const content = fs.readFileSync(filePath, 'utf-8')
        
        components[componentName] = content
        console.log(`✓ 已添加组件: ${componentName}`)
      }
    })
    
    const output = `// 自动生成的组件源码映射表
// 请勿手动修改此文件
export const componentSourceMap = ${JSON.stringify(components, null, 2)}
`
    
    fs.writeFileSync(outputPath, output, 'utf-8')
    console.log(`✓ 组件源码映射表已生成: ${outputPath}`)
    console.log(`✓ 共包含 ${Object.keys(components).length} 个组件`)
    
  } catch (error) {
    console.error('生成组件源码映射表失败:', error)
    process.exit(1)
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  generateComponentSourceMap()
}

module.exports = { generateComponentSourceMap }
