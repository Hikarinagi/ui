<script setup lang="ts">
  import { CodeBlock } from '@hikarinagi/ui'

  const output = `✔ 依赖安装完成
✔ 样式入口已就绪
  运行 pnpm dev 启动开发服务器`
</script>

<template>
  <CodeBlock :code="output" class="w-full max-w-xl" />
</template>
