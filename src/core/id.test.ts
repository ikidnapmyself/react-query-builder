import { generateId } from './id';

describe('generateId', () => {
  it('returns a string matching qb-{timestamp}-{counter} format', () => {
    expect(generateId()).toMatch(/^qb-\d+-\d+$/);
  });

  it('returns unique IDs on successive calls', () => {
    const ids = new Set(Array.from({ length: 10 }, () => generateId()));
    expect(ids.size).toBe(10);
  });
});
