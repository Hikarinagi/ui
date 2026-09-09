<script setup lang="ts">
  import { ref } from 'vue'
  import { Input } from '@hina-ui/vue'

  const keyword = ref('狼と香辛料')
</script>

<template>
  <Input v-model="keyword" clearable aria-label="关键词" placeholder="关键词" class="w-72" />
</template>
