import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    server:{
      host:'0.0.0.0',
      port: parseInt(process.env.VITE_FRONT_PORT),
    },
    plugins: [react()],
  })
}