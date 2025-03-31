<template lang="pug">
Card(
  title="Карточка контента (H2 font-size: 18px)"
  description="Скругления rounded-2xl (16px), padding: 36x, font-size: 16px"
  shadowClass="shadow-xs"
)

  .mb-8
    .font-semibold.text-gray-400.mb-4 Цвета текста
    .flex.gap-2.items-center.mb-3
      .w-6.h-6.rounded-md.bg-gray-700
      .text-gray-700 text-gray-700 (базовый)
    .flex.gap-2.items-center
      .w-6.h-6.rounded-md.bg-gray-400
      .text-gray-400 text-gray-400 (приглушенный)

  .flex.gap-4.mb-8
    Card.flex-1(
      title="Внутренняя карточка padding: 24px"
      description="Отступ подзаголовка 16px"
      size="sm"
    )
      .flex.gap-2.items-center.mb-3
        .w-6.h-6.rounded-md.bg-gray-300
        div Внешний отступ (снизу) 12px
      .flex.gap-2.items-center
        .w-6.h-6.rounded-md.bg-gray-300
        div Внутренний отступ (слева) 8px

    Card.flex-1(
      title="Внешние отступы между карточками 16px"
      size="sm"
    )
      UFormField.mb-3(label="Password")
        .flex.gap-2
          UInput(placeholder="Enter your Password")
      UFormField(label="Email")
        .flex.gap-2
          UInput(placeholder="Enter your email")
          UButton Save
    Card.flex-1(
      title="Размеры кнопок"
      size="sm"
    )
      .flex.gap-2.mb-3.items-center
        UButton(size="sm") Микро кнопка
        .text-gray-400 size="sm"
      .flex.gap-2.mb-3.items-center
        UButton(size="md") Компактна кнопка
        .text-gray-400 size="md"
      .flex.gap-2.mb-3.items-center
        UButton Стандартная кнопка
        .text-gray-400 по-умолчанию
      .flex.gap-2.items-center
        UButton(size="xl") Увеличенная кнопка
        .text-gray-400 size="xl"

  .font-semibold.text-xl.mb-2 Заголовок H1
  div.mb-5 Бронирование создается в состоянии Черновик, и в дальнейшем требует редактирования для установки обязательных полей и сопоставления с новыми сущностями системы: Номер, Категория, Тариф.

  .font-semibold.text-lg.mb-2 Заголовок H2
  div.mb-5 Подход с созданием отдельных тарифов под разное количество гостей - предлагается не использовать. Настройка цены будет отталкиваться от правил тарифа и зависеть от количества гостей.

  .font-semibold.text-base.mb-1 Заголовок H3
  div.mb-5 Альтернативный сценарий: при импорте бронирований, будут создаваться номера, категории и тарифы. Но в любом случае эти сущности нужно будет донастроить.

  .font-semibold.mb-1 Заголовок H4
  div.mb-5 Для безболезненного перехода на новую систему, требуется разработать инструмент импорта данных со сторонних сервисов (Bnovo). Импорт возможен для:

  .font-semibold.text-base.mb-4 Варианты кнопок
  .flex.gap-2.mb-3.items-center
    UButton Главная кнопка
    .text-gray-400  по-умолчанию
  .flex.gap-2.mb-3.items-center
    UButton(color="secondary") Неакцентная кнопка
    .text-gray-400  color="secondary"
  .flex.gap-2.mb-3.items-center
    UButton(
      disabled
    ) Заблокировано
    .text-gray-400 disabled
  .flex.gap-2.mb-3.items-center
    UButton(
      loading
    ) Идет загрузка
    .text-gray-400 loading
  .flex.gap-2.mb-3.items-center
    UButton(variant="ghost") Ghost кнопка
    .text-gray-400 variant="ghost"
  .flex.gap-2.mb-3.items-center
    UButton(color="secondary" variant="ghost") Неакцентная Ghost кнопка
    .text-gray-400 color="secondary", variant="ghost"
  .flex.gap-2.mb-3.items-center
    UButton(icon="i-lucide-search") Кнопка с иконкой
    .text-gray-400 icon="i-lucide-search"
  .flex.gap-2.mb-3.items-center
    UButton(
      icon="i-lucide-x"
      color="secondary"
      variant="ghost"
    )
    .text-gray-400 icon="i-lucide-x", color="secondary", variant="ghost"
  .flex.gap-2.mb-3.items-center
    UButton(trailing-icon="i-lucide-external-link" variant="ghost") Внешняя ссылка
    .text-gray-400 trailing-icon="i-lucide-external-link", variant="ghost"
</template>

<script setup>

definePageMeta({
  title: 'UI Guide'
})
</script>

<style scoped lang="scss">

</style>
