'use client'

import { useState } from 'react'
import { CheckboxGroup } from '@hina-ui/react'

const options = [
  { value: 'read', label: '读取', description: '查看收藏与阅读进度' },
  { value: 'write', label: '写入', description: '修改收藏与评分' },
  { value: 'admin', label: '管理', description: '管理令牌与授权范围' },
]

export default function Demo() {
  const [scopes, setScopes] = useState<Array<string | number>>(['read'])

  return (
    <CheckboxGroup
      value={scopes}
      onValueChange={setScopes}
      controlPlacement="end"
      block
      options={options}
      aria-label="授权范围"
    />
  )
}
