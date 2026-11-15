import { defineConfig } from 'electron-vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  main: {
    resolve: {
      alias: {
        '@app-types': resolve('src/types')
      }
    }
  },
  preload: {
    resolve: {
      alias: {
        '@app-types': resolve('src/types')
      }
    }
  },
  renderer: {
    plugins: [svelte(), tailwindcss()],
    resolve: {
      alias: {
        '@app-types': resolve('src/types')
      }
    }
  }
})
