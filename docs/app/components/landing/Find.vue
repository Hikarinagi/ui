<script setup lang="ts">
  import { ref } from 'vue'
  import { SearchInput } from '@hina-ui/vue'

  const { t } = useI18n()
  const query = ref('')
</script>

<template>
  <SearchInput
    v-model="query"
    :placeholder="t('landing.wall.find.placeholder')"
    :aria-label="t('landing.wall.find.label')"
    class="w-[256px]"
  />
</template>
