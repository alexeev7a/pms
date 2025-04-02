<template>
  <div :class="[sizeClass[size], bgColor, shadowClass]">
    <div v-if="title || description" :class="headerClass[size]">
      <div v-if="title" class="font-semibold" :class="titleClass[size]">{{ title }}</div>
      <div v-if="description" class="text-gray-400" :class="descClass[size]">{{ description }}</div>
    </div>
    <slot/>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: null },
  description: { type: String, default: null },
  size: { type: String, default: 'md' },
  bgColor: { type: String, default: 'bg-white' },
  shadowClass: { type: String, default: 'inset-ring inset-ring-gray-150 shadow-2xs shadow-gray-100' },
})

const sizeClass = {
  sm: 'rounded-xl p-6',
  md: 'rounded-3xl p-9',
}

const titleClass = {
  sm: 'text-base',
  md: 'text-lg',
}

const descClass = {
  sm: ' ',
  md: 'text-base ',
}

const headerClass = {
  sm: 'mb-4',
  md: 'mb-6',
}
</script>
