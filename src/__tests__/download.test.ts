import { describe, it, expect } from 'vitest';

describe('html2canvas scale', () => {
  it('scale=ceil(1080/420)=3 → 1260px ≥ 1080px', () => {
    const cardWidth = 420;
    const targetWidth = 1080;
    const scale = Math.ceil(targetWidth / cardWidth);
    expect(scale).toBe(3);
    expect(scale * cardWidth).toBeGreaterThanOrEqual(targetWidth);
  });
});
