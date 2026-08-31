<script setup lang="ts">
  import { DescriptionList, Time } from '@hikarinagi/ui'

  const value = '2026-03-14T09:30:00+08:00'
</script>

<template>
  <DescriptionList class="grid max-w-sm grid-cols-[6rem_1fr] gap-y-2 [&>dd]:m-0! [&>dt]:m-0!">
    <dt>datetime</dt>
    <dd><Time :value="value" /></dd>
    <dt>date</dt>
    <dd><Time :value="value" format="date" /></dd>
    <dt>time</dt>
    <dd><Time :value="value" format="time" /></dd>
    <dt>relative</dt>
    <dd><Time :value="value" format="relative" /></dd>
  </DescriptionList>
</template>
