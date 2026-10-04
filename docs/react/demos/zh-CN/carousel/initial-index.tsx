'use client'

import { useState } from 'react'
import { Carousel, Image } from '@hina-ui/react'
import { dataListDemo } from '../../data-list'

const items = dataListDemo('zh-CN').slice(0, 5)

export default function Demo() {
  const [index, setIndex] = useState(2)

  return (
    <Carousel
      index={index}
      onIndexChange={setIndex}
      items={items}
      getKey={item => item.id}
      indicators
      label="封面画廊"
      className="max-w-lg"
    >
      {({ item }) => (
        <Image
          src={item.cover.src}
          alt={item.title}
          ratio={4 / 3}
          draggable={false}
          className="rounded-xl"
        />
      )}
    </Carousel>
  )
}
