'use client'

import { useEffect, useState } from 'react'
import { siGithub } from 'simple-icons'
import { Button, IconButton, NumberFormat, VisuallyHidden } from '@hina-ui/react'
import { GITHUB_API, GITHUB_URL as href } from '~/lib/github'
import { BrandIcon } from './BrandIcon'

const cacheKey = 'hn-docs-stars'
const day = 86_400_000

function cached() {
  try {
    const raw = localStorage.getItem(cacheKey)
    if (!raw) return undefined
    const { value, time } = JSON.parse(raw) as { value: number; time: number }
    return Date.now() - time < day ? value : undefined
  } catch {
    return undefined
  }
}

function remember(value: number) {
  try {
    localStorage.setItem(cacheKey, JSON.stringify({ value, time: Date.now() }))
  } catch {
    return
  }
}

export function GithubButton({ count: built, label }: { count?: number; label: string }) {
  const [fresh, setFresh] = useState<number>()
  const count = fresh ?? built

  useEffect(() => {
    const stored = cached()
    if (stored !== undefined) {
      setFresh(stored)
      return
    }
    const controller = new AbortController()
    fetch(GITHUB_API, { signal: controller.signal })
      .then(response => (response.ok ? response.json() : undefined))
      .then((payload: { stargazers_count?: number } | undefined) => {
        if (typeof payload?.stargazers_count !== 'number') return
        setFresh(payload.stargazers_count)
        remember(payload.stargazers_count)
      })
      .catch(() => undefined)
    return () => controller.abort()
  }, [])

  return (
    <>
      <Button
        as="a"
        href={href}
        target="_blank"
        rel="noreferrer"
        variant="ghost"
        tone="neutral"
        size="sm"
        className="max-md:hidden"
        icon={<BrandIcon icon={siGithub} />}
      >
        <VisuallyHidden>{label}</VisuallyHidden>
        {count !== undefined && <NumberFormat value={count} format="compact" precision={1} />}
      </Button>
      <IconButton
        as="a"
        href={href}
        target="_blank"
        rel="noreferrer"
        size="sm"
        label={label}
        tooltip={false}
        className="md:hidden"
      >
        <BrandIcon icon={siGithub} />
      </IconButton>
    </>
  )
}
