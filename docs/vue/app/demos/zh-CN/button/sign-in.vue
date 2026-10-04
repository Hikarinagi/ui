<script setup lang="ts">
  import appleSvg from '@lobehub/icons-static-svg/icons/apple.svg?raw'
  import githubSvg from '@lobehub/icons-static-svg/icons/github.svg?raw'
  import googleSvg from '@lobehub/icons-static-svg/icons/google-color.svg?raw'
  import { Button, Stack } from '@hina-ui/vue'
  import RawIcon from '~/components/docs/RawIcon'

  const providers = [
    { svg: googleSvg, label: '使用 Google 登录' },
    { svg: githubSvg, label: '使用 GitHub 登录' },
    { svg: appleSvg, label: '使用 Apple 登录' },
  ]
</script>

<template>
  <Stack gap="sm" class="w-full max-w-xs">
    <Button
      v-for="provider in providers"
      :key="provider.label"
      variant="soft"
      tone="neutral"
      block
      pill
    >
      <template #icon>
        <RawIcon :svg="provider.svg" />
      </template>
      {{ provider.label }}
    </Button>
  </Stack>
</template>
