import { describe, expect, it } from 'vitest'
import { errorFromStatus } from './errors'

describe('HTTP error normalization', () => {
  it('classifies missing, throttled, and server responses', () => {
    expect(errorFromStatus(404)).toMatchObject({
      type: 'not-found',
      status: 404
    })
    expect(errorFromStatus(429)).toMatchObject({
      type: 'rate-limit',
      status: 429
    })
    expect(errorFromStatus(503)).toMatchObject({ type: 'server', status: 503 })
  })
})
