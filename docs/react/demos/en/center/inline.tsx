import { ExternalLink } from 'lucide-react'
import { Center, Link, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Text className="max-w-md">
      This sentence has an{' '}
      <Center inline className="gap-1">
        <Link href="#">external link</Link>
        <ExternalLink className="size-3.5" />
      </Center>{' '}
      in the middle of it, with the icon aligned to the text.
    </Text>
  )
}
