import { LineClamp } from '@hina-ui/react'

export default function Demo() {
  return (
    <LineClamp expandLabel="查看全文" collapseLabel="收起全文" className="w-full max-w-md">
      读到第三卷才发现，前两卷里那些看似随手写下的天气记录全是伏笔。作者没有用任何一句解释去点破它，只是让同一段无线电通话在不同的季节里重复了三次。合上书以后我把第一卷又翻了一遍，这一次每一页都像是另一本书。推荐给喜欢慢节奏叙事的读者。
    </LineClamp>
  )
}
