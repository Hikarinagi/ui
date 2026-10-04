'use client'

import NextLink from 'next/link'
import type { ReactNode } from 'react'
import { ArrowLeft, ArrowRight, Blocks } from 'lucide-react'
import { siGithub, siRadixui } from 'simple-icons'
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
} from '@hina-ui/react'
import { overlayScrollbars, type BrandGlyph } from '../../shared/brands'
import { BrandIcon } from './BrandIcon'
import type { TocItem } from '~/lib/markdown'
import { componentName, translator } from '~/lib/i18n'
import { categories, categoryOf, categoryPath, pages } from '~/lib/nav'
import { reactLinks } from '~/lib/links'
import { hrefFor, type Locale } from '~/lib/routes'

export interface DocsPageLink {
  label: string
  href: string
}

interface DocPageProps {
  locale: Locale
  path: string
  title: string
  description?: string
  toc?: TocItem[]
  links?: DocsPageLink[]
  actions?: ReactNode
  children?: ReactNode
}

function brand(href: string): BrandGlyph | undefined {
  const host = new URL(href).hostname
  if (host === 'github.com') return siGithub
  if (host === 'www.radix-ui.com') return siRadixui
  if (host === 'kingsora.github.io') return overlayScrollbars
  return undefined
}

export function DocPage({
  locale,
  path,
  title,
  description,
  toc,
  links,
  actions,
  children,
}: DocPageProps) {
  const t = translator(locale)
  const shown = reactLinks(links)
  const route = `/${path}`
  const category = categoryOf(route) ?? categories.find(item => categoryPath(item.slug) === route)
  const onCategoryPage = !!category && categoryPath(category.slug) === route
  const index = pages.findIndex(page => page.to === route)
  const current = pages[index]
  const prev = index > 0 ? pages[index - 1] : undefined
  const next = index >= 0 ? pages[index + 1] : undefined
  const label = (item: (typeof pages)[number]) => item.label ?? t(item.labelI18n!)
  const name = componentName(locale, current?.to)
  const pageTitle = name ? `${title} ${name}` : title
  const href = (to: string) => hrefFor(locale, to)

  return (
    <Page
      size="lg"
      aside={
        toc?.length ? (
          <PageAside label={t('page.toc')}>
            <Anchor items={toc} />
          </PageAside>
        ) : undefined
      }
    >
      {category && (
        <Breadcrumb>
          <BreadcrumbItem as={NextLink} href={href('/components')}>
            {t('nav.components')}
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {onCategoryPage ? (
            <BreadcrumbItem current>{t(`categories.${category.slug}.label`)}</BreadcrumbItem>
          ) : (
            <BreadcrumbItem as={NextLink} href={href(categoryPath(category.slug))}>
              {t(`categories.${category.slug}.label`)}
            </BreadcrumbItem>
          )}
          {!onCategoryPage && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem current>{title}</BreadcrumbItem>
            </>
          )}
        </Breadcrumb>
      )}
      <PageHeader
        eyebrow={category ? undefined : current ? t(current.group) : undefined}
        title={pageTitle}
        description={description}
        actions={
          index >= 0 ? (
            <>
              {actions}
              <IconButton
                as={prev ? NextLink : 'button'}
                href={prev ? href(prev.to) : undefined}
                disabled={!prev}
                variant="outline"
                label={prev ? `${t('page.prev')} ${label(prev)}` : t('page.noPrev')}
              >
                <ArrowLeft />
              </IconButton>
              <IconButton
                as={next ? NextLink : 'button'}
                href={next ? href(next.to) : undefined}
                disabled={!next}
                variant="outline"
                label={next ? `${t('page.next')} ${label(next)}` : t('page.noNext')}
              >
                <ArrowRight />
              </IconButton>
            </>
          ) : undefined
        }
      >
        {shown.length ? (
          <Inline gap="xs" className="pt-1">
            {shown.map(link => {
              const glyph = brand(link.href)
              return (
                <Button
                  key={link.href}
                  as="a"
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  variant="soft"
                  tone="neutral"
                  size="sm"
                  pill
                  icon={glyph ? <BrandIcon icon={glyph} /> : <Blocks />}
                >
                  {link.label}
                </Button>
              )
            })}
          </Inline>
        ) : null}
      </PageHeader>
      <Divider />
      <PageBody>{children}</PageBody>
      {(prev || next) && (
        <>
          <Divider />
          <PrevNext>
            {prev && (
              <PrevNextLink
                direction="prev"
                as={NextLink}
                href={href(prev.to)}
                label={t('page.prev')}
              >
                {label(prev)}
                <Text as="span" size="sm" tone="muted" className="mt-1 block font-normal">
                  {t(prev.i18n)}
                </Text>
              </PrevNextLink>
            )}
            {next && (
              <PrevNextLink
                direction="next"
                as={NextLink}
                href={href(next.to)}
                label={t('page.next')}
              >
                {label(next)}
                <Text as="span" size="sm" tone="muted" className="mt-1 block font-normal">
                  {t(next.i18n)}
                </Text>
              </PrevNextLink>
            )}
          </PrevNext>
        </>
      )}
    </Page>
  )
}
