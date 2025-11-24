import { describe, it, expect } from 'vitest';

// Basic smoke test to ensure Vitest wiring is functional.
describe('environment', () => {
  it('confirms vitest runs', () => {
    expect(true).toBe(true);
  });
});
