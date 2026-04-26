import { describe, it, expect } from 'vitest';
import { encodeResult, decodeResult } from '@/lib/share';
import type { QuizResult } from '@/data/personas';

describe('base64 roundtrip', () => {
  it('encode → decode returns same object', () => {
    const result: QuizResult = {
      type: 'trainer',
      angerScore: 3,
      showAngryBadge: true,
    };
    const encoded = encodeResult(result);
    const decoded = decodeResult(encoded);
    expect(decoded).toEqual(result);
  });

  it('invalid base64 → returns null (no throw)', () => {
    expect(decodeResult('not_valid_base64!!!!')).toBeNull();
  });

  it('tampered base64 → returns null', () => {
    expect(decodeResult('eyJ0eXBlIjogeH0=')).toBeNull(); // invalid JSON
  });
});
