// import { render, act } from '@testing-library/react';
// import  useGameSession from './useGameSession';
// import { describe } from 'node:test';
// import { expect, test } from 'vitest'

// describe('useGameSession', () => {
//   test('should return the current game session', () => {
//     let result;
//     const TestComponent = () => {
//       result = useGameSession();
//       return null;
//     };

//     render(<TestComponent />);

//     expect(result).toBeUndefined();

//     act(() => {
//       result = { sessionId: 'mk-pbid-8f199b67-debc-4210-a327-43505d86a91d' };
//     });

//     expect(result).toEqual({ sessionId: 'mk-pbid-8f199b67-debc-4210-a327-43505d86a91d' });
//   });

//   // Similarly for other tests...
// });

import { act, renderHook } from '@testing-library/react'
import  useGameSession from './useGameSession';
import { describe, expect, it, Mock } from 'vitest';
import { isNull } from 'lodash';

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
