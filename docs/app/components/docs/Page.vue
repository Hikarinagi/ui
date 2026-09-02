<script setup lang="ts">
  import { ArrowLeft, ArrowRight } from '@lucide/vue'
  import { siGithub } from 'simple-icons'
  import BrandIcon from '~/components/docs/BrandIcon'
  import {
    Anchor,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbSeparator,
    Button,
    Divider,
    IconButton,
    Inline,
    Page,
    PageAside,
    PageBody,
    PageHeader,
    PrevNext,
    PrevNextLink,
    Text,
    type AnchorItem,
  } from '@hina-ui/vue'
  import { NuxtLink } from '#components'
  import { categories, categoryOf, categoryPath, pages } from '~/nav'

  export interface DocsPageLink {
    label: string
    href: string
  }

  const props = defineProps<{
    title: string
    description?: string
    toc?: AnchorItem[]
    links?: DocsPageLink[]
  }>()

  const { t } = useI18n()
  const localePath = useLocalePath()
  const route = useRoute()
  const category = computed(
    () =>
      categoryOf(route.path) ??
      categories.find(item => localePath(categoryPath(item.slug)) === route.path),
  )
  const onCategoryPage = computed(
    () => !!category.value && localePath(categoryPath(category.value.slug)) === route.path,
  )
  const index = computed(() => pages.findIndex(page => localePath(page.to) === route.path))
  const current = computed(() => pages[index.value])
  const prev = computed(() => (index.value > 0 ? pages[index.value - 1] : undefined))
  const next = computed(() => (index.value >= 0 ? pages[index.value + 1] : undefined))
  const prevLabel = computed(() =>
    prev.value
      ? `${t('page.prev')} ${prev.value.label ?? t(prev.value.labelI18n)}`
      : t('page.noPrev'),
  )
  const nextLabel = computed(() =>
    next.value
      ? `${t('page.next')} ${next.value.label ?? t(next.value.labelI18n)}`
      : t('page.noNext'),
  )

  useHead({ title: props.title })
</script>

<template>
  <Page size="lg">
    <Breadcrumb v-if="category">
      <BreadcrumbItem as="span">{{ t('nav.components') }}</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem v-if="onCategoryPage" current>
        {{ t(`categories.${category.slug}.label`) }}
      </BreadcrumbItem>
      <BreadcrumbItem v-else as-child>
        <NuxtLink :to="localePath(categoryPath(category.slug))">
          {{ t(`categories.${category.slug}.label`) }}
        </NuxtLink>
      </BreadcrumbItem>
      <template v-if="!onCategoryPage">
        <BreadcrumbSeparator />
        <BreadcrumbItem current>{{ props.title }}</BreadcrumbItem>
      </template>
    </Breadcrumb>
    <PageHeader
      :eyebrow="category ? undefined : current ? t(current.group) : undefined"
      :title="props.title"
      :description="props.description"
    >
      <template v-if="!onCategoryPage" #actions>
        <slot name="actions" />
        <DocsCopyMarkdown :title="props.title" />
        <IconButton
          :as="prev ? NuxtLink : 'button'"
          :to="prev ? localePath(prev.to) : undefined"
          :disabled="!prev"
          variant="outline"
          :label="prevLabel"
        >
          <ArrowLeft />
        </IconButton>
        <IconButton
          :as="next ? NuxtLink : 'button'"
          :to="next ? localePath(next.to) : undefined"
          :disabled="!next"
          variant="outline"
          :label="nextLabel"
        >
          <ArrowRight />
        </IconButton>
      </template>
      <Inline v-if="props.links?.length" gap="xs" class="pt-1">
        <Button
          v-for="link in props.links"
          :key="link.href"
          as="a"
          :href="link.href"
          target="_blank"
          rel="noreferrer"
          variant="soft"
          tone="neutral"
          size="sm"
          pill
        >
          <template #icon>
            <BrandIcon :icon="siGithub" />
          </template>
          {{ link.label }}
        </Button>
      </Inline>
    </PageHeader>
    <Divider />
    <PageBody>
      <slot />
    </PageBody>
    <template v-if="prev || next">
      <Divider />
      <PrevNext>
        <PrevNextLink
          v-if="prev"
          direction="prev"
          :as="NuxtLink"
          :to="localePath(prev.to)"
          :label="t('page.prev')"
        >
          {{ prev.label ?? t(prev.labelI18n) }}
          <Text as="span" size="sm" tone="muted" class="mt-1 block font-normal">
            {{ t(prev.i18n) }}
          </Text>
        </PrevNextLink>
        <PrevNextLink
          v-if="next"
          direction="next"
          :as="NuxtLink"
          :to="localePath(next.to)"
          :label="t('page.next')"
        >
          {{ next.label ?? t(next.labelI18n) }}
          <Text as="span" size="sm" tone="muted" class="mt-1 block font-normal">
            {{ t(next.i18n) }}
          </Text>
        </PrevNextLink>
      </PrevNext>
    </template>
    <template v-if="props.toc?.length" #aside>
      <PageAside :label="t('page.toc')">
        <Anchor :items="props.toc" />
      </PageAside>
    </template>
  </Page>
</template>
