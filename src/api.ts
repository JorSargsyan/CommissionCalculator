import { getApi } from './helpers'
import { type IConfig, type IGetConfigsResponse } from './index.interface'
import * as dotenv from 'dotenv'


dotenv.config();
const API = process.env.API;

export const getCashInConfig = async (): Promise<IConfig> => {
  return await getApi(`${API}/cash-in`)
}

export const getCashOutNaturalConfig = async (): Promise<IConfig> => {
  return await getApi(`${API}/cash-out-natural`)
}

export const getCashOutLegalConfig = async (): Promise<IConfig> => {
  return await getApi(`${API}/cash-out-juridical`)
}

export const getConfigs = async (): Promise<IGetConfigsResponse> => {
  const configs = await Promise.all([
    getCashInConfig(),
    getCashOutLegalConfig(),
    getCashOutNaturalConfig()
  ])
  return {
    cashIn: configs[0],
    cashOutLegal: configs[1],
    cashOutNatural: configs[2]
  }
}
