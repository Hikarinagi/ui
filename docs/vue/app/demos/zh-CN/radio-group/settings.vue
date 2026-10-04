<script setup lang="ts">
  import { ref } from 'vue'
  import { RadioGroup } from '@hina-ui/vue'

  const visibility = ref('friends')
  const options = [
    { value: 'public', label: '公开', description: '所有人都能看到这条动态' },
    { value: 'friends', label: '仅好友', description: '只有互相关注的用户能看到' },
    { value: 'private', label: '仅自己', description: '只有你自己能看到' },
  ]
</script>

<template>
  <RadioGroup
    v-model="visibility"
    control-placement="end"
    block
    :options="options"
    aria-label="可见范围"
  />
</template>
