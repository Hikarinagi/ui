import { NavLink, Stack, Text } from '@hina-ui/react'

const chapters = [
  { title: '序章', pages: '3 页' },
  { title: '第一章 雨停之后，站台上只剩下我们两个人', pages: '28 页', active: true },
  { title: '第二章 夏祭', pages: '19 页' },
  { title: '终章', pages: '6 页' },
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
