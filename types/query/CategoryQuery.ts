import { PaginatedQuery } from './PaginatedQuery';

export interface CategoryQuery extends PaginatedQuery {
  parentId?: string;
  path?: string;
  slug?: string;
}
