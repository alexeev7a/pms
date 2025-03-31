<template lang="pug">
.relative.bg-white(ref="container")
	table.w-full(ref="table")
		thead.sticky.top-0.bg-white.z-10
			tr
				th.text-xs.font-normal.text-gray-400.text-nowrap.px-4.py-3.align-top(
					v-for="column in columns"
          :ref="column.sticky ? 'columns' : null"
					:key="`th-${column.key}`"
					:class="{ 'cursor-pointer': column.sort, 'bg-white relative': column.sticky, [column.align === 'right' ? 'text-right' : 'text-left']: true }"
					@click="handleSort(column)"
				)
					i.far.mr-6(v-if="column.sort && sortedColumn.key === column.key") {{ sortedColumn.type === 'asc' ? '' : '' }}
					slot(
						:name="`header:${column.slot || column.key}`"
						:item="column"
					) {{ column.title }}
		tbody
			tr(
				v-for="(item, rowIndex) in data"
				:key="`tr-${rowIndex}`"
				:class="{ 'cursor-pointer': hasRowClickListener }"
				@click="emit('click:row', { item, rowIndex })"
			)
				td(
					v-for="column in columns"
          :ref="column.sticky ? 'columns' : null"
					:key="`td-${column.key}`"
          :class="{ [column.class || 'p-4']: true, 'bg-white sticky top-0 z-10': column.sticky }"
				)
					slot(
						:name="column.slot || column.key"
						:item
						:column
						:rowIndex
					) {{ column.formater ? column.formater(item[column.key]) : item[column.key] }}

	ScrollBar(
		:width
		:viewWidth
		:scrollLeft="scrollBarLeft"
		@scroll="setScroll"
	)
</template>

<script setup>
const props = defineProps({
	columns: { type: Array, required: true },
	data: { type: Array, required: true },
})

const emit = defineEmits(['sort', 'click:row'])

const sortedColumn = defineModel('sort', {
	default: {
		key: null,
		type: null,
	},
})

const table = useTemplateRef('table')
const container = useTemplateRef('container')
const columnRefs = useTemplateRef('columns')

const viewWidth = ref(0)
const width = ref(0)
const scrollBarLeft = ref(0)

const hasRowClickListener = Boolean(getCurrentInstance()?.vnode.props?.['onClick:row'])

const calc = () => {
	if (!table.value) {
		return
	}
	const containerRect = container.value.getBoundingClientRect()
	viewWidth.value = containerRect.width
	container.value.classList.remove('clip')

	const scrollableRect = table.value.getBoundingClientRect()
	width.value = scrollableRect.width
	container.value.classList.add('clip')

	if (viewWidth.value <= width.value) {
		setTimeout(() => {
			setScroll(0)
		})
	}
}

const setScroll = (scrollLeft) => {
	scrollBarLeft.value = scrollLeft

	table.value.style.transform = scrollLeft ? `translateX(-${scrollLeft}px)` : 'none'

  const { length } = columnRefs.value
  for (let index = 0; index < length; index++) {
    columnRefs.value[index].style.transform = scrollLeft ? `translateX(${scrollLeft}px)` : 'none'
  }
}
const handleScroll = (event) => {
	if (Math.abs(event.wheelDeltaY) > Math.abs(event.wheelDeltaX)) {
		return
	}
	scrollBarLeft.value -= event.wheelDeltaX
	event.preventDefault()
}

const listenerOptions = {
	passive: true,
}
onMounted(() => {
	window.addEventListener('resize', calc, listenerOptions)
	calc()

	table.value.addEventListener('wheel', handleScroll)
})
onBeforeUnmount(() => {
	window.removeEventListener('resize', calc, listenerOptions)
	table.value.removeEventListener('wheel', handleScroll)
})

watch(() => props.columns, () => {
  setTimeout(calc)
})

const handleSort = (column) => {
	if (!column.sort) return

	if (sortedColumn.value.key !== column.key) {
		sortedColumn.value.key = column.key
		sortedColumn.value.type = 'asc'
	} else if (sortedColumn.value.key === column.key && sortedColumn.value.type === 'asc') {
		sortedColumn.value.key = column.key
		sortedColumn.value.type = 'desc'
	} else {
		sortedColumn.value.key = null
		sortedColumn.value.type = null
	}
	emit('sort', sortedColumn)
}
</script>

<style scoped lang="scss">
.clip {
	overflow-x: clip;
	overscroll-behavior-x: none;
}

td,
th {
	box-shadow: inset 0 -1px 0 var(--color-gray-200);
}

th.cursor-pointer:hover {
	color: var(--color-gray-500);
}

@include media('<=phone') {
	td:first-child,
	th:first-child {
		padding-left: 0;
	}
	td:last-child,
	th:last-child {
		padding-right: 0;
		text-align: right;
	}

	td,
	th {
		box-shadow: none;
		border-bottom: 1px dashed var(--color-gray-200);
	}
}

tr.cursor-pointer:hover {
	background: var(--color-gray-100);
}
</style>
