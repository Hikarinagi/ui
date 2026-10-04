<script setup lang="ts">
  import { ref } from 'vue'
  import { FormField, FormLayout, Input, Switch } from '@hina-ui/vue'
  const name = ref('Hina')
  const email = ref('hello@example.com')
  const sync = ref(true)
</script>
<template>
  <FormLayout
    legend="Profile settings"
    orientation="responsive"
    label-width="9rem"
    description-placement="label"
    class="w-full"
  >
    <FormField label="Display name" description="Shown on your public profile.">
      <Input v-model="name" />
    </FormField>
    <FormField
      label="Email address"
      description="Use an address that can receive notifications."
      description-placement="control"
    >
      <Input v-model="email" type="email" />
    </FormField>
    <FormField>
      <Switch
        v-model="sync"
        control-placement="end"
        block
        description="Continue where you left off on another device."
      >
        Sync reading progress
      </Switch>
    </FormField>
  </FormLayout>
</template>
