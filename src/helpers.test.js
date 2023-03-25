import { roundDecimal } from './helpers.ts';

test('roundDecimal', () => {
  expect(roundDecimal(0.12121212)).toBe(0.12);
});

test('roundDecimal', () => {
  expect(roundDecimal(0.167)).toBe(0.17);
});

test('roundDecimal', () => {
  expect(roundDecimal(0.00001)).toBe(0.0);
});

test('roundDecimal', () => {
  expect(roundDecimal(0.091)).toBe(0.09);
});
