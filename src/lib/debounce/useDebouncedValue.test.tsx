import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useDebouncedValue } from './useDebouncedValue'

afterEach(() => vi.useRealTimers())

describe('useDebouncedValue', () => {
  it('waits for the latest text value before exposing it to a query', () => {
    vi.useFakeTimers()
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value),
      { initialProps: { value: 'p' } }
    )

    rerender({ value: 'pi' })
    act(() => vi.advanceTimersByTime(200))
    rerender({ value: 'pik' })
    act(() => vi.advanceTimersByTime(299))
    expect(result.current).toBe('p')

    act(() => vi.advanceTimersByTime(1))
    expect(result.current).toBe('pik')
  })
})
