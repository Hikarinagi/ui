import { Stack, Textarea } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-full max-w-md">
      <Textarea
        invalid
        aria-label="Invalid"
        defaultValue="The synopsis must be at least twenty characters."
      />
      <Textarea
        disabled
        aria-label="Disabled"
        defaultValue="The synopsis cannot be edited during review."
      />
    </Stack>
  )
}
