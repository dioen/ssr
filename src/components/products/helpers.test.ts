import { describe, it, expect } from 'vitest';
import { validateAndBuildApiQueryString, ProductsApiFilters } from './helpers';
import { PRODUCTS_PER_PAGE_DEFAULT } from '../../consts';

describe('validateAndBuildApiQueryString', () => {
  it('should return pagination for empty params', () => {
    const params = new URLSearchParams();
    const result = validateAndBuildApiQueryString(params);
    expect(result).toBe('offset=0&limit=12');
  });

  it('should add title if present and not empty', () => {
    const params = new URLSearchParams();
    params.set(ProductsApiFilters.TITLE, 'test title');
    const result = validateAndBuildApiQueryString(params);
    expect(result).toContain('title=test+title');
  });

  it('should not add title if empty or whitespace', () => {
    const params = new URLSearchParams();
    params.set(ProductsApiFilters.TITLE, '');
    let result = validateAndBuildApiQueryString(params);
    expect(result).not.toContain('title');

    params.set(ProductsApiFilters.TITLE, '   ');
    result = validateAndBuildApiQueryString(params);
    expect(result).not.toContain('title');
  });

  it('should add price_min and price_max if valid', () => {
    const params = new URLSearchParams();
    params.set(ProductsApiFilters.PRICE_MIN, '10');
    params.set(ProductsApiFilters.PRICE_MAX, '100');
    const result = validateAndBuildApiQueryString(params);
    expect(result).toContain('price_min=10');
    expect(result).toContain('price_max=100');
  });

  it('should not add prices if invalid (negative)', () => {
    const params = new URLSearchParams();
    params.set(ProductsApiFilters.PRICE_MIN, '-10');
    params.set(ProductsApiFilters.PRICE_MAX, '100');
    const result = validateAndBuildApiQueryString(params);
    expect(result).not.toContain('price_min');
    expect(result).not.toContain('price_max');
  });

  it('should not add prices if max < min', () => {
    const params = new URLSearchParams();
    params.set(ProductsApiFilters.PRICE_MIN, '100');
    params.set(ProductsApiFilters.PRICE_MAX, '10');
    const result = validateAndBuildApiQueryString(params);
    expect(result).not.toContain('price_min');
    expect(result).not.toContain('price_max');
  });

  it('should not add prices if NaN', () => {
    const params = new URLSearchParams();
    params.set(ProductsApiFilters.PRICE_MIN, 'abc');
    params.set(ProductsApiFilters.PRICE_MAX, '100');
    const result = validateAndBuildApiQueryString(params);
    expect(result).not.toContain('price_min');
    expect(result).not.toContain('price_max');
  });

  it('should not add prices if only one is set', () => {
    const params = new URLSearchParams();
    params.set(ProductsApiFilters.PRICE_MIN, '10');
    const result = validateAndBuildApiQueryString(params);
    expect(result).not.toContain('price_min');
    expect(result).not.toContain('price_max');
  });

  it('should add categoryId if present and not empty', () => {
    const params = new URLSearchParams();
    params.set(ProductsApiFilters.CATEGORY_ID, '5');
    const result = validateAndBuildApiQueryString(params);
    expect(result).toContain('categoryId=5');
  });

  it('should not add categoryId if empty', () => {
    const params = new URLSearchParams();
    params.set(ProductsApiFilters.CATEGORY_ID, '');
    const result = validateAndBuildApiQueryString(params);
    expect(result).not.toContain('categoryId');
  });

  it('should add offset and limit for pagination', () => {
    const params = new URLSearchParams();
    params.set(ProductsApiFilters.PAGE, '2');
    const result = validateAndBuildApiQueryString(params);
    expect(result).toContain(`offset=${PRODUCTS_PER_PAGE_DEFAULT}`);
    expect(result).toContain(`limit=${PRODUCTS_PER_PAGE_DEFAULT}`);
  });

  it('should calculate offset correctly for page > 1', () => {
    const params = new URLSearchParams();
    params.set(ProductsApiFilters.PAGE, '3');
    const result = validateAndBuildApiQueryString(params);
    expect(result).toContain(`offset=${2 * PRODUCTS_PER_PAGE_DEFAULT}`);
  });

  it('should set offset to 0 for invalid page', () => {
    const params = new URLSearchParams();
    params.set(ProductsApiFilters.PAGE, 'abc');
    const result = validateAndBuildApiQueryString(params);
    expect(result).toContain('offset=0');
  });

  it('should set offset to 0 for page <= 0', () => {
    const params = new URLSearchParams();
    params.set(ProductsApiFilters.PAGE, '0');
    const result = validateAndBuildApiQueryString(params);
    expect(result).toContain('offset=0');
  });

  it('should use custom limit if valid', () => {
    const params = new URLSearchParams();
    params.set(ProductsApiFilters.LIMIT, '20');
    const result = validateAndBuildApiQueryString(params);
    expect(result).toContain('limit=20');
  });

  it('should use default limit if invalid', () => {
    const params = new URLSearchParams();
    params.set(ProductsApiFilters.LIMIT, 'abc');
    const result = validateAndBuildApiQueryString(params);
    expect(result).toContain(`limit=${PRODUCTS_PER_PAGE_DEFAULT}`);
  });

  it('should skip pagination if withoutPagination is true', () => {
    const params = new URLSearchParams();
    params.set(ProductsApiFilters.PAGE, '2');
    params.set(ProductsApiFilters.LIMIT, '20');
    const result = validateAndBuildApiQueryString(params, true);
    expect(result).not.toContain('offset');
    expect(result).not.toContain('limit');
  });

  it('should handle combination of filters', () => {
    const params = new URLSearchParams();
    params.set(ProductsApiFilters.TITLE, 'test');
    params.set(ProductsApiFilters.PRICE_MIN, '10');
    params.set(ProductsApiFilters.PRICE_MAX, '100');
    params.set(ProductsApiFilters.CATEGORY_ID, '5');
    params.set(ProductsApiFilters.PAGE, '2');
    const result = validateAndBuildApiQueryString(params);
    expect(result).toContain('title=test');
    expect(result).toContain('price_min=10');
    expect(result).toContain('price_max=100');
    expect(result).toContain('categoryId=5');
    expect(result).toContain(`offset=${PRODUCTS_PER_PAGE_DEFAULT}`);
    expect(result).toContain(`limit=${PRODUCTS_PER_PAGE_DEFAULT}`);
  });
});
