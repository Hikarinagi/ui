import { Blockquote, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Blockquote cite="Interview notes" className="flex max-w-lg flex-col gap-3">
      <Text>
        The first version had a single input box, and it took us three months to admit that was not
        enough.
      </Text>
      <Text>
        Every feature added since then had to answer one question first: whose time does it save.
      </Text>
    </Blockquote>
  )
}
