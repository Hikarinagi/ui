import axe from 'axe-core'
import { expect } from 'vitest'

export async function expectNoA11yViolations(el: Element) {
  const results = await axe.run(el, {
    rules: {
      'color-contrast': { enabled: false },
      region: { enabled: false },
    },
  })

  const report = results.violations
    .map(v => `${v.id} (${v.impact}): ${v.help}\n  ${v.nodes.map(n => n.html).join('\n  ')}`)
    .join('\n\n')

  expect(report).toBe('')
}
