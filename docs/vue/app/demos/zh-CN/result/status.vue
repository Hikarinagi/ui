<script setup lang="ts">
  import { Grid, Result } from '@hina-ui/vue'
</script>

<template>
  <Grid :cols="2" gap="md" class="w-full max-w-2xl">
    <Result status="success" size="sm" title="已保存" description="改动已经生效。" />
    <Result status="error" size="sm" title="保存失败" description="网络中断，请稍后重试。" />
    <Result status="warning" size="sm" title="部分未保存" description="有两处改动与他人冲突。" />
    <Result status="info" size="sm" title="等待审核" description="审核通过后会通知你。" />
  </Grid>
</template>
