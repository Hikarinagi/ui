import { NumberInput, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-48">
      <NumberInput
        defaultValue={1280}
        formatOptions={{ style: 'currency', currency: 'CNY' }}
        aria-label="价格"
      />
      <NumberInput
        defaultValue={0.35}
        step={0.01}
        min={0}
        max={1}
        formatOptions={{ style: 'percent' }}
        aria-label="折扣"
      />
      <NumberInput
        defaultValue={1234.5}
        locale="de-DE"
        formatOptions={{ style: 'currency', currency: 'EUR' }}
        aria-label="欧元价格"
      />
    </Stack>
  )
}
