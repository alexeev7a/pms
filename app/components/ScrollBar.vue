<template>
<div v-if="width > viewWidth" class="scroll sticky bottom-0 z-10 bg-white py-1 px-6 overflow text-gray-200">
  <div class="relative">
    <div
      :style="scrollBarStyle"
      class="scroll-bar absolute top-0 left-0 bg-gray-200 rounded-sm"
      v-on="{ [isMobile ? 'touchstart' : 'mousedown']: start }"
    >

    </div>
  </div>

  <UIcon
    class="left-0"
    :class="btnClass"
    name="i-lucide-chevron-left"
    @click="scroll(-100)"
  ></UIcon>
  <UIcon
    class="right-0"
    :class="btnClass"
    name="i-lucide-chevron-right"
    @click="scroll(100)"
  ></UIcon>
</div>
</template>

<script setup>
const listenerOptions = {
	passive: true,
}

const props = defineProps({
	viewWidth: { type: Number, default: 0 },
	width: { type: Number, default: 0 },
	scrollLeft: { type: Number, default: 0 },
})
const emit = defineEmits(['scroll'])

const { isMobile } = useDevice()

let startLeft = 0
let startX = 0
const btnClass = 'size-4 absolute top-0.5 cursor-pointer text-center lh-18'

const scrollBarStyle = computed(() => {
	const width = (props.viewWidth / props.width) * 100
	const scrollToEnd = ((100 - width) / width) * 100
	const prc = props.scrollLeft / (props.width - props.viewWidth)
	return {
		width: `${width}%`,
		transform: `translateX(${scrollToEnd * prc}%)`,
	}
})

const start = (e) => {
	startX = e.clientX || e.touches?.[0].clientX
	startLeft = props.scrollLeft
  const { body } = document
	body.addEventListener(isMobile ? 'touchmove' : 'mousemove', positionCalc, listenerOptions)
	body.addEventListener(isMobile ? 'touchend' : 'mouseup', stop, { once: true })
	body.addEventListener(isMobile ? 'touchcancel' : 'mouseleave', stop, { once: true })
	body.classList.add('--slider-mousemove')
	positionCalc(e)
}
const stop = () => {
  const { body } = document
	body.removeEventListener(isMobile ? 'touchmove' : 'mousemove', positionCalc, listenerOptions)
	body.removeEventListener(isMobile ? 'touchcancel' : 'mouseleave', stop)
	window.getSelection().removeAllRanges()
	body.classList.remove('--slider-mousemove')
}
const positionCalc = (e) => {
	const diff = (e.clientX || e.touches?.[0].clientX) - startX
	scroll(Math.round(diff * (props.width / props.viewWidth)), startLeft)
}

const scroll = (diff, from = props.scrollLeft) => {
	const scrollPath = props.width - props.viewWidth
	let position = from + diff
	if (position < 0) {
		position = 0
	} else if (position > scrollPath) {
		position = scrollPath
	}
	emit('scroll', position)
}

watch(
	() => props.scrollLeft,
	(to, from) => {
		scroll(to - from, from)
	}
)
</script>

<style lang="scss" scoped>
.scroll {
	height: 18px;
	box-shadow: 0 -1px 0 var(--color-gray-200);

	&-bar {
		height: 12px;
		cursor: grab;
		width: 20%;

		@at-root .scroll:hover & {
			background: var(--color-gray-300);
		}
	}

	.fa {
		width: 24px;

		&:hover {
			color: var(--color-primary);
		}
	}
}
</style>
