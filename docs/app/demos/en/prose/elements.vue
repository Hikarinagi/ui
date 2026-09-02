<script setup lang="ts">
  import { Prose } from '@hina-ui/vue'
</script>

<template>
  <Prose class="max-w-xl">
    <p>
      A paragraph can hold
      <strong>bold text</strong>
      ,
      <a href="#elements">a link</a>
      ,
      <code>inline code</code>
      ,
      <mark>a mark</mark>
      and a
      <kbd>Ctrl</kbd>
      key.
    </p>
    <ol>
      <li>An ordered list</li>
      <li>Matching the component</li>
    </ol>
    <dl>
      <dt>Formats</dt>
      <dd>EPUB, PDF</dd>
    </dl>
    <hr />
    <table>
      <thead>
        <tr>
          <th>Volume</th>
          <th>Pages</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Volume One</td>
          <td>288</td>
        </tr>
      </tbody>
    </table>
  </Prose>
</template>
