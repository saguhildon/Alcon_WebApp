export const addonEnvironment = {
  SSO_ENDPOINT: 'http://127.0.0.1:4000/api/auth',
  API_ROOT: 'http://127.0.0.1:4000',
  TEST_AUTH_FLOW_COMPLETE: false
};

declare var require: any
export const environment_config = {
  //appVersion: require('../../../../../package.json').version,
  env: ENV_CONFIG.ENVIRONMENT,
  apiUrl: ENV_CONFIG.API_URL,
  client: ENV_CONFIG.CLIENT,
  websocket: ENV_CONFIG.WEBSOCKET,
  PrototypeGUI: ENV_CONFIG.PROTOTYPE
};