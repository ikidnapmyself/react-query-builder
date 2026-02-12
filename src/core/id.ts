let counter = 0;

export function generateId(): string {
  return `qb-${Date.now()}-${++counter}`;
}
