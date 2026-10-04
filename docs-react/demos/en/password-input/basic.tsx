import { PasswordInput } from '@hina-ui/react'

export default function Demo() {
  return (
    <PasswordInput
      defaultValue=""
      aria-label="Password"
      placeholder="Password"
      autoComplete="current-password"
      className="w-64"
    />
  )
}
