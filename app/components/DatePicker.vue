<script setup>
import { DateFormatter, getLocalTimeZone, CalendarDate, today } from '@internationalized/date'

const selected = defineModel({ required: true })

defineProps({
  hideValue: false
})

const df = new DateFormatter('ru-RU', {
  dateStyle: 'medium'
})


const toCalendarDate = (date) => {
  return new CalendarDate(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  )
}

const calendarRange = computed({
  get: () => selected.value ? toCalendarDate(selected.value) : undefined,
  set: (newValue) => {
    selected.value = newValue ? newValue.toDate(getLocalTimeZone()) : new Date()
  }
})

</script>

<template>
  <UPopover :content="{ align: 'end' }" :modal="true">
    <UButton
      color="neutral"
      variant="ghost"
      icon="i-lucide-calendar"
      class="data-[state=open]:bg-(--ui-bg-elevated) group"
    >
      <span v-if="!hideValue" class="truncate">
        <template v-if="selected">
          {{ df.format(selected) }}
        </template>
        <template v-else>
          Pick a date
        </template>
      </span>

      <template #trailing>
        <UIcon name="i-lucide-chevron-down" class="shrink-0 text-(--ui-text-dimmed) size-5 group-data-[state=open]:rotate-180 transition-transform duration-200" />
      </template>
    </UButton>

    <template #content>
        <UCalendar
          v-model="calendarRange"
          class="p-2"
          locale="ru-RU"
          :number-of-months="2"
        />
    </template>
  </UPopover>
</template>
