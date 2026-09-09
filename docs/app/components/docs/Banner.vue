<script setup lang="ts">
  import { Puzzle } from '@lucide/vue'
  import { Banner, Link } from '@hina-ui/vue'

  defineOptions({ name: 'DocsBanner' })

  const { version, releasesUrl } = useAppConfig()
  const key = 'hn-docs-banner:preview'
  const { t } = useI18n()
  const open = ref(true)

  onPrehydrate(() => {
    document.querySelectorAll('[data-docs-banner]').forEach(el => {
      try {
        if (localStorage.getItem(el.getAttribute('data-docs-banner')!) === 'closed') {
          el.setAttribute('hidden', '')
        }
      } catch {
        return
      }
    })
  })

  function stored() {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  }

  onMounted(() => {
    if (stored() === 'closed') open.value = false
  })

  function close() {
    try {
      localStorage.setItem(key, 'closed')
    } catch {
      return
    }
  }
</script>

<template>
  <Banner v-model:open="open" :data-docs-banner="key" closable @close="close">
    <template #icon><Puzzle class="size-4 shrink-0" /></template>
    {{ t('banner.text') }}
    <Link :href="releasesUrl" target="_blank" rel="noreferrer" underline>
      {{ t('banner.link', { version }) }}
    </Link>
  </Banner>
</template>
