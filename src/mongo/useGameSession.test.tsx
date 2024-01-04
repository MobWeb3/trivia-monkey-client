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
import { describe, it } from 'vitest';

describe('useGameSession', () => {
  it('should get session', () => {
    // const { result } = renderHook(() => useGameSession())
  //   act(() => {
  //     result.current.increment()
  //   })
  //   expect(result.current.count).toBe(1)
  })
})
