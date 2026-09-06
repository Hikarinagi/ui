<script setup lang="ts">
  import { Languages, Monitor, Moon, Search, Sun } from '@lucide/vue'
  import { Button, CommandPalette, IconButton, Kbd, type CommandItems } from '@hina-ui/vue'
  import index from 'virtual:docs-search'
  import { categories, categoryPath, components, guides } from '~/nav'

  const { t, locale, locales } = useI18n()
  const localePath = useLocalePath()
  const switchLocalePath = useSwitchLocalePath()
  const componentName = useComponentName()
  const colorMode = useColorMode()
  const router = useRouter()
  const route = useRoute()

  const open = ref(false)
  const search = ref('')
  const mac = ref(true)
  onMounted(() => {
    mac.value = /Mac|iPhone|iPad/.test(navigator.platform)
  })

  const go = (to: string, hash?: string) => async () => {
    const path = localePath(to)
    const samePage = !!hash && route.path === path
    await navigateTo(hash ? `${path}#${hash}` : path)
    if (samePage) document.getElementById(hash)?.scrollIntoView({ block: 'start' })
  }

  const pages = computed<CommandItems>(() => [
    {
      label: t('nav.start'),
      items: guides.map(item => ({
        id: item.to,
        label: item.label ?? t(item.labelI18n!),
        description: t(item.i18n),
        onSelect: go(item.to),
      })),
    },
    {
      label: t('search.categories'),
      items: [
        {
          id: '/components',
          label: t('nav.components'),
          description: index[locale.value]?.find(page => page.to === '/components')?.description,
          keywords: ['components'],
          onSelect: go('/components'),
        },
        ...categories.map(category => ({
          id: categoryPath(category.slug),
          label: t(`categories.${category.slug}.label`),
          description: t(`categories.${category.slug}.description`),
          keywords: [category.slug],
          onSelect: go(categoryPath(category.slug)),
        })),
      ],
    },
    ...categories.map(category => ({
      label: t(`categories.${category.slug}.label`),
      items: components
        .filter(item => item.category === category.slug)
        .map(item => ({
          id: item.to,
          label: item.label!,
          description: t(item.i18n),
          keywords: [
            componentName(item.to),
            item.to.slice(item.to.lastIndexOf('/') + 1),
            t(`categories.${category.slug}.label`),
          ].filter((keyword): keyword is string => !!keyword),
          onSelect: go(item.to),
        })),
    })),
  ])

  const sections = computed<CommandItems>(() => {
    if (!search.value.trim()) return []
    return [
      {
        label: t('search.sections'),
        items: (index[locale.value] ?? []).flatMap(page =>
          page.headings.map(heading => ({
            id: `${page.to}#${heading.id}`,
            label: heading.label,
            description: heading.parent ? `${page.title} › ${heading.parent}` : page.title,
            onSelect: go(page.to, heading.id),
          })),
        ),
      },
    ]
  })

  const actions = computed<CommandItems>(() => [
    {
      label: t('search.actions'),
      items: [
        {
          id: 'theme-system',
          label: t('theme.system'),
          description: t('theme.label'),
          icon: Monitor,
          keywords: [t('theme.label'), 'theme', 'system'],
          onSelect: () => {
            colorMode.preference = 'system'
          },
        },
        {
          id: 'theme-light',
          label: t('theme.light'),
          description: t('theme.label'),
          icon: Sun,
          keywords: [t('theme.label'), 'theme', 'light'],
          onSelect: () => {
            colorMode.preference = 'light'
          },
        },
        {
          id: 'theme-dark',
          label: t('theme.dark'),
          description: t('theme.label'),
          icon: Moon,
          keywords: [t('theme.label'), 'theme', 'dark'],
          onSelect: () => {
            colorMode.preference = 'dark'
          },
        },
        ...locales.value
          .filter(item => item.code !== locale.value)
          .map(item => ({
            id: `locale-${item.code}`,
            label: item.name ?? item.code,
            description: t('locale.label'),
            icon: Languages,
            keywords: [t('locale.label'), 'language', 'locale'],
            onSelect: () => {
              router.push(switchLocalePath(item.code))
            },
          })),
      ],
    },
  ])

  const items = computed<CommandItems>(() => [...pages.value, ...actions.value, ...sections.value])
</script>

<template>
  <CommandPalette
    v-model:open="open"
    v-model:search="search"
    :items="items"
    hotkey="mod+k"
    :label="t('search.label')"
    :placeholder="t('search.placeholder')"
  />
  <Button variant="outline" tone="neutral" size="sm" class="max-md:hidden" @click="open = true">
    <template #icon><Search /></template>
    {{ t('search.label') }}
    <Kbd>{{ mac ? '⌘K' : 'Ctrl K' }}</Kbd>
  </Button>
  <IconButton
    size="sm"
    :label="t('search.label')"
    :tooltip="false"
    class="md:hidden"
    @click="open = true"
  >
    <Search />
  </IconButton>
</template>
