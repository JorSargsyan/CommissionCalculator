import {
  cashInCommission,
  cashOutNaturalCommission,
  cashOutLegalCommission,
  calcOperationCommission,
} from "./calculations";

test("calcOperationCommission", () => {
  expect(calcOperationCommission(200, 50)).toBe(100);
});

test("cashInCommission - check with operation amount lower than max limit", () => {
  const configExample = { percents: 0.03, max: { amount: 5, currency: "EUR" } };
  const trExample = {
    date: "2016-01-05",
    user_id: 1,
    user_type: "natural",
    type: "cash_in",
    operation: {
      amount: 200,
      currency: "EUR",
    },
  };
  expect(cashInCommission(trExample, configExample)).toBe(0.06);
});

test("cashInCommission - check with operation amount higher than max limit", () => {
  const configExample = { percents: 0.03, max: { amount: 5, currency: "EUR" } };
  const trExample = {
    date: "2016-01-05",
    user_id: 1,
    user_type: "natural",
    type: "cash_in",
    operation: {
      amount: 120000,
      currency: "EUR",
    },
  };
  expect(cashInCommission(trExample, configExample)).toBe(5);
});

test("cashOutLegalCommission - check with operation amount higher than min limit", () => {
  const configExample = {
    percents: 0.3,
    min: { amount: 0.5, currency: "EUR" },
  };
  const trExample = {
    date: "2016-01-06",
    user_id: 2,
    user_type: "juridical",
    type: "cash_out",
    operation: { amount: 300.0, currency: "EUR" },
  };
  expect(cashOutLegalCommission(trExample, configExample)).toBe(0.9);
});

test("cashOutLegalCommission - check with operation amount lower than min limit", () => {
  const configExample = {
    percents: 0.3,
    min: { amount: 0.5, currency: "EUR" },
  };
  const trExample = {
    date: "2016-01-06",
    user_id: 2,
    user_type: "juridical",
    type: "cash_out",
    operation: { amount: 0.000000001, currency: "EUR" },
  };
  expect(cashOutLegalCommission(trExample, configExample)).toBe(0.5);
});

test("cashOutNaturalCommission - check with operation amount with exceeding weekly limit", () => {
  const configExample = {
    percents: 0.3,
    week_limit: { amount: 1000, currency: "EUR" },
  };

  const inputList = [
    {
      date: "2016-01-06",
      user_id: 1,
      user_type: "natural",
      type: "cash_out",
      operation: { amount: 30000, currency: "EUR" },
    },
    {
      date: "2016-01-07",
      user_id: 1,
      user_type: "natural",
      type: "cash_out",
      operation: { amount: 1000.0, currency: "EUR" },
    },
  ];
  expect(cashOutNaturalCommission(inputList[0], inputList, configExample)).toBe(
    87
  );
});

test("cashOutNaturalCommission - check with operation amount with free charge weekly limit", () => {
  const configExample = {
    percents: 0.3,
    week_limit: { amount: 1000, currency: "EUR" },
  };

  const inputList = [
    {
      date: "2016-01-06",
      user_id: 1,
      user_type: "natural",
      type: "cash_out",
      operation: { amount: 200, currency: "EUR" },
    },
    {
      date: "2016-01-07",
      user_id: 1,
      user_type: "natural",
      type: "cash_out",
      operation: { amount: 300, currency: "EUR" },
    },
  ];
  expect(cashOutNaturalCommission(inputList[0], inputList, configExample)).toBe(
    0
  );
});
