import { vi } from 'vitest'
import { cdp } from 'vitest/browser'

const WAIT_TIMEOUT = 5000

const waitFor = vi.waitFor.bind(vi)

vi.waitFor = ((callback, options) =>
  waitFor(
    callback,
    typeof options === 'number' ? options : { timeout: WAIT_TIMEOUT, ...options },
  )) as typeof vi.waitFor

const throttle = Number(import.meta.env.HINA_TEST_CPU_THROTTLE)

if (throttle > 1)
  await (cdp() as { send(method: string, params: object): Promise<unknown> }).send(
    'Emulation.setCPUThrottlingRate',
    { rate: throttle },
  )
