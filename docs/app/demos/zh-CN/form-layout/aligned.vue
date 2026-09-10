<script setup lang="ts">
  import { ref } from 'vue'
  import { FormField, FormLayout, Input, Switch } from '@hina-ui/vue'
  const name = ref('Hina')
  const email = ref('hello@example.com')
  const sync = ref(true)
</script>
<template>
  <FormLayout
    legend="个人资料设置"
    orientation="responsive"
    label-width="9rem"
    description-placement="label"
    class="w-full"
  >
    <FormField label="显示名称" description="显示在你的公开个人资料中。">
      <Input v-model="name" />
    </FormField>
    <FormField
      label="邮箱地址"
      description="使用可以接收通知的邮箱地址。"
      description-placement="control"
    >
      <Input v-model="email" type="email" />
    </FormField>
    <FormField>
      <Switch
        v-model="sync"
        control-placement="end"
        block
        description="在其他设备上继续上次的阅读进度。"
      >
        同步阅读进度
      </Switch>
    </FormField>
  </FormLayout>
</template>
