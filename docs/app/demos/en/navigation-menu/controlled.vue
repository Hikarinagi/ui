<script setup lang="ts">
  import { ref } from 'vue'
  import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuLink,
    Stack,
    Text,
  } from '@hina-ui/vue'

  const value = ref('')
</script>

<template>
  <Stack class="min-h-56 w-full" align="start">
    <Text size="sm" tone="muted">Open item: {{ value || 'None' }}</Text>
    <NavigationMenu v-model="value" label="Click to open" trigger="click">
      <NavigationMenuItem value="links">
        <NavigationMenuTrigger>Links</NavigationMenuTrigger>
        <NavigationMenuContent>
          <NavigationMenuLink href="#controlled">Close after selection</NavigationMenuLink>
          <NavigationMenuLink href="#controlled" @select.prevent>
            Stay open after selection
          </NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenu>
  </Stack>
</template>
