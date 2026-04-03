import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'state-vendor': ['react-router-dom', 'react-redux', '@reduxjs/toolkit'],
          'appwrite': ['appwrite'],
          'editor': ['@tinymce/tinymce-react'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})