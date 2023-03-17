import { ECurrency, ETransactionType, EUserType } from "./index.enum";

export interface ITransaction {
  date: string;
  user_id: number;
  user_type: EUserType;
  type: ETransactionType;
  operation: IOperation;
}

export interface IConfig {
  percents: number;
  max?: IOperation;
  min?: IOperation;
  week_limit?: IOperation;
}

export interface IOperation {
  amount: number;
  currency: ECurrency;
}

export interface IGetConfigsResponse {
  cashIn: IConfig;
  cashOutLegal: IConfig;
  cashOutNatural: IConfig;
}
