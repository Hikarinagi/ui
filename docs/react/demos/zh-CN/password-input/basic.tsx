import { PasswordInput } from '@hina-ui/react'

export default function Demo() {
  return (
    <PasswordInput
      defaultValue=""
      aria-label="密码"
      placeholder="密码"
      autoComplete="current-password"
      className="w-64"
    />
  )
}
