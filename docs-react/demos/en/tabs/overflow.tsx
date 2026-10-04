import { Tabs, TabsContent, TabsList, TabsTrigger, Text } from '@hina-ui/react'

const genres = [
  'Sci-fi',
  'Mystery',
  'Slice of life',
  'School',
  'Healing',
  'Fantasy',
  'Detective',
  'Romance',
  'Historical',
  'War',
]

export default function Demo() {
  return (
    <Tabs defaultValue="Sci-fi" className="w-full max-w-sm">
      <TabsList label="Genre">
        {genres.map(genre => (
          <TabsTrigger key={genre} value={genre}>
            {genre}
          </TabsTrigger>
        ))}
      </TabsList>
      {genres.map(genre => (
        <TabsContent key={genre} value={genre}>
          <Text tone="muted" size="sm" className="block pt-4">
            Works tagged {genre}.
          </Text>
        </TabsContent>
      ))}
    </Tabs>
  )
}
