import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import { MOCK_CREDENTIALS } from './src/services/mockApi.js'

// Dev/preview stand-in for the (nonexistent) backend: serves the mock
// credentials so the app can fetch GET /api/credentials like a real API.
// Shared handler for dev and preview; 900ms delay keeps the Loading
// skeleton visible during the demo.
function mockApiHandler(req, res) {
  const scenario = new URL(req.url, 'http://x').searchParams.get('scenario')
  setTimeout(() => {
    if (scenario === 'error') {
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ message: 'Simulated server error' }))
      return
    }
    if (scenario === 'empty') {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify([]))
      return
    }
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(MOCK_CREDENTIALS))
  }, 900)
}

const mockApiPlugin = {
  name: 'mock-api',
  configureServer(server) {
    server.middlewares.use('/api/credentials', mockApiHandler)
  },
  configurePreviewServer(server) {
    server.middlewares.use('/api/credentials', mockApiHandler)
  },
}

export default defineConfig({
  plugins: [react(), mockApiPlugin],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/tests/setup.js',
    css: false,
  },
})
