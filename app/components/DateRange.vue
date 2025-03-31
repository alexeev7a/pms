<script setup lang="ts">
import { getLocalTimeZone, CalendarDate } from '@internationalized/date'
import type { Range } from '~/types'

const selected = defineModel<Range>({ required: true })

const toCalendarDate = (date: Date) => {
  return new CalendarDate(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  )
}

const calendarRange = computed({
  get: () => ({
    start: selected.value.start ? toCalendarDate(selected.value.start) : undefined,
    end: selected.value.end ? toCalendarDate(selected.value.end) : undefined
  }),
  set: (newValue: { start: CalendarDate | null, end: CalendarDate | null }) => {
    selected.value = {
      start: newValue.start ? newValue.start.toDate(getLocalTimeZone()) : new Date(),
      end: newValue.end ? newValue.end.toDate(getLocalTimeZone()) : new Date()
    }
  }
})
</script>

<template>
  <UCalendar
    v-model="calendarRange"
    class="p-2"
    locale="ru-RU"
    :number-of-months="2"
    range
  />
</template>
