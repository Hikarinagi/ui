<script setup lang="ts">
  import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@hina-ui/vue'
</script>

<template>
  <DescriptionList orientation="horizontal" class="max-w-md">
    <DescriptionTerm>作品名称</DescriptionTerm>
    <DescriptionDetails>狼と香辛料</DescriptionDetails>
    <DescriptionTerm>出版社</DescriptionTerm>
    <DescriptionDetails>電撃文庫</DescriptionDetails>
    <DescriptionTerm>册数</DescriptionTerm>
    <DescriptionDetails>全 7 卷</DescriptionDetails>
  </DescriptionList>
</template>
