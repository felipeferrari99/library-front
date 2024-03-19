import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
dotenv.config()
// https://vitejs.dev/config/
export default defineConfig({
  server:{
    host:'0.0.0.0',
    port: process.env.FRONT_PORT,
  },
  plugins: [react()],
})