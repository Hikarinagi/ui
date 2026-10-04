import { FormField, Input } from '@hina-ui/react'

export default function Demo() {
  return (
    <FormField label="昵称" description="公开显示在个人页" required className="w-80">
      <Input defaultValue="" placeholder="星见书音" />
    </FormField>
  )
}
