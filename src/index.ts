export type EntityId = string | number;

export interface QueryOptions {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

export interface Repository<T, TId extends EntityId = EntityId> {
  findById(id: TId): Promise<T | null>;
  list(options?: QueryOptions): Promise<T[]>;
  create(input: Partial<T>): Promise<T>;
  update(id: TId, input: Partial<T>): Promise<T>;
  delete(id: TId): Promise<void>;
}

export interface DataAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
