'use client'

import { Sparkles } from 'lucide-react'
import { Banner, Link, type BannerNotice } from '@hina-ui/react'

const notices: (BannerNotice & { text: string; link?: string })[] = [
  { text: 'Hina UI 1.2 is out.', link: 'Read the release notes' },
  { text: 'The site will be down for maintenance on 1 March, 02:00 to 04:00.', tone: 'warning' },
  {
    text: 'Anniversary sale: 20% off every book for a limited time.',
    link: 'Learn more',
    icon: Sparkles,
  },
]

export default function Demo() {
  return (
    <Banner
      items={notices}
      closable
      renderItem={({ item }) => (
        <>
          {item.text}
          {item.link && (
            <Link href="#" underline>
              {item.link}
            </Link>
          )}
        </>
      )}
    />
  )
}
