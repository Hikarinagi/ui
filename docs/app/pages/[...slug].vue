<script setup lang="ts">
  import type { Component } from 'vue'
  import type { AnchorItem } from '@hina-ui/vue'
  import type { DocsPageLink } from '~/components/docs/Page.vue'

  interface DocModule {
    default: Component
    title: string
    description?: string
    toc?: AnchorItem[]
    links?: DocsPageLink[]
  }

  definePageMeta({ key: route => route.path })

  const modules = import.meta.glob<DocModule>('../../content/**/*.md')

  const { locale, t } = useI18n()
  const route = useRoute()
  const slug = computed(() => {
    const value = route.params.slug
    return (Array.isArray(value) ? value : [value]).filter(Boolean).join('/')
  })

  const loadModule = modules[`../../content/${locale.value}/${slug.value}.md`]

  if (!loadModule) {
    throw createError({ statusCode: 404, statusMessage: t('page.notFound'), fatal: true })
  }

  const doc = await loadModule()
</script>

<template>
  <DocsPage :title="doc.title" :description="doc.description" :toc="doc.toc" :links="doc.links">
    <component :is="doc.default" />
  </DocsPage>
</template>
