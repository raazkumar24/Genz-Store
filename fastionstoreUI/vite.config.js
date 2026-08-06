import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' //That is Tailwind CSS plugin for Vite. It allows you to use Tailwind CSS in your Vite project.


// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),  react()],
})
