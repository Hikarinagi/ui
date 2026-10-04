<script setup lang="ts">
  import { KeyRound } from '@lucide/vue'
  import { siGithub } from 'simple-icons'
  import { Avatar, Button, Card, Divider, Heading, Stack, Text } from '@hina-ui/vue'
  import BrandIcon from '~/components/docs/BrandIcon'

  const { t } = useI18n()
</script>

<template>
  <Card class="w-[320px]">
    <Stack gap="md" align="center">
      <Avatar size="lg" />
      <Stack gap="xs" align="center">
        <Heading :level="3" size="md">{{ t('landing.wall.signIn.title') }}</Heading>
        <Text tone="muted" size="sm" class="text-center text-balance">
          {{ t('landing.wall.signIn.body') }}
        </Text>
      </Stack>
      <Button block>
        <template #icon><KeyRound /></template>
        {{ t('landing.wall.signIn.passkey') }}
      </Button>
      <Divider class="w-full">{{ t('landing.wall.signIn.or') }}</Divider>
      <Button block variant="outline" tone="neutral">
        <template #icon><BrandIcon :icon="siGithub" /></template>
        {{ t('landing.wall.signIn.github') }}
      </Button>
    </Stack>
  </Card>
</template>
