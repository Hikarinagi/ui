import { LineClamp, Stack } from '@hina-ui/react'

const synopsis =
  '旧书商人每年秋天沿着运河北上，把一船的书卖给沿岸的小镇。今年船上多了一位不请自来的乘客：一个自称在找一本不存在的书的少女。她记得那本书的每一页，却说不出书名与作者。两人约定，她沿途替他整理书目，他带她到运河尽头的图书馆。每停靠一座小镇，就有一位读者认出她口中的某个段落，也各自讲出一个不同的结局。'

export default function Demo() {
  return (
    <Stack className="w-full max-w-md" gap="lg">
      <LineClamp lines={2}>{synopsis}</LineClamp>
      <LineClamp lines={4}>{synopsis}</LineClamp>
    </Stack>
  )
}
