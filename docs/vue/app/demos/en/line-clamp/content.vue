<script setup lang="ts">
  import { LineClamp, Text } from '@hina-ui/vue'
</script>

<template>
  <LineClamp :lines="4" class="w-full max-w-md">
    <Text size="sm" tone="muted">
      Volume one collects the first twelve chapters of the serial, from the first day at the new
      school to that year's culture festival. The dialogue was revised throughout for the book and
      three spreads were redrawn.
    </Text>
    <Text size="sm" tone="muted">
      Two unpublished short stories close the volume. One tells where the old camera came from, in
      the words of the photography club's adviser. The other is a summer side story in which the two
      wait on the roof all night to photograph a meteor shower.
    </Text>
    <Text size="sm" tone="muted">
      First printings include a postcard of the cover's line art. The digital edition has no extras,
      and its text matches the print edition.
    </Text>
  </LineClamp>
</template>
