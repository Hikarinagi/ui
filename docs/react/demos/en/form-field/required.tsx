import { FormField, Input } from '@hina-ui/react'

export default function Demo() {
  return (
    <FormField label="Email" required className="w-80">
      <Input defaultValue="" type="email" />
    </FormField>
  )
}
