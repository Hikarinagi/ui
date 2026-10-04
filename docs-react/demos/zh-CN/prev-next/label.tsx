import { PrevNext, PrevNextLink } from '@hina-ui/react'

export default function Demo() {
  return (
    <PrevNext label="卷内翻页" className="w-full max-w-2xl">
      <PrevNextLink direction="prev" label="上一卷" href="#">
        第二卷
      </PrevNextLink>
      <PrevNextLink direction="next" label="下一卷" href="#">
        第四卷
      </PrevNextLink>
    </PrevNext>
  )
}
