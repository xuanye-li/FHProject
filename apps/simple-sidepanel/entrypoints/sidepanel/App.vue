<script setup lang="ts">
import TabTitle from '@/components/TabTitle.vue'
import type { ContextMenuItem } from '@nuxt/ui'

const items = ref<ContextMenuItem[][]>([
  [
    {
      label: 'Appearance',
      children: [
        {
          label: 'System',
          icon: 'i-lucide-monitor',
        },
        {
          label: 'Light',
          icon: 'i-lucide-sun',
        },
        {
          label: 'Dark',
          icon: 'i-lucide-moon',
        },
      ],
    },
  ],
  [
    {
      label: 'Show Sidebar',
      kbds: ['meta', 's'],
    },
    {
      label: 'Show Toolbar',
      kbds: ['shift', 'meta', 'd'],
    },
    {
      label: 'Collapse Pinned Tabs',
      disabled: true,
    },
  ],
  [
    {
      label: 'Refresh the Page',
    },
    {
      label: 'Clear Cookies and Refresh',
    },
    {
      label: 'Clear Cache and Refresh',
    },
    {
      type: 'separator',
    },
    {
      label: 'Developer',
      children: [
        [
          {
            label: 'View Source',
            kbds: ['meta', 'shift', 'u'],
          },
          {
            label: 'Developer Tools',
            kbds: ['option', 'meta', 'i'],
          },
          {
            label: 'Inspect Elements',
            kbds: ['option', 'meta', 'c'],
          },
        ],
        [
          {
            label: 'JavaScript Console',
            kbds: ['option', 'meta', 'j'],
          },
        ],
      ],
    },
  ],
])
</script>

<template>
    <UApp>
        <UCard>
            <h1 class="text-lg font-bold mb-2">Side Panel</h1>
        </UCard>
        <UCard>
            Tab Title: <TabTitle />
        </UCard>
        <UCalendar color="neutral" />
        <UContextMenu
            :items="items"
            :ui="{
            content: 'w-48'
            }"
        >
            <div
            class="flex items-center justify-center rounded-md border border-dashed border-accented text-sm aspect-video w-72"
            >
            Right click here
            </div>
        </UContextMenu>
    </UApp>
</template>