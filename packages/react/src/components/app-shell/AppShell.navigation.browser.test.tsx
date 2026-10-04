import { useInsertionEffect, useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { AppShell } from './AppShell'
import '../../../test/browser.css'

let mounted: Array<{ unmount: () => Promise<void> | void }> = []

afterEach(async () => {
  for (const w of mounted) await w.unmount()
  mounted = []
  history.replaceState(null, '', '/')
})

function Router({ path }: { path: string }) {
  useInsertionEffect(() => {
    if (location.pathname !== path) history.pushState(null, '', path)
  }, [path])
  return null
}

describe('AppShell · router integration', () => {
  it('closes the mobile drawer when a router pushes history inside useInsertionEffect, without scheduling updates there', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const onMobileOpenChange = vi.fn()
    let go: (path: string) => void = () => {}
    function Harness() {
      const [path, setPath] = useState('/start')
      go = setPath
      return (
        <>
          <Router path={path} />
          <AppShell
            defaultMobileOpen
            onMobileOpenChange={onMobileOpenChange}
            sidebarContent={<nav />}
          >
            <p />
          </AppShell>
        </>
      )
    }
    history.replaceState(null, '', '/start')
    const w = await render(<Harness />)
    mounted.push(w)
    go('/next')
    await vi.waitFor(() => expect(onMobileOpenChange).toHaveBeenCalledWith(false))
    expect(error.mock.calls.flat().join(' ')).not.toContain(
      'useInsertionEffect must not schedule updates',
    )
    error.mockRestore()
  })
})
