<script setup lang="ts">
  import { Languages } from '@lucide/vue'
  import {
    DropdownMenu,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    IconButton,
  } from '@hikarinagi/ui'

  const { t, locale, locales } = useI18n()
  const switchLocalePath = useSwitchLocalePath()
  const router = useRouter()
</script>

<template>
  <DropdownMenu :label="t('locale.label')" align="end">
    <IconButton size="sm" :label="t('locale.label')" :tooltip="false">
      <Languages />
    </IconButton>
    <template #content>
      <DropdownMenuLabel>{{ t('locale.label') }}</DropdownMenuLabel>
      <DropdownMenuRadioGroup
        :model-value="locale"
        @update:model-value="value => router.push(switchLocalePath(value))"
      >
        <DropdownMenuRadioItem v-for="item in locales" :key="item.code" :value="item.code">
          {{ item.name }}
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </template>
  </DropdownMenu>
</template>
