'use client'

import { Banner } from '@hina-ui/react'

const notices = [
  { text: '86 new reviews this week, 1,204 active readers.' },
  { text: 'The most popular title this week is Spice and Wolf.' },
  { text: 'Shelves can now be filtered by tag.' },
]

export default function Demo() {
  return <Banner items={notices} autoplay={4000} tone="info" renderItem={({ item }) => item.text} />
}
