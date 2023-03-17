import { getApi } from "./helpers";
import { IConfig, IGetConfigsResponse } from "./index.interface";

export const getCashInConfig = (): Promise<IConfig> => {
  return getApi("https://developers.paysera.com/tasks/api/cash-in");
};

export const getCashOutNaturalConfig = (): Promise<IConfig> => {
  return getApi("https://developers.paysera.com/tasks/api/cash-out-natural");
};

export const getCashOutLegalConfig = (): Promise<IConfig> => {
  return getApi("https://developers.paysera.com/tasks/api/cash-out-juridical");
};

export const getConfigs = async (): Promise<IGetConfigsResponse> => {
  const configs = await Promise.all([
    getCashInConfig(),
    getCashOutLegalConfig(),
    getCashOutNaturalConfig(),
  ]);
  return {
    cashIn: configs[0],
    cashOutLegal: configs[1],
    cashOutNatural: configs[2],
  };
};
