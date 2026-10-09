<script setup lang="ts">
  import { CommandPalette, CommandPaletteInput, Inline, Tag, type CommandItems } from '@hina-ui/vue'

  const items: CommandItems = [
    { id: 'spice', label: 'Spice and Wolf', description: 'Isuna Hasekura' },
    { id: 'kino', label: "Kino's Journey", description: 'Keiichi Sigsawa' },
    { id: 'hyouka', label: 'Hyouka', description: 'Honobu Yonezawa' },
    { id: 'book-girl', label: 'Book Girl', description: 'Mizuki Nomura' },
  ]
</script>

<template>
  <CommandPalette inline :items="items" class="max-w-sm">
    <template #input>
      <Inline gap="sm" :wrap="false" class="border-line h-12 shrink-0 border-b px-4">
        <Tag>Library</Tag>
        <CommandPaletteInput placeholder="Search the library" />
      </Inline>
    </template>
  </CommandPalette>
</template>
