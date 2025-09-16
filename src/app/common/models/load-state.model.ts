export interface LoadState<T> {
  kind: 'loading' | 'error' | 'not-found' | 'success';
  value?: T;
}
