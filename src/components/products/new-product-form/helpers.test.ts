import { describe, it, expect } from 'vitest';
import { validateImages } from './helpers';

describe('validateImages', () => {
  it('should return error for empty string', () => {
    const result = validateImages('');
    expect(result).toBe('Images field cannot be empty');
  });

  it('should return error for whitespace only', () => {
    const result = validateImages('   ');
    expect(result).toBe('Images field cannot be empty');
  });

  it('should return true for valid single URL', () => {
    const result = validateImages('https://example.com/image.jpg');
    expect(result).toBe(true);
  });

  it('should return true for valid multiple URLs', () => {
    const result = validateImages(
      'https://example.com/image1.jpg, https://example.com/image2.png'
    );
    expect(result).toBe(true);
  });

  it('should return error for invalid URL', () => {
    const result = validateImages('invalid-url');
    expect(result).toBe(
      'Each image must be a valid URL (e.g., https://example.com/image.jpg)'
    );
  });

  it('should return error for one invalid URL among valid ones', () => {
    const result = validateImages('https://example.com/image.jpg, invalid-url');
    expect(result).toBe(
      'Each image must be a valid URL (e.g., https://example.com/image.jpg)'
    );
  });

  it('should handle URLs with extra spaces and commas', () => {
    const result = validateImages(
      '  https://example.com/image.jpg  ,  , https://example.com/image2.png  '
    );
    expect(result).toBe(true);
  });

  it('should return error for URL without protocol', () => {
    const result = validateImages('example.com/image.jpg');
    expect(result).toBe(
      'Each image must be a valid URL (e.g., https://example.com/image.jpg)'
    );
  });

  it('should return true for HTTP URLs', () => {
    const result = validateImages('http://example.com/image.jpg');
    expect(result).toBe(true);
  });

  it('should return error for malformed URL', () => {
    const result = validateImages('https://');
    expect(result).toBe(
      'Each image must be a valid URL (e.g., https://example.com/image.jpg)'
    );
  });
});
