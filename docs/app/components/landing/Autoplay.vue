<script setup lang="ts">
  import { ref } from 'vue'
  import { Switch } from '@hina-ui/vue'

  const { t } = useI18n()
  const on = ref(true)
</script>

<template>
  <Switch v-model="on" :description="t('landing.wall.autoplay.hint')" class="w-[256px]">
    {{ t('landing.wall.autoplay.label') }}
  </Switch>
</template>
