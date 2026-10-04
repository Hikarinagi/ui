import type { ReactNode } from 'react'
import { render } from 'vitest-browser-react'

export async function mount(ui: ReactNode) {
  const screen = await render(ui)
  return { ...screen, element: screen.container.firstElementChild as HTMLElement }
}
