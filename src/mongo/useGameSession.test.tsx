import { renderHook } from '@testing-library/react'
import  useGameSession from './useGameSession';
import { describe, expect, it } from 'vitest';

// Mock the useGameSession hook

describe('useGameSession', () => {
  it('should get session is null', () => {
    const { result } = renderHook(() => useGameSession())
  //   act(() => {
  //     result.current.increment()
  //   })
    expect(result.current).toBe(undefined)
  })

  it('should get session update on change', () => {
    const { result } = renderHook(() => useGameSession("mk-pbid-8f199b67-debc-4210-a327-43505d86a91d" ))
  //   act(() => {
  //     result.current.increment()
  //   })
    expect(result.current).toBe({ sessionId: 'mk-pbid-8f199b67-debc-4210-a327-43505d86a91d'})
  })
})
