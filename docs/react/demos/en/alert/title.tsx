import { Alert } from '@hina-ui/react'

export default function Demo() {
  return (
    <Alert tone="warning" title="Your session is about to expire" className="w-full max-w-xl">
      Save what you are editing within five minutes, or you will need to sign in again.
    </Alert>
  )
}
