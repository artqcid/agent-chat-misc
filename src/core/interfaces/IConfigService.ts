// src/core/interfaces/IConfigService.ts
export interface IConfigService {
  get<T>(key: string): T;
  set<T>(key: string, value: T): Promise<void>;
  save(): Promise<void>;
  load(): Promise<void>;
}