<script setup lang="ts">
  import { NuxtLink } from '#components'
  import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuLink,
    Stack,
  } from '@hina-ui/vue'

  const localePath = useLocalePath()
</script>

<template>
  <Stack class="min-h-96 w-full sm:min-h-64" align="start">
    <NavigationMenu label="主导航">
      <NavigationMenuItem value="start">
        <NavigationMenuTrigger>开始</NavigationMenuTrigger>
        <NavigationMenuContent>
          <NavigationMenuLink
            :as="NuxtLink"
            :to="localePath('/guide/installation')"
            description="安装与配置组件库"
          >
            安装
          </NavigationMenuLink>
          <NavigationMenuLink
            :as="NuxtLink"
            :to="localePath('/design/colors')"
            description="颜色角色与主题变量"
          >
            颜色
          </NavigationMenuLink>
          <NavigationMenuLink
            :as="NuxtLink"
            :to="localePath('/design/motion')"
            description="动画时长与缓动曲线"
          >
            动效
          </NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem value="components">
        <NavigationMenuTrigger>组件</NavigationMenuTrigger>
        <NavigationMenuContent class="grid w-[30rem] gap-1 sm:grid-cols-2">
          <NavigationMenuLink
            :as="NuxtLink"
            :to="localePath('/components/button')"
            description="按钮与操作反馈"
          >
            Button
          </NavigationMenuLink>
          <NavigationMenuLink
            :as="NuxtLink"
            :to="localePath('/components/dialog')"
            description="对话框与自定义内容"
          >
            Dialog
          </NavigationMenuLink>
          <NavigationMenuLink
            :as="NuxtLink"
            :to="localePath('/components/form')"
            description="表单状态与异步校验"
          >
            Form
          </NavigationMenuLink>
          <NavigationMenuLink
            :as="NuxtLink"
            :to="localePath('/components/data-table')"
            description="数据展示与列交互"
          >
            DataTable
          </NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink :as="NuxtLink" :to="localePath('/changelog')">
          变更记录
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenu>
  </Stack>
</template>
