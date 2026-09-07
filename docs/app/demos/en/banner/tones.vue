<script setup lang="ts">
  import { Banner, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-full">
    <Banner tone="neutral">Comments now run on the new system.</Banner>
    <Banner tone="accent">Hina UI 1.2 is out.</Banner>
    <Banner tone="info">You are reading the docs for an older version.</Banner>
    <Banner tone="success">Your email address has been verified.</Banner>
    <Banner tone="warning">The site will be down for maintenance tonight at 02:00.</Banner>
    <Banner tone="danger">Payments are temporarily unavailable. We are on it.</Banner>
    <Banner tone="accent" :icon="false">Hina UI 1.2 is out.</Banner>
  </Stack>
</template>
