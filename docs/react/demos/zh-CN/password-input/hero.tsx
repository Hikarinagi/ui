import { PasswordInput } from '@hina-ui/react'

export default function Demo() {
  return (
    <PasswordInput
      defaultValue="hoshimi-shion"
      aria-label="密码"
      autoComplete="current-password"
      className="w-64"
    />
  )
}
