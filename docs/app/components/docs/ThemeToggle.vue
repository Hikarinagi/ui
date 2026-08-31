<script setup lang="ts">
  import { Moon, Sun } from '@lucide/vue'
  import {
    DropdownMenu,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    IconButton,
  } from '@hikarinagi/ui'

  const { t } = useI18n()
  const colorMode = useColorMode()
  const mounted = ref(false)
  onMounted(() => {
    mounted.value = true
  })

  const dark = computed(() => mounted.value && colorMode.value === 'dark')
  const preference = computed({
    get: () => colorMode.preference,
    set: value => {
      colorMode.preference = value
    },
  })
</script>

<template>
  <DropdownMenu :label="t('theme.label')" align="end">
    <IconButton size="sm" :label="t('theme.label')" :tooltip="false">
      <Moon v-if="dark" />
      <Sun v-else />
    </IconButton>
    <template #content>
      <DropdownMenuLabel>{{ t('theme.label') }}</DropdownMenuLabel>
      <DropdownMenuRadioGroup v-model="preference">
        <DropdownMenuRadioItem value="light">{{ t('theme.light') }}</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="dark">{{ t('theme.dark') }}</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="system">{{ t('theme.system') }}</DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </template>
  </DropdownMenu>
</template>
