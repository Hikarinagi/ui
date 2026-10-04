<script setup lang="ts">
  import { ref } from 'vue'
  import { Link2, Mail, MessageCircle, QrCode } from '@lucide/vue'
  import { Button, ListItem, List, Sheet, Stack, Text } from '@hina-ui/vue'

  const targets = [
    { label: '复制链接', icon: Link2 },
    { label: '发送私信', icon: MessageCircle },
    { label: '通过邮件', icon: Mail },
    { label: '生成二维码', icon: QrCode },
  ]
  const picked = ref('')
</script>

<template>
  <Stack gap="sm" align="start">
    <Sheet title="分享这篇文章" description="选择一个去处。">
      <Button variant="outline" tone="neutral">分享</Button>
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
    <Text v-if="picked" tone="muted" size="sm">选择了：{{ picked }}</Text>
  </Stack>
</template>
