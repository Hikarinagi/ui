<script setup lang="ts">
  import { LineClamp, Stack } from '@hina-ui/vue'

  const synopsis =
    'Every autumn a secondhand bookseller sails north along the canal, selling a boatload of books to the towns on its banks. This year the boat has an uninvited passenger: a girl looking for a book that, by her own account, does not exist. She remembers every page of it but cannot give its title or its author. They strike a deal: she keeps his catalogue in order along the way, and he takes her to the library at the end of the canal. At every town where they moor, a reader recognises a passage she recites, and each tells a different ending.'
</script>

<template>
  <Stack class="w-full max-w-md" gap="lg">
    <LineClamp :lines="2">{{ synopsis }}</LineClamp>
    <LineClamp :lines="4">{{ synopsis }}</LineClamp>
  </Stack>
</template>
