import { FormField, Input } from '@hina-ui/react'

export default function Demo() {
  return (
    <FormField label="Nickname" description="Shown on your profile page" required className="w-80">
      <Input defaultValue="" placeholder="Hoshimi Shion" />
    </FormField>
  )
}
