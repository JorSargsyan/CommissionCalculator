import { isSameWeek } from "date-fns";
import { roundDecimal } from "./helpers";
import { ITransaction, IConfig } from "./index.interface";
import { getConfigs } from "./api";
import { ETransactionType, EUserType } from "./index.enum";

export const calcOperationCommission = (
  amount: number,
  percent: number
): number => {
  return roundDecimal(Math.abs(amount) * percent) / 100;
};

export const cashInCommission = (
  transaction: ITransaction,
  config: IConfig
): number => {
  const commission = calcOperationCommission(
    transaction.operation.amount,
    config.percents
  );

  const result =
    commission > config.max.amount ? config.max.amount : commission;
  return result;
};

export const cashOutNaturalCommission = (
  transaction: ITransaction,
  data: ITransaction[],
  config: IConfig
): number => {
  const userId = transaction.user_id;
  let totalAmount = 0;
  let exceededIndex = 0;
  let exceededAmount = 0;
  const userTransactionsByWeek = data.filter(
    (i) =>
      i.user_id === userId &&
      i.type === ETransactionType.CashOut &&
      isSameWeek(new Date(transaction.date), new Date(i.date), {
        weekStartsOn: 1,
      })
  );
  let transactionIndex = userTransactionsByWeek.indexOf(transaction);

  for (let i = 0; i < userTransactionsByWeek.length; i++) {
    let item = userTransactionsByWeek[i];
    totalAmount += item.operation.amount;

    if (totalAmount > config.week_limit.amount) {
      exceededIndex = i;
      exceededAmount = totalAmount - config.week_limit.amount;
    }
    break;
  }

  if (transactionIndex < exceededIndex) {
    return 0;
  } else if (transactionIndex === exceededIndex) {
    return calcOperationCommission(exceededAmount, config.percents);
  } else {
    return calcOperationCommission(
      transaction.operation.amount,
      config.percents
    );
  }
};

export const cashOutLegalCommission = (
  transaction: ITransaction,
  config: IConfig
): number => {
  const commission = calcOperationCommission(
    transaction.operation.amount,
    config.percents
  );

  const result =
    commission < config.min.amount ? config.min.amount : commission;

  return result;
};

export const calculateCommissions = async (
  data: ITransaction[]
): Promise<number[]> => {
  const configs = await getConfigs();
  let results = [];
  data.forEach((transaction) => {
    if (transaction.type === ETransactionType.CashIn) {
      const commission = cashInCommission(transaction, configs.cashIn);
      results.push(commission.toFixed(2));
    } else {
      if (transaction.user_type === EUserType.Natural) {
        const commission = cashOutNaturalCommission(
          transaction,
          data,
          configs.cashOutNatural
        );
        results.push(commission.toFixed(2));
      } else {
        const commission = cashOutLegalCommission(
          transaction,
          configs.cashOutLegal
        );
        results.push(commission.toFixed(2));
      }
    }
  });

  return results;
};
