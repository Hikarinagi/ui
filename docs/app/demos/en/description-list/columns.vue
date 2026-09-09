<script setup lang="ts">
  import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@hina-ui/vue'
</script>

<template>
  <DescriptionList class="grid max-w-md grid-cols-[8rem_1fr] gap-y-3 [&>dd]:m-0! [&>dt]:m-0!">
    <DescriptionTerm>Title</DescriptionTerm>
    <DescriptionDetails>Spice and Wolf</DescriptionDetails>
    <DescriptionTerm>Publisher</DescriptionTerm>
    <DescriptionDetails>Dengeki Bunko</DescriptionDetails>
    <DescriptionTerm>Volumes</DescriptionTerm>
    <DescriptionDetails>7 in total</DescriptionDetails>
  </DescriptionList>
</template>
