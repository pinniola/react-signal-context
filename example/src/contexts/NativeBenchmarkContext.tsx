import React from 'react';

// The state structure for our benchmark
export interface BenchmarkState {
  timer: number;
}

export const initialState: BenchmarkState = {
  timer: 0,
};

export const NativeContext = React.createContext<BenchmarkState>(initialState);

