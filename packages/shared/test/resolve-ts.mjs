import { existsSync, statSync } from 'node:fs'
import { registerHooks } from 'node:module'
import { fileURLToPath } from 'node:url'

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('.') && context.parentURL?.endsWith('.ts')) {
      const url = new URL(specifier, context.parentURL)
      const path = fileURLToPath(url)
      if (existsSync(path) && statSync(path).isDirectory())
        return nextResolve(new URL(`${url.href}/index.ts`).href, context)
      if (!existsSync(path) && existsSync(`${path}.ts`))
        return nextResolve(`${url.href}.ts`, context)
    }
    return nextResolve(specifier, context)
  },
})
