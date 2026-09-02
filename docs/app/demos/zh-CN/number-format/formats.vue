<script setup lang="ts">
  import {
    DescriptionDetails,
    DescriptionList,
    DescriptionTerm,
    NumberFormat,
  } from '@hikarinagi/ui'
</script>

<template>
  <DescriptionList class="grid max-w-sm grid-cols-[6rem_1fr] gap-y-2 [&>dd]:m-0! [&>dt]:m-0!">
    <DescriptionTerm>decimal</DescriptionTerm>
    <DescriptionDetails><NumberFormat :value="1234567" /></DescriptionDetails>
    <DescriptionTerm>compact</DescriptionTerm>
    <DescriptionDetails><NumberFormat :value="1234567" format="compact" /></DescriptionDetails>
    <DescriptionTerm>percent</DescriptionTerm>
    <DescriptionDetails><NumberFormat :value="0.8642" format="percent" /></DescriptionDetails>
    <DescriptionTerm>currency</DescriptionTerm>
    <DescriptionDetails>
      <NumberFormat :value="1234.5" format="currency" currency="CNY" />
    </DescriptionDetails>
  </DescriptionList>
</template>
