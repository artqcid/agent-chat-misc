// src/di/Container.ts
export class Container {
  private services = new Map<string, any>();

  register<T>(key: string, factory: () => T): void {
    this.services.set(key, factory);
  }

  resolve<T>(key: string): T {
    const factory = this.services.get(key);
    if (!factory) {
      throw new Error(`Service ${key} not registered`);
    }
    return factory();
  }

  has(key: string): boolean {
    return this.services.has(key);
  }
}