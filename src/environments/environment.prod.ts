import { addonEnvironment } from '@dis/settings/environments/environment.prod';
const API = 'http://170.236.200.38:5000/';
export const environment = {
  production: true,
  API: API,
  ...addonEnvironment
};
