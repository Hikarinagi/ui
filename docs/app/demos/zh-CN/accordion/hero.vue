<script setup lang="ts">
  import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Card,
    Text,
  } from '@hikarinagi/ui'
</script>

<template>
  <Card class="w-full max-w-md">
    <Accordion default-value="submit">
      <AccordionItem value="submit">
        <AccordionTrigger>如何投稿</AccordionTrigger>
        <AccordionContent>
          <Text tone="muted" size="sm">
            登录后进入创作者中心，选择作品类型并填写资料，提交后进入审核队列。
          </Text>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="review">
        <AccordionTrigger>审核需要多久</AccordionTrigger>
        <AccordionContent>
          <Text tone="muted" size="sm">通常在三个工作日内完成，资料不全时会退回补充。</Text>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="edit">
        <AccordionTrigger>可以修改已发布的内容吗</AccordionTrigger>
        <AccordionContent>
          <Text tone="muted" size="sm">可以。修改会生成新的版本，经审核后替换当前内容。</Text>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </Card>
</template>
