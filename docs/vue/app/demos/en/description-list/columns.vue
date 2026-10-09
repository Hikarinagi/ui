<script setup lang="ts">
  import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@hina-ui/vue'
</script>

<template>
  <DescriptionList orientation="horizontal" class="max-w-md">
    <DescriptionTerm>Title</DescriptionTerm>
    <DescriptionDetails>Spice and Wolf</DescriptionDetails>
    <DescriptionTerm>Publisher</DescriptionTerm>
    <DescriptionDetails>Dengeki Bunko</DescriptionDetails>
    <DescriptionTerm>Volumes</DescriptionTerm>
    <DescriptionDetails>7 in total</DescriptionDetails>
  </DescriptionList>
</template>
