<script setup lang="ts">
  import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@hina-ui/vue'
</script>

<template>
  <DescriptionList class="grid max-w-md grid-cols-[8rem_1fr] gap-y-3 [&>dd]:m-0! [&>dt]:m-0!">
    <DescriptionTerm>作品名称</DescriptionTerm>
    <DescriptionDetails>狼と香辛料</DescriptionDetails>
    <DescriptionTerm>出版社</DescriptionTerm>
    <DescriptionDetails>電撃文庫</DescriptionDetails>
    <DescriptionTerm>册数</DescriptionTerm>
    <DescriptionDetails>全 7 卷</DescriptionDetails>
  </DescriptionList>
</template>
