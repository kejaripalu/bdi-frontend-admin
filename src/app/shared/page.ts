/** Spring Data `Page` response used by every list and search endpoint. */
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  /** Current page, 0-based. */
  number: number;
  size: number;
  first?: boolean;
  last?: boolean;
  numberOfElements?: number;
  empty?: boolean;
}
