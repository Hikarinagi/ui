<script setup lang="ts">
  import appleSvg from '@lobehub/icons-static-svg/icons/apple.svg?raw'
  import githubSvg from '@lobehub/icons-static-svg/icons/github.svg?raw'
  import googleSvg from '@lobehub/icons-static-svg/icons/google-color.svg?raw'
  import { Button, Stack } from '@hikarinagi/ui'
  import RawIcon from '~/components/docs/RawIcon'

  const providers = [
    { svg: googleSvg, label: 'Sign in with Google' },
    { svg: githubSvg, label: 'Sign in with GitHub' },
    { svg: appleSvg, label: 'Sign in with Apple' },
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
