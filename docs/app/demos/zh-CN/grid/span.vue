<script setup lang="ts">
  import { Card, Grid } from '@hina-ui/vue'
</script>

<template>
  <Grid :cols="3" class="w-full max-w-md">
    <Card class="bg-inset col-span-2 grid h-16 place-items-center text-sm" :padded="false">
      col-span-2
    </Card>
    <Card class="bg-inset grid h-16 place-items-center text-sm" :padded="false">1</Card>
    <Card class="bg-inset col-span-3 grid h-16 place-items-center text-sm" :padded="false">
      col-span-3
    </Card>
  </Grid>
</template>
