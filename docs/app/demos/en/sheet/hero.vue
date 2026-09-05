<script setup lang="ts">
  import { ref } from 'vue'
  import { Link2, Mail, MessageCircle, QrCode } from '@lucide/vue'
  import { Button, ListItem, List, Sheet, Stack, Text } from '@hina-ui/vue'

  const targets = [
    { label: 'Copy link', icon: Link2 },
    { label: 'Direct message', icon: MessageCircle },
    { label: 'Email', icon: Mail },
    { label: 'QR code', icon: QrCode },
  ]
  const picked = ref('')
</script>

<template>
  <Stack gap="sm" align="start">
    <Sheet title="Share this article" description="Pick where it goes.">
      <Button variant="outline" tone="neutral">Share</Button>
      <template #content="{ close }">
        <List>
          <ListItem v-for="target in targets" :key="target.label">
            <Button
              variant="ghost"
              tone="neutral"
              class="w-full justify-start"
              @click="((picked = target.label), close())"
            >
              <template #icon><component :is="target.icon" /></template>
              {{ target.label }}
            </Button>
          </ListItem>
        </List>
      </template>
    </Sheet>
    <Text v-if="picked" tone="muted" size="sm">Picked: {{ picked }}</Text>
  </Stack>
</template>
