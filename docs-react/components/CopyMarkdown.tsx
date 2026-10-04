'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { Check, Copy, ExternalLink } from 'lucide-react'
import { siClaude, siMarkdown } from 'simple-icons'
import {
  Button,
  ButtonGroup,
  DisclosureIcon,
  DropdownMenu,
  DropdownMenuItem,
  IconButton,
  Stack,
  Text,
} from '@hina-ui/react'
import { BrandIcon, RawIcon } from './BrandIcon'
import { translator } from '~/lib/i18n'
import type { Locale } from '~/lib/routes'

interface MenuItem {
  icon: ReactNode
  title: string
  description: string
  external?: boolean
  select: () => void
}

export function CopyMarkdown({
  locale,
  title,
  openAiSvg,
}: {
  locale: Locale
  title: string
  openAiSvg: string
}) {
  const t = translator(locale)
  const source = `${usePathname().replace(/\/$/, '')}.md`
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  async function copy() {
    const response = await fetch(source)
    await navigator.clipboard.writeText(await response.text())
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 2000)
  }

  function askIn(base: string) {
    const prompt = t('actions.prompt', { url: `${location.origin}${source}`, title })
    window.open(`${base}${encodeURIComponent(prompt)}`, '_blank')
  }

  const items: MenuItem[] = [
    {
      icon: <BrandIcon icon={siMarkdown} className="size-4 shrink-0" />,
      title: t('actions.viewMarkdown'),
      description: t('actions.openSource'),
      select: () => window.open(source, '_blank'),
    },
    {
      icon: <RawIcon svg={openAiSvg} className="size-4 shrink-0" />,
      title: t('actions.openInChatGPT'),
      description: t('actions.ask'),
      external: true,
      select: () => askIn('https://chatgpt.com/?q='),
    },
    {
      icon: <BrandIcon icon={siClaude} className="size-4 shrink-0" />,
      title: t('actions.openInClaude'),
      description: t('actions.ask'),
      external: true,
      select: () => askIn('https://claude.ai/new?q='),
    },
  ]

  return (
    <ButtonGroup label={t('actions.copyMarkdown')}>
      <Button
        variant="outline"
        tone="neutral"
        size="sm"
        icon={copied ? <Check className="text-success-text" /> : <Copy />}
        onClick={copy}
      >
        {t('actions.copyMarkdown')}
      </Button>
      <DropdownMenu
        label={t('actions.more')}
        align="end"
        className="w-80"
        content={items.map(item => (
          <DropdownMenuItem
            key={item.title}
            textValue={item.title}
            className="gap-3"
            icon={item.icon}
            trailing={
              item.external ? <ExternalLink className="text-faint size-3.5 shrink-0" /> : undefined
            }
            onSelect={() => item.select()}
          >
            <Stack gap="none" className="items-start text-start">
              <Text as="span" size="sm">
                {item.title}
              </Text>
              <Text as="span" size="xs" tone="muted">
                {item.description}
              </Text>
            </Stack>
          </DropdownMenuItem>
        ))}
      >
        <IconButton variant="outline" tone="neutral" size="sm" label={t('actions.more')}>
          <DisclosureIcon />
        </IconButton>
      </DropdownMenu>
    </ButtonGroup>
  )
}
