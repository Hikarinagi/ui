import type { HighlighterCore, ThemedToken } from 'shiki/core'

const langLoaders: Record<string, () => Promise<{ default: unknown }>> = {
  typescript: () => import('shiki/langs/typescript.mjs'),
  tsx: () => import('shiki/langs/tsx.mjs'),
  javascript: () => import('shiki/langs/javascript.mjs'),
  jsx: () => import('shiki/langs/jsx.mjs'),
  vue: () => import('shiki/langs/vue.mjs'),
  html: () => import('shiki/langs/html.mjs'),
  css: () => import('shiki/langs/css.mjs'),
  json: () => import('shiki/langs/json.mjs'),
  bash: () => import('shiki/langs/bash.mjs'),
  markdown: () => import('shiki/langs/markdown.mjs'),
  yaml: () => import('shiki/langs/yaml.mjs'),
  sql: () => import('shiki/langs/sql.mjs'),
  prisma: () => import('shiki/langs/prisma.mjs'),
  diff: () => import('shiki/langs/diff.mjs'),
}

const langAliases: Record<string, string> = {
  ts: 'typescript',
  js: 'javascript',
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  md: 'markdown',
  yml: 'yaml',
}

let core: Promise<HighlighterCore> | undefined
const loadedLangs = new Set<string>()

function getCore() {
  core ??= (async () => {
    const [{ createHighlighterCore }, { createJavaScriptRegexEngine }, light, dark] =
      await Promise.all([
        import('shiki/core'),
        import('shiki/engine/javascript'),
        import('shiki/themes/vitesse-light.mjs'),
        import('shiki/themes/vitesse-dark.mjs'),
      ])
    return createHighlighterCore({
      themes: [light.default, dark.default],
      langs: [],
      engine: createJavaScriptRegexEngine({ forgiving: true }),
    })
  })()
  return core
}

export async function tokenize(code: string, lang: string): Promise<ThemedToken[][] | null> {
  const resolved = langAliases[lang] ?? lang
  const load = langLoaders[resolved]
  if (!load) return null

  const highlighter = await getCore()
  if (!loadedLangs.has(resolved)) {
    await highlighter.loadLanguage(
      (await load()).default as Parameters<HighlighterCore['loadLanguage']>[0],
    )
    loadedLangs.add(resolved)
  }

  return highlighter.codeToTokens(code, {
    lang: resolved,
    themes: { light: 'vitesse-light', dark: 'vitesse-dark' },
    defaultColor: false,
  }).tokens
}
