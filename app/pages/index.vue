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


  .flex.tabular-nums.whitespace-nowrap
    .column.border-r.border-gray-200.pr-2
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
              v-for="child in child.children || []"
              :key="`row_${child.id || child.label}`"
            )
              .day.p-2(
                v-for="(day, key) in dateRange"
                :key
              ) {{ key }} - {{ format(day, 'd MMM') }}
          template(v-else)
            .day.p-2(
              v-for="(day, key) in dateRange"
              :key
            ) {{ key }} - {{ format(day, 'd MMM') }}

</template>

<script setup>
//import DatePicker from "~/components/DatePicker.vue";

import {add, eachDayOfInterval, format, sub} from "date-fns";

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

const dateRange = computed(() => {
  return eachDayOfInterval({ start: range.value.start, end: range.value.end })
})

</script>

<style scoped lang="scss">
.vertical-title {
  writing-mode: sideways-lr;
}

.row {
  box-shadow: 0 1px 0 0 var(--color-gray-200);
}
</style>
