<script setup lang="ts">
  import { Alert, Stack } from '@hikarinagi/ui'
</script>

<template>
  <Stack class="w-full max-w-xl">
    <Alert>Saved to drafts.</Alert>
    <Alert tone="accent">A new version is available; refresh the page to try it.</Alert>
    <Alert tone="info">This page was contributed by a user and has not been reviewed yet.</Alert>
    <Alert tone="success">The article has been published.</Alert>
    <Alert tone="warning">Your session is about to expire; save your work soon.</Alert>
    <Alert tone="danger">Publishing failed; please try again later.</Alert>
    <Alert tone="success" :icon="false">The article has been published.</Alert>
  </Stack>
</template>
