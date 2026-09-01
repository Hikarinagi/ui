<script setup lang="ts">
  import { Card, Grid } from '@hikarinagi/ui'
</script>

<template>
  <Grid :cols="3" class="w-full max-w-md">
    <Card class="bg-emphasis col-span-2 grid h-16 place-items-center text-sm" :padded="false">
      col-span-2
    </Card>
    <Card class="bg-emphasis grid h-16 place-items-center text-sm" :padded="false">1</Card>
    <Card class="bg-emphasis col-span-3 grid h-16 place-items-center text-sm" :padded="false">
      col-span-3
    </Card>
  </Grid>
</template>
