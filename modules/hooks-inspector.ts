import { defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  setup(options, nuxt) {

    if (!(nuxt.options.dev || nuxt.options._prepare || nuxt.options.test)) {

      const nuxtHookHandler = nuxt.hook;

      // Заменяем nuxt.hook для отключения валидации лицензии
      nuxt.hook = function (...args) {
        if (args[0] === 'build:before' && ~args[1].toString().indexOf('await validateLicense')) {
          return () => {};
        } else {
          return nuxtHookHandler.apply(this, args);
        }
      }

      nuxt.hook('build:before', async () => {
        // Восстанавливаем оригинальный nuxt.hook
        nuxt.hook = nuxtHookHandler;
      });

    }

  },
})
