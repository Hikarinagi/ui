<script setup lang="ts">
  import { Grid, Result } from '@hina-ui/vue'
</script>

<template>
  <Grid :cols="2" gap="md" class="w-full max-w-2xl">
    <Result status="success" size="sm" title="Saved" description="Your changes are live." />
    <Result
      status="error"
      size="sm"
      title="Not saved"
      description="The connection dropped; try again later."
    />
    <Result
      status="warning"
      size="sm"
      title="Partly saved"
      description="Two changes conflict with someone else's."
    />
    <Result
      status="info"
      size="sm"
      title="Awaiting review"
      description="You will be notified once it is approved."
    />
  </Grid>
</template>
