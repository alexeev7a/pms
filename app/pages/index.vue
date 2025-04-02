<template lang="pug">
Card(shadowClass="shadow-xs")
  .flex.gap-2.mb-5
    UInput(
      placeholder="Поиск по шахматке"
    )
    USelectMenu.mr-2(
      v-model="categories"
      :items="categoriesItems"
      :searchInput="false"
      class="w-48 mr-2"
      valueKey="id"
      placeholder="Категории номеров"
      multiple
    )
    UPopover(:modal="true")
      UButton(
        :ui="{ leadingIcon: 'size-4' }"
        class="data-[state=open]:bg-(--ui-bg-elevated) group"
        color="neutral"
        variant="ghost"
        icon="i-lucide-settings"
      )
      template(#content)
        .p-4 Настройки вида
    UPopover(:modal="true")
      UButton(
        class="data-[state=open]:bg-(--ui-bg-elevated)"
        color="neutral"
        variant="ghost"
        icon="i-lucide-circle-help"
      )
      template(#content)
        .p-4 Подсказка по цветам и прочему

    DatePicker(
      v-model="date"
      class="ml-auto"
      :hideValue="true"
    )
    PeriodSelect(
      v-model="period"
      valueKey="id"
    )
    UButton(
      color="neutral"
      variant="ghost"
    ) Сегодня
    div
      UButton(
        class="h-9"
        color="neutral"
        variant="ghost"
        icon="i-lucide-chevron-left"
      )
      UButton(
        class="h-9"
        color="neutral"
        variant="ghost"
        icon="i-lucide-chevron-right"
      )



  .container.flex.tabular-nums.whitespace-nowrap.overflow-y-auto
    .column.border-r.border-gray-200.pr-2.sticky.z-1.left-0.bg-white
      .min-h-9
      .row.flex(
        v-for="row in rows"
        :key="`title_${row.id || row.label}`"
      )
        .py-2.pt-2.vertical-title.text-right.truncate.text-xs(
          :style="{ maxHeight: 36 * row.children.length + 'px' }"
        ) {{ row.label }}
        .grow
          .row(
            v-for="child in row.children"
            :key="`title_${child.id || child.label}`"
            :class="{ 'flex': child.children, 'p-2': !child.children }"
          )
            template(v-if="child.children")
              .p-2 {{ child.label }}
              .grow
                .row.p-2(
                  v-for="child in child.children"
                  :key="`title_${child.id || child.label}`"
                ) {{ child.label }}
            template(v-else) {{ child.label }}

    .column.pl-2
      .row.flex.sticky.top-0.bg-white
        .day.p-2(
          v-for="column in columns"
          :key="`col_${column.key}`"
        ) {{ column.title }}
      .row(
        v-for="row in rows"
        :key="`row_${row.id || row.label}`"
      )
        .row(
          v-for="child in row.children"
          :key="`row_${child.id || child.label}`"
          :class="{ 'flex': !child.children }"
        )
          template(v-if="child.children")
            .row.flex(
              v-for="child in child.children"
              :key="`row_${child.id || child.label}`"
            )
              .day.p-2(
                v-for="column in columns"
                :key="`col_${child.id || child.label}_${column.key}`"
              )
          template(v-else)
            .day.p-2(
              v-for="column in columns"
              :key="`col_${child.id || child.label}_${column.key}`"
            )

</template>

<script setup>
//import DatePicker from "~/components/DatePicker.vue";

import { add, eachDayOfInterval, format, getDay, isSameDay, startOfMonth, sub } from "date-fns"
import locale from "date-fns/locale/ru"

definePageMeta({
  title: 'Бронирования'
})

const numbers = [
  {
    label: '1001',
    category: 101,
  },
  {
    label: '1002',
    category: 101,
  },
  {
    label: '1003',
    category: 101,
  },
  {
    label: '2001',
    category: 102,
  },
  {
    label: '3001',
    category: 103,
    id: 3001,
  },
  {
    label: '3001-01',
    category: 103,
    parent: 3001,
  },
  {
    label: '3001-02',
    category: 103,
    parent: 3001,
  },
  {
    label: '3001-03',
    category: 103,
    parent: 3001,
  },
  {
    label: '3002',
    category: 103,
    id: 3002,
  },
  {
    label: '3002-01',
    category: 103,
    parent: 3002,
  },
  {
    label: '3002-02',
    category: 103,
    parent: 3002,
  },
  {
    label: '3002-03',
    category: 103,
    parent: 3002,
  },
]

const categoriesItems = ref([{
  id: 101,
  label: 'STD',
}, {
  id: 102,
  label: 'DLX',
}, {
  id: 103,
  label: 'Common',
}])
const categories = ref([101, 102, 103])
const visibleCategories = computed(() => categoriesItems.value.filter(({ id }) => categories.value.includes(id)))

const rows = computed(() => {
  const result = []

  visibleCategories.value.forEach((category) => {
    const children = numbers.filter((number) => number.category === category.id)
    const rootChildren = children.filter((number) => !number.parent)

    if (rootChildren.length !== children.length) {
      rootChildren.forEach((child) => {
        child.children = children.filter((number) => number.parent === child.id)
      })
    }

    result.push({
      ...category,
      children: rootChildren
    })
  })


  return result
})

const date = ref(new Date())
const period = ref('weekly')

const range = shallowRef({
  start: sub(date.value, { days: 1 }),
  end: add(date.value, { days: 30 }),
})

const dateRange = computed(() => eachDayOfInterval({ start: range.value.start, end: range.value.end }))

const columns = computed(() => {
  const result = []
  dateRange.value.forEach((item) => {
    //const isFirstDayMonth = isSameDay(date, startOfMonth(date))
    //const isCurrDay = isSameDay(currDay, date)
    result.push({
      key: format(item, 'dd_MM_yy'),
      title: format(item, 'eeeeee d', { locale }),
      date: item,
      /*subtitle: isFirstDayMonth ? format(date, 'd MMMM', { locale }) : format(date, 'dd.MM.yy'),
      subtitleClass: { 'text-gray-500': isFirstDayMonth || isCurrDay, 'font-semibold': isCurrDay },
      day: getDay(date),
      date,
      slot: 'price',
      class: 'text-right',
      align: 'right',*/
    })
  })
  return result
})

</script>

<style scoped lang="scss">
.container {
  max-height: calc(100vh - var(--ui-header-height) - 64px - 64px - 16px);
}

.vertical-title {
  writing-mode: sideways-lr;
}

.row {
  box-shadow: 0 1px 0 0 var(--color-gray-200);
}

.day {
  min-height: 36px;
  min-width: 100px;
}
</style>
