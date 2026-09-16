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
    <NavigationMenu label="Main navigation">
      <NavigationMenuItem value="start">
        <NavigationMenuTrigger>Start</NavigationMenuTrigger>
        <NavigationMenuContent>
          <NavigationMenuLink
            :as="NuxtLink"
            :to="localePath('/guide/installation')"
            description="Install and configure the library"
          >
            Installation
          </NavigationMenuLink>
          <NavigationMenuLink
            :as="NuxtLink"
            :to="localePath('/design/colors')"
            description="Color roles and theme variables"
          >
            Colors
          </NavigationMenuLink>
          <NavigationMenuLink
            :as="NuxtLink"
            :to="localePath('/design/motion')"
            description="Animation duration and easing"
          >
            Motion
          </NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem value="components">
        <NavigationMenuTrigger>Components</NavigationMenuTrigger>
        <NavigationMenuContent class="grid w-[30rem] gap-1 sm:grid-cols-2">
          <NavigationMenuLink
            :as="NuxtLink"
            :to="localePath('/components/button')"
            description="Buttons and interaction feedback"
          >
            Button
          </NavigationMenuLink>
          <NavigationMenuLink
            :as="NuxtLink"
            :to="localePath('/components/dialog')"
            description="Dialogs and custom content"
          >
            Dialog
          </NavigationMenuLink>
          <NavigationMenuLink
            :as="NuxtLink"
            :to="localePath('/components/form')"
            description="Form state and async validation"
          >
            Form
          </NavigationMenuLink>
          <NavigationMenuLink
            :as="NuxtLink"
            :to="localePath('/components/data-table')"
            description="Data display and column interactions"
          >
            DataTable
          </NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink :as="NuxtLink" :to="localePath('/changelog')">
          Changelog
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenu>
  </Stack>
</template>
