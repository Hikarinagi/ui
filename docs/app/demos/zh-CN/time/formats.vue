<script setup lang="ts">
  import { DescriptionDetails, DescriptionList, DescriptionTerm, Time } from '@hikarinagi/ui'

  const value = '2026-03-14T09:30:00+08:00'
</script>

<template>
  <DescriptionList class="grid max-w-sm grid-cols-[6rem_1fr] gap-y-2 [&>dd]:m-0! [&>dt]:m-0!">
    <DescriptionTerm>datetime</DescriptionTerm>
    <DescriptionDetails><Time :value="value" /></DescriptionDetails>
    <DescriptionTerm>date</DescriptionTerm>
    <DescriptionDetails><Time :value="value" format="date" /></DescriptionDetails>
    <DescriptionTerm>time</DescriptionTerm>
    <DescriptionDetails><Time :value="value" format="time" /></DescriptionDetails>
    <DescriptionTerm>relative</DescriptionTerm>
    <DescriptionDetails><Time :value="value" format="relative" /></DescriptionDetails>
  </DescriptionList>
</template>
