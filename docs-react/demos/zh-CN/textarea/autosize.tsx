import { Stack, Textarea } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-full max-w-md">
      <Textarea defaultValue="" aria-label="不限行数" autosize placeholder="随内容增高，不限行数" />
      <Textarea
        defaultValue=""
        aria-label="两到五行"
        autosize={{ minRows: 2, maxRows: 5 }}
        placeholder="最少两行，最多五行，超出后在框内滚动"
      />
    </Stack>
  )
}
