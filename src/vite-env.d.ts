/// <reference types="vite/client" />
/// <reference types="naive-ui/types" />
/// <reference types="../auto-imports" />
/// <reference types="naive-ui/volar" />
/// <reference types="vite-plugin-pages/client" />

declare module 'vue/types/vue' {
    interface Vue {
      $router: VueRouter
    }
  }