<script setup lang="ts">
  import { reactive } from 'vue'
  import * as v from 'valibot'
  import { Button, Form, FormField, Input, Rating, Textarea } from '@hina-ui/vue'

  const { t } = useI18n()

  const schema = v.object({
    title: v.pipe(v.string(), v.nonEmpty(), v.maxLength(20)),
    body: v.pipe(v.string(), v.maxLength(200)),
  })

  const values = reactive({ title: '', score: 4, body: '' })
</script>

<template>
  <Form :values="values" :rules="schema" class="w-[280px]">
    <FormField name="title" :label="t('landing.wall.review.name')" required>
      <Input v-model="values.title" :placeholder="t('landing.wall.review.namePlaceholder')" />
    </FormField>
    <FormField
      name="score"
      :label="t('landing.wall.review.score')"
      :description="t('landing.wall.review.scoreHint')"
    >
      <Rating v-model="values.score" />
    </FormField>
    <FormField
      name="body"
      :label="t('landing.wall.review.body')"
      :description="t('landing.wall.review.bodyHint')"
    >
      <Textarea v-model="values.body" />
    </FormField>
    <Button type="submit" class="self-start">{{ t('landing.wall.review.submit') }}</Button>
  </Form>
</template>
