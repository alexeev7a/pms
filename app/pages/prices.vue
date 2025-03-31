<template>
  <div class="bg-white rounded-2xl p-4 shadow-2xs">
    <div class="flex gap-2 pb-2 mb-2 border-bottom border-b border-solid border-gray-200">
      <USelectMenu v-model="rates" :items="ratesItems" valueKey="id" :searchInput="false" multiple class="w-48" placeholder="Тарифы" />
      <USelectMenu v-model="categories" :items="categoriesItems" valueKey="id" :searchInput="false" multiple class="w-48" placeholder="Категории номеров" />
      <UPopover :modal="true">
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-settings"
          class="data-[state=open]:bg-(--ui-bg-elevated) group"
          :ui="{ leadingIcon: 'size-4' }"
        />
        <template #content>
          <div class="p-4">
            <div class="text-sm text-gray-500 font-semibold mb-2">Дополнительные данные</div>
            <URadioGroup color="neutral" v-model="extraData" :items="extraDataItems" value-key="id" />
          </div>
        </template>
      </UPopover>
      <HomeDateRangePicker v-model="range" class="ml-auto" />
    </div>

    <Table :columns :data="tableData">
      <template #header:name="{ item }">
        <div class="pl-1">
          <div class="font-semibold text-gray-500">{{ item.title }}</div>
          {{ item.subtitle }}
        </div>
      </template>
      <template #header:price="{ item }">
        <div class="font-semibold text-gray-500 uppercase" :class="{'text-red-400': item.day === 6 || item.day === 0 }">{{ item.title }}</div>
        <span v-if="item.subtitleClass" :class="item.subtitleClass">
          {{ item.subtitle }}
        </span>
        <template v-else>
          {{ item.subtitle }}
        </template>
      </template>

      <template #name="{ item }">
        <div
          class="group flex items-center text-nowrap mb-px"
          :class="{' shadow-[0_-1px_0_rgba(255,255,255,0.6)]': item.type === 'restriction' || item.type === 'availability' }"
        >
          <div :class="{ [levelsPadding[item.level]]: item.level }">

            <UTooltip v-if="item.type === 'restriction'" :text="texts[item.name]">
              <span class="text-gray-400 text-sm cursor-help">&nbsp;{{ item.name }}</span>
            </UTooltip>
            <span v-else-if="item.type === 'availability'" class="text-gray-400 text-sm">&nbsp;{{ item.name }}</span>
            <div
              v-else
              class="flex items-center font-semibold"
              :class="{ 'cursor-pointer': item.children }"
              @click="item.children ? expanded[item.id] = !expanded[item.id] : null"
            >
              <UIcon
                v-if="item.children"
                :name="expanded[item.id] ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                class="size-4"
                :class="{ 'text-gray-400': expanded[item.id] }" />&nbsp;

              <span :class="{ 'text-sm': item.type !== 'rate' }">
                <template v-if="item.type === 'guest'">
                  {{ item.name }}
                  <UIcon
                    :name="item.name > 1 ? 'i-lucide-users' : 'i-lucide-user'"
                    class="size-4 align-middle -mt-0.5" />
                </template>
                <UIcon
                  v-else-if="item.type === 'extra_guest'"
                  name="i-lucide-user-plus"
                  class="size-4" />
                <template v-else>{{ item.name }}</template>
              </span>

              <UPopover v-if="item.type === 'rate'" mode="hover">
                <UIcon
                  name="i-lucide-info"
                  class="size-4 ml-1 text-gray-400" />
                <template #content>
                  <div class="p-4 text-sm">
                    <div class="font-semibold">Услуги без оплаты</div>
                    Завтрак

                    <template v-if="item.modifiers">
                      <div class="font-semibold mt-2">Правила наследования</div>
                      Уменьшить цену на 10%
                    </template>

                    <div class="font-semibold mt-2">Политика оплаты</div>
                    Полная предоплата

                    <div class="font-semibold mt-2">Политика отмены</div>
                    Невозвратный тариф

                  </div>
                </template>
              </UPopover>
            </div>

            <div
              v-if="item.restrictions && extraData === 'restrictions'"
              class="text-sm text-gray-400 cursor-pointer"
              @click="expandedRestrictions[item.id] = !expandedRestrictions[item.id]"
            >
              <UIcon
                v-if="item.children"
                :name="expandedRestrictions[item.id] ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                class="size-3 align-middle ml-0.5" />
              {{ item.restrictions.length }} {{ item.restrictions.length > 1 ? 'ограничения' : 'ограничение' }}
            </div>
          </div>

          <div
            class="text-gray-400 hover:text-gray-500 text-sm font-normal flex items-center gap-1 ml-auto px-2 cursor-pointer"
            @click="editRow(item)"
          >
            <span v-if="item.modifiers"> –{{item.modifiers.value}}%</span>
            <span v-else-if="item.price" class="tabular-nums">₽{{item.price.toLocaleString('ru')}}</span>
            <UIcon
              name="i-lucide-pencil"
              class="size-4 opacity-0 group-hover:opacity-100" />
          </div>
        </div>
      </template>

      <template #price="{ item, column }">
        <UInput
          v-if="editedCell[`${item.key}-${column.key}`]"
          v-model="editedCell[`${item.key}-${column.key}`].value"
          :placeholder="item.price"
          :loading="editedCell[`${item.key}-${column.key}`].loading"
          :disabled="editedCell[`${item.key}-${column.key}`].loading"
          :type="editedCell[`${item.key}-${column.key}`].loading ? 'text' : 'number'"
          :ui="{ leadingIcon: 'size-4', leading: 'ps-1', base: editedCell[`${item.key}-${column.key}`].loading ? 'ps-5.5 text-right' : null }"
          class="tabular-nums"
          variant="none"
          autofocus
          @blur="saveCell(item, column)"
          @keyup.enter="saveCell(item, column)"
        ></UInput>
        <div
          v-else
          class="tabular-nums px-4 cursor-pointer hover:bg-gray-100 mb-px relative"
          :class="{
            [cellColor(item, column)]: true,
            [item.type === 'restriction' || item.type === 'availability' ? 'py-1 text-xs shadow-[0_-1px_0_rgba(255,255,255,0.6)]' : 'py-4 text-sm/6']: true,
          }"
          @click="editCell(item, column)"
        >
          <template v-if="item.type === 'restriction'">
            <UIcon
              v-if="typeof (item.values?.[column.key] || item.values?.all) === 'boolean'"
              name="i-lucide-check"
              class="size-3" />
            <template v-else>
              {{ item.values?.[column.key] || item.values?.all || '-' }}
            </template>
          </template>
          <template v-else>
            {{ cellValue(item, column) }}
          </template>
        </div>
      </template>
    </Table>

    <UDrawer
      v-model:open="editRowOpended"
      v-bind="editRowParams"
      :modal="false"
      direction="right"
    >
      <template #body>
        <div class="w-lg">
          <div class="text-sm text-gray-500 font-semibold mb-2">Базовая цена</div>
          <UInput
            v-model="editRowParams.price"
            :placeholder="editRowParams.placeholder"
            type="number"
            class="tabular-nums mb-4"
            autofocus
          />

          <UTabs v-model="editPeriodTab" :items="editPeriodTabs" size="xs" :ui="{ label: 'font-semibold text-sm' }" />
          <DateRange v-if="editPeriodTab === 'period'" v-model="editRowParams.range" />
        </div>
      </template>
    </UDrawer>
  </div>

</template>

<script setup>
import { DateFormatter } from '@internationalized/date'
import { sub, add, eachDayOfInterval, getDay, format, startOfMonth, isAfter, isBefore, isSameDay } from "date-fns";
import locale from 'date-fns/locale/ru'

definePageMeta({
  title: 'Цены'
})

const period = ref('daily')
const editedCell = ref({})

const extraDataItems = [
  {
    label: 'Только цены',
    id: 'none'
  },
  {
    label: 'Показывать ограничения',
    id: 'restrictions'
  },
  {
    label: 'Показывать доступность',
    id: 'availability'
  },
]
const extraData = ref(extraDataItems[0].id)

const editPeriodTabs = [
  {
    label: 'На период',
    value: 'period'
  },
  {
    label: 'На все время',
    value: 'all'
  },
]
const editPeriodTab = ref(editPeriodTabs[0].value)

const texts = {
  'Closed': 'Закрыть продажу',
  'CTA': 'Запрет заезда',
  'CTD': 'Запрет выезда',
  'MinLOS': 'Минимальное количество дней проживания (иконка ▸ означает действие на день заезда)',
  'MaxLOS': 'Максимальное количество дней проживания (иконка ▸ означает действие на день заезда)',
  'MinAdvBooking': 'Минимальное количество дней от даты бронирования до даты заезда',
  'MaxAdvBooking': 'Максимальное количество дней от даты бронирования до даты заезда',
}

const levelsPadding = {
  1: 'pl-4',
  2: 'pl-8',
  3: 'pl-12',
}

const ratesItems = ref([{
  id: 1,
  label: 'Стандарт',
}, {
  id: 11,
  label: 'Стандарт промо',
}])
const rates = ref([1, 11])

const categoriesItems = ref([{
  id: 101,
  label: 'STD',
}, {
  id: 102,
  label: 'DLX',
}])
const categories = ref([101, 102])


const currDay = new Date()
const range = shallowRef({
  start: sub(new Date(), { days: 1 }),
  end: add(new Date(), { days: 30 }),
})

const dateRange = computed(() => {
  return eachDayOfInterval({ start: range.value.start, end: range.value.end })
})

const expanded = ref({ 1: true })
const expandedRestrictions = ref({})

const { data, status } = await useFetch('/api/customers', {
  lazy: true
})

const prices = {
  1: 10000,
  101: 10000,
  11: 9000,
  111: 9000,
  112: 8000,
  113: 7000,
  114: 6000,
}

const pricesOveride = ref({
  1: {
    '29_03_25': 20000,
    '30_03_25': 20000,
  },
  101: {
    '29_03_25': 20000,
    '30_03_25': 20000,
  }
})

const restrictions = {
  101: {
    '01_04_25': {
      type: 'Closed',
    },
    '02_04_25': {
      type: 'Closed',
    },
  }
}

const expandChildren = (container, item) => {
  console.log(item.key, rates.value)
  if (item.type === 'rate' && !rates.value.includes(item.id)) {
    return
  }
  if (item.type === 'category' && !categories.value.includes(item.key)) {
    return
  }
  container.push(item)
  if (extraData.value === 'restrictions' && item.restrictions?.length) {
    item.restrictions.forEach((restriction) => {
      restriction.level = (item.level || 0) + 1
      if (expandedRestrictions.value[item.id]) {
        expandChildren(container, {
          ...restriction,
        })
      }

    })
  }
  if (extraData.value === 'availability' && item.type === 'category') {
    container.push({
      name: 'свободных номеров',
      type: 'availability',
      level: (item.level || 0) + 1,
    })
  }
  if (expanded.value[item.id] && item.children?.length) {
    item.children.forEach((child) => {
      expandChildren(container, {
        ...child,
        level: (item.level || 0) + 1,
      })
    })
  }
}

const tableData = computed(() => {
  if (!data.value) {
    return []
  }
  const result = []

  data.value.forEach((item) => expandChildren(result, item))
  return result
})

const df = new DateFormatter('RU-RU', {
  weekday: 'short',
})

const columns = computed(() => {
  const result = [
    {
      key: 'name',
      title: 'Тариф',
      subtitle: 'Категории номеров',
      class: 'name',
      sticky: true,
    },
  ]
  dateRange.value.forEach((date) => {
    const isFirstDayMonth = isSameDay(date, startOfMonth(date))
    const isCurrDay = isSameDay(currDay, date)
    result.push({
      key: format(date, 'dd_MM_yy'),
      title: df.format(date),
      subtitle: isFirstDayMonth ? format(date, 'd MMMM', { locale }) : format(date, 'dd.MM.yy'),
      subtitleClass: { 'text-gray-500': isFirstDayMonth || isCurrDay, 'font-semibold': isCurrDay },
      day: getDay(date),
      date,
      slot: 'price',
      class: 'text-right',
      align: 'right',
    })
  })
  return result
})


const cellColor = (row, column) => {
  const red = 'bg-red-50 text-red-200'
  const closed = row.restrictions?.find(({ name }) => name === 'Closed')
  if (closed?.values[column.key]) {
    return red
  }

  const minAdv = row.restrictions?.find(({ name }) => name === 'MinAdvBooking')
  if (minAdv?.values.all) {
    if (isAfter(add(currDay, { days: minAdv.values.all }), column.date)) {
      return red
    }
  }
  const maxAdv = row.restrictions?.find(({ name }) => name === 'MaxAdvBooking')
  if (maxAdv?.values.all) {
    if (isBefore(add(currDay, { days: maxAdv.values.all }), column.date)) {
      return red
    }
  }

  if (pricesOveride.value[row.id]?.[column.key]) {
    return 'bg-amber-50'
  }

  const cta = row.restrictions?.find(({ name }) => name === 'CTA')
  if (cta?.values[column.key]) {
    return 'r-cta'
  }
  const ctd = row.restrictions?.find(({ name }) => name === 'CTD')
  if (ctd?.values[column.key]) {
    return 'r-ctd'
  }

  return ''
}

const cellValue = (row, column, asNumber) => {
  if (row.type === 'availability') {
    return Math.floor(Math.random() * (4 - 1 + 1) + 1);
  }
  const value = pricesOveride.value[row.id]?.[column.key] || prices[row.id]
  if (asNumber) {
    return value || 0
  }
  return value?.toLocaleString('ru') || '-'
}

const editCell = (row, column) => {
  editedCell.value[`${row.key}-${column.key}`] = {
    value: cellValue(row, column, true)
  }
}
const saveCell = (row, column) => {
  const cell = editedCell.value[`${row.key}-${column.key}`]
  if (!cell) {
    return
  }
  if (cell.value === cellValue(row, column, true)) {
    editedCell.value[`${row.key}-${column.key}`] = null
    return
  }
  cell.loading = true
  setTimeout(() => {
    if (!pricesOveride.value[row.key]) {
      pricesOveride.value[row.key] = {}
    }
    pricesOveride.value[row.key][column.key] = cell.value
    editedCell.value[`${row.key}-${column.key}`] = null
  }, 1200)
}

const editRowOpended = ref(false)
const editRowParams = ref({})
const editRow = (row) => {

  const title = {
    rate: (name) => `Установить цены для тарифа "${name}"`,
    category: (name) => `Установить цены для категории "${name}"`,
    guest: (name) => `Установить цены для ${name} гостей`,
    extra_guest: () => `Установить цены для дополнительного размещения`,
  }
  const description = {
    rate: () => null,
    category: (name) => `У тарифа "${name}"`,
    guest: (name) => `В категории "" тарифа ""`,
    extra_guest: () => `В категории "" тарифа ""`,
  }
  console.log(row, description[row.type](data.value.find(({ id }) => id === row.parent)?.name))

  editRowParams.value = {
    title: title[row.type](row.name),
    description: row.parent ? description[row.type](data.value.find(({ id }) => id === row.parent)?.name) : null,
    range: {...range.value},
    price: row.price,
    placeholder: row.price,
  }
  editRowOpended.value = true
}
</script>

<style scoped>
.r-cta::after, .r-ctd::after {
  top: 50%;
  margin-top: -8px;
  border: solid transparent;
  border-width: 8px;
  border-left-color: var(--color-red-200);
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.r-cta {
  box-shadow: inset 8px 0 6px -6px var(--color-red-200);
  &::after {
    left: 0;
  }
}
.r-ctd {
  box-shadow: inset -8px 0 6px -6px var(--color-red-200);
  &::after {
    right: -8px;
  }
}

.uppercase {
  min-width: 51px;
}
</style>
