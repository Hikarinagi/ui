import { Card, SimpleGrid } from '@hina-ui/react'

export default function Demo() {
  return (
    <SimpleGrid min="8rem" className="w-full max-w-lg">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <Card key={i} className="bg-inset grid h-16 place-items-center" padded={false}>
          {i}
        </Card>
      ))}
    </SimpleGrid>
  )
}
