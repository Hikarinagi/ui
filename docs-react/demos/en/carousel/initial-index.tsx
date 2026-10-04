'use client'

import { useState } from 'react'
import { Carousel, Image } from '@hina-ui/react'
import { dataListDemo } from '../../../../docs/app/demos/data-list'

const items = dataListDemo('en').slice(0, 5)

export default function Demo() {
  const [index, setIndex] = useState(2)

  return (
    <Carousel
      index={index}
      onIndexChange={setIndex}
      items={items}
      getKey={item => item.id}
      indicators
      label="Cover gallery"
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
