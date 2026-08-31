<script setup lang="ts">
  import { Prose } from '@hikarinagi/ui'
</script>

<template>
  <Prose class="max-w-xl">
    <p>
      段落中可以有
      <strong>加粗</strong>
      、
      <a href="#elements">链接</a>
      、
      <code>行内代码</code>
      、
      <mark>标记</mark>
      与
      <kbd>Ctrl</kbd>
      按键。
    </p>
    <ol>
      <li>有序列表</li>
      <li>与组件的呈现一致</li>
    </ol>
    <dl>
      <dt>格式</dt>
      <dd>EPUB、PDF</dd>
    </dl>
    <hr />
    <table>
      <thead>
        <tr>
          <th>卷次</th>
          <th>页数</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>第一卷</td>
          <td>288</td>
        </tr>
      </tbody>
    </table>
  </Prose>
</template>
