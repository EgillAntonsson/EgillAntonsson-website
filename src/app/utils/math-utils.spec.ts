import { factorial, isPrime } from './math-utils';

describe('Math Utils', () => {
  describe('factorial', () => {
    it('should calculate factorial correctly', () => {
      expect(factorial(0)).toBe(1);
      expect(factorial(1)).toBe(1);
      expect(factorial(5)).toBe(120);
      expect(factorial(10)).toBe(3628800);
    });

    it('should throw error for negative numbers', () => {
      expect(() => factorial(-1)).toThrow('Factorial is not defined for negative numbers');
    });
  });

  describe('isPrime', () => {
    it('should correctly identify prime numbers', () => {
      expect(isPrime(2)).toBe(true);
      expect(isPrime(3)).toBe(true);
      expect(isPrime(17)).toBe(true);
      expect(isPrime(97)).toBe(true);
    });

    it('should correctly identify non-prime numbers', () => {
      expect(isPrime(1)).toBe(false);
      expect(isPrime(4)).toBe(false);
      expect(isPrime(15)).toBe(false);
      expect(isPrime(100)).toBe(false);
    });
  });
});