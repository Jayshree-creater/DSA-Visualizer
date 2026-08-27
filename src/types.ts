export type TabType = 'HOME' | 'SORTING' | 'SEARCHING' | 'STACK' | 'QUEUE';

export type SortingAlgorithm = 'Bubble Sort' | 'Selection Sort' | 'Insertion Sort';

export interface SortBar {
  id: number;
  value: number;
  // 0: default, 1: comparing, 2: sorted, 3: min/pivot
  state: number;
}

export interface SearchingStep {
  low: number;
  high: number;
  mid: number;
  target: number;
  step: number;
  action: string;
}

export interface StackItem {
  id: string;
  value: number;
}

export interface QueueItem {
  id: string;
  value: number;
}
