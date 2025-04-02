export default defineAppConfig({
  ui: {
    colors: {
      //primary: 'green',
      neutral: 'gray',
      secondary: 'stone',
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
    select: {
      slots: {
        base: 'cursor-pointer',
        value: 'font-semibold text-gray-500',
      },
      defaultVariants: {
        size: 'lg',
        color: 'neutral',
      }
    },
    selectMenu: {
      slots: {
        base: 'cursor-pointer',
        value: 'font-semibold text-gray-500',
      },
      defaultVariants: {
        size: 'lg',
        //color: 'neutral',
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
      compoundVariants: [
        {
          color: 'neutral',
          class: 'text-gray-500',
        },
      ],
      defaultVariants: {
        size: 'lg',
      }
    }
  },
  tooltip: { delayDuration: 0 },
})
