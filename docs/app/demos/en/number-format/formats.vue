<script setup lang="ts">
  import { DescriptionList, NumberFormat } from '@hikarinagi/ui'
</script>

<template>
  <DescriptionList class="grid max-w-sm grid-cols-[6rem_1fr] gap-y-2 [&>dd]:m-0! [&>dt]:m-0!">
    <dt>decimal</dt>
    <dd><NumberFormat :value="1234567" /></dd>
    <dt>compact</dt>
    <dd><NumberFormat :value="1234567" format="compact" /></dd>
    <dt>percent</dt>
    <dd><NumberFormat :value="0.8642" format="percent" /></dd>
    <dt>currency</dt>
    <dd><NumberFormat :value="1234.5" format="currency" currency="CNY" /></dd>
  </DescriptionList>
</template>
