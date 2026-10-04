import { Stack, Textarea } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-full max-w-md">
      <Textarea
        defaultValue=""
        aria-label="Unbounded"
        autosize
        placeholder="Grows with the content, no limit"
      />
      <Textarea
        defaultValue=""
        aria-label="Two to five rows"
        autosize={{ minRows: 2, maxRows: 5 }}
        placeholder="Starts at two rows, stops at five, then scrolls inside"
      />
    </Stack>
  )
}
