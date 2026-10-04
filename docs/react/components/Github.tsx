import 'server-only'
import { GITHUB_API } from '~/lib/github'
import { translator } from '~/lib/i18n'
import type { Locale } from '~/lib/routes'
import { GithubButton } from './GithubButton'

async function stars() {
  try {
    const response = await fetch(GITHUB_API, {
      cache: 'force-cache',
      signal: AbortSignal.timeout(5000),
    })
    if (!response.ok) return undefined
    const payload = (await response.json()) as { stargazers_count?: number }
    return payload.stargazers_count
  } catch {
    return undefined
  }
}

export async function Github({ locale }: { locale: Locale }) {
  return <GithubButton count={await stars()} label={translator(locale)('nav.github')} />
}
