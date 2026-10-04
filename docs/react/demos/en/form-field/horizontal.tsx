import { FormField, Input } from '@hina-ui/react'

export default function Demo() {
  return (
    <FormField
      label="Display name"
      orientation="horizontal"
      labelWidth="8rem"
      description="Shown on your public profile."
      className="w-full"
    >
      <Input defaultValue="Hina" />
    </FormField>
  )
}
