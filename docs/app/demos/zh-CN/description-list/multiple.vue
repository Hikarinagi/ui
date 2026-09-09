<script setup lang="ts">
  import { DescriptionDetails, DescriptionList, DescriptionTerm, Inline, Tag } from '@hina-ui/vue'
</script>

<template>
  <DescriptionList class="max-w-sm">
    <DescriptionTerm>作者</DescriptionTerm>
    <DescriptionDetails>支倉凍砂</DescriptionDetails>
    <DescriptionDetails>文倉十</DescriptionDetails>
    <DescriptionTerm>标签</DescriptionTerm>
    <DescriptionDetails>
      <Inline align="center">
        <Tag>科幻</Tag>
        <Tag>校园</Tag>
        <Tag>治愈</Tag>
      </Inline>
    </DescriptionDetails>
  </DescriptionList>
</template>
