import { NavLink, Stack, Text } from '@hina-ui/react'

const chapters = [
  { title: 'Prologue', pages: '3 pages' },
  {
    title: 'Chapter 1: After the rain, only the two of us were left on the platform',
    pages: '28 pages',
    active: true,
  },
  { title: 'Chapter 2: Summer festival', pages: '19 pages' },
  { title: 'Epilogue', pages: '6 pages' },
]

export default function Demo() {
  return (
    <Stack gap="none" as="nav" className="w-full max-w-56">
      {chapters.map(chapter => (
        <NavLink
          key={chapter.title}
          href="#"
          active={chapter.active}
          trailing={
            <Text as="span" size="sm" tone="faint" className="tabular-nums">
              {chapter.pages}
            </Text>
          }
        >
          {chapter.title}
        </NavLink>
      ))}
    </Stack>
  )
}
