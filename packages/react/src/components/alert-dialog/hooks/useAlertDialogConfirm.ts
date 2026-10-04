'use client'

import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'

export function useAlertDialogConfirm(
  props: { onConfirm?: () => unknown },
  open: boolean,
  setOpen: (open: boolean) => void,
  onError: (error: unknown) => void,
  blocked: () => boolean = () => false,
) {
  const [busy, setBusy] = useState(false)
  const busyRef = useRef(false)
  const latest = useRef({ props, open, setOpen, onError, blocked })
  latest.current = { props, open, setOpen, onError, blocked }

  function guard(event: Event) {
    if (busyRef.current) event.preventDefault()
  }

  async function confirm() {
    const current = latest.current
    if (!current.open || busyRef.current || current.blocked()) return
    busyRef.current = true
    setBusy(true)
    let confirmed = false
    try {
      await current.props.onConfirm?.()
      confirmed = true
    } catch (error) {
      latest.current.onError(error)
    } finally {
      busyRef.current = false
      flushSync(() => {
        if (confirmed) latest.current.setOpen(false)
        setBusy(false)
      })
    }
  }

  return { busy, guard, confirm }
}
