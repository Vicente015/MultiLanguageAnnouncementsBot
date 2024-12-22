import 'dotenv/config'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportOnFailure: true
    },
    environment: 'node',
    mockReset: true
    // setupFiles: ['src/tests/setup-mongo-memory-server.ts']
  }
})
