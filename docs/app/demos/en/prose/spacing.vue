<script setup lang="ts">
  import { Card, Prose } from '@hikarinagi/ui'
</script>

<template>
  <Card padded class="w-full max-w-lg">
    <Prose>
      <h3>No margins at the ends</h3>
      <p>
        The outer margins of the first and last elements are removed, so the content sits flush with
        the padding of the card.
      </p>
    </Prose>
  </Card>
</template>
