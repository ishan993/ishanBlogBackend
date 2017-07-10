export * from './config';
export * from './dbConfig';

export const loginInfoConfig = () => ('httpLink' + configJSON.username + 'withPass: ' + configJSON.password);
