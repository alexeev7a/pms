<script setup>
const model = defineModel({ required: true })

const periods = [
  {
    id: 'weekly',
    label: 'Неделя',
  },
  {
    id: 'monthly',
    label: 'Месяц',
  },
]
</script>

<template>
  <USelect
    v-model="model"
    :items="periods"
    :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
    variant="ghost"
    class="data-[state=open]:bg-(--ui-bg-elevated)"
  />
</template>
