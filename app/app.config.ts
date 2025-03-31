export default defineAppConfig({
  ui: {
    colors: {
      //primary: 'green',
      neutral: 'zinc'
    },
    icons: {
      loading: 'i-lucide-loader-circle',
    },
    formField: {
      slots: {
        label: 'font-normal text-gray-400',
      },
    },
    input: {
      slots: {
        base: 'placeholder:font-semibold placeholder:text-gray-400',
      },
      defaultVariants: {
        size: 'lg',
      }
    },
    button: {
      slots: {
        base: 'font-semibold disabled:opacity-50 cursor-pointer',
      },
      variants: {
        size: {
          lg: {
            leadingIcon: 'size-4',
            trailingIcon: 'size-4',
          }
        },
      },
      defaultVariants: {
        size: 'lg',
      }
    }
  },
  tooltip: { delayDuration: 0 },
})
