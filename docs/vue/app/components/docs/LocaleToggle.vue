<script setup lang="ts">
  import { Languages } from '@lucide/vue'
  import {
    DropdownMenu,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    IconButton,
  } from '@hina-ui/vue'

  const { t, locale, locales } = useI18n()
  const switchLocalePath = useSwitchLocalePath()
  const router = useRouter()

  function changeLocale(value: string | undefined) {
    const target = locales.value.find(item => item.code === value)
    if (target) return router.push(switchLocalePath(target.code))
  }
</script>

<template>
  <DropdownMenu :label="t('locale.label')" align="end">
    <IconButton size="sm" :label="t('locale.label')" :tooltip="false">
      <Languages />
    </IconButton>
    <template #content>
      <DropdownMenuLabel>{{ t('locale.label') }}</DropdownMenuLabel>
      <DropdownMenuRadioGroup :model-value="locale" @update:model-value="changeLocale">
        <DropdownMenuRadioItem v-for="item in locales" :key="item.code" :value="item.code">
          {{ item.name }}
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </template>
  </DropdownMenu>
</template>
