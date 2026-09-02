<script setup lang="ts">
  import { Card, Grid } from '@hikarinagi/ui'
</script>

<template>
  <Grid :cols="3" class="w-full max-w-md">
    <Card v-for="i in 6" :key="i" class="bg-inset grid h-16 place-items-center" :padded="false">
      {{ i }}
    </Card>
  </Grid>
</template>
