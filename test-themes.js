// 测试可用的深色主题
import { codeToHtml } from 'shiki'

const testCode = `<template>
  <div>Hello World</div>
</template>

<script setup>
import { ref } from 'vue'
const message = ref('Hello')
</script>`

const darkThemes = [
  'one-dark-pro',
  'github-dark',
  'dark-plus',
  'monokai',
  'dracula',
  'material-theme-darker',
  'nord',
  'night-owl',
  'vitesse-dark'
]

async function testThemes() {
  for (const theme of darkThemes) {
    try {
      const html = await codeToHtml(testCode, {
        lang: 'vue',
        theme: theme
      })
      console.log(`✅ ${theme} - 可用`)
    } catch (error) {
      console.log(`❌ ${theme} - 不可用:`, error.message)
    }
  }
}

testThemes()
