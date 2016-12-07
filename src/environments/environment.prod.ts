import { envCommon } from './environment.common';

const envProd = {
  production: true,
}
export const environment = Object.assign(envProd, envCommon);
