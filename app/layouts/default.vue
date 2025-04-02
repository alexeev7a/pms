<script setup lang="ts">
const route = useRoute()
const toast = useToast()

const open = ref(false)

const links = [[
  {
    label: 'Бронирования',
    icon: 'i-lucide-calendar-range',
    to: '/',
    onSelect: () => {
      open.value = false
    }
  },
  {
    label: 'Цены',
    icon: 'i-lucide-badge-dollar-sign',
    to: '/prices',
    onSelect: () => {
      open.value = false
    }
  },
  {
    label: 'Дизайн гайд',
    icon: 'i-lucide-pencil-ruler',
    to: '/ui',
    onSelect: () => {
      open.value = false
    }
  },
  /*{
  label: 'Home',
  icon: 'i-lucide-house',
  to: '/',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Inbox',
  icon: 'i-lucide-inbox',
  to: '/inbox',
  badge: '4',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Customers',
  icon: 'i-lucide-users',
  to: '/customers',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Settings',
  to: '/settings',
  icon: 'i-lucide-settings',
  defaultOpen: true,
  children: [{
    label: 'General',
    to: '/settings',
    exact: true,
    onSelect: () => {
      open.value = false
    }
  }, {
    label: 'Members',
    to: '/settings/members',
    onSelect: () => {
      open.value = false
    }
  }, {
    label: 'Notifications',
    to: '/settings/notifications',
    onSelect: () => {
      open.value = false
    }
  }, {
    label: 'Security',
    to: '/settings/security',
    onSelect: () => {
      open.value = false
    }
  }]
}*/]/*, [{
  label: 'Feedback',
  icon: 'i-lucide-message-circle',
  to: 'https://github.com/nuxt-ui-pro/dashboard',
  target: '_blank'
}, {
  label: 'Help & Support',
  icon: 'i-lucide-info',
  to: 'https://github.com/nuxt/ui-pro',
  target: '_blank'
}]*/]

const groups = computed(() => [{
  id: 'links',
  label: 'Go to',
  items: links.flat()
}])

onMounted(async () => {
  const cookie = useCookie('cookie-consent')
  if (cookie.value === 'accepted') {
    return
  }

  toast.add({
    title: 'We use first-party cookies to enhance your experience on our website.',
    duration: 0,
    close: false,
    actions: [{
      label: 'Accept',
      color: 'neutral',
      variant: 'outline',
      onClick: () => {
        cookie.value = 'accepted'
      }
    }, {
      label: 'Opt out',
      color: 'neutral',
      variant: 'ghost'
    }]
  })
})
</script>

<template>
  <UDashboardGroup>
    <UDashboardSearch :groups="groups" :colorMode="false" />

    <UDashboardSidebar
      v-model:open="open"
      collapsible
      resizable
      :ui="{ root: 'border-none', handle: 'hover:bg-gray-300 w-px', footer: 'lg:border-t lg:border-(--ui-border)' }"
    >
      <template #header="{ collapsed }">
        <a href="/">
          <img src="~/assets/logo.svg" style="margin-left: -20px; height: 24px" alt="YPMS">
        </a>
        <UDashboardSidebarCollapse class="opacity-20 hover:opacity-100" :class="{'ml-auto': !collapsed}" />
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <UDashboardPanel :ui="{ body: 'sm:py-0 sm:px-4' }">
      <template #header>
        <UDashboardNavbar :toggle="false" :ui="{ title: 'text-xl', root: 'border-none sm:px-4' }">
          <template #title>{{ route.meta.title }}</template>
          <template #right>
            <UButton icon="i-lucide-circle-plus">Новое бронирование</UButton>
            <UDashboardSearchButton variant="soft" label="Найти бронирования" />
          </template>
        </UDashboardNavbar>
      </template>

      <template #body>
        <slot />
      </template>
    </UDashboardPanel>

    <NotificationsSlideover />
  </UDashboardGroup>
</template>
