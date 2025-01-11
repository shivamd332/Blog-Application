import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  // this server object is created by me
  // it is created because our frontend is running on localhost:5173 and server is running on localhost:3000 so to make them on same page server object config is created
  server: {
    //whenever our frontend side '/api in any fetch request it will convert it to localhost:3000/api....
    // that why we made proxy
    proxy: { "/api": { target: "http://localhost:3000", secure: false } },
  },
  plugins: [react()],
})
