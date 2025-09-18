// config.js
const ENV = 'development'; // 改成 'production' 即可切換到正式 API

const CONFIG = {
  development: {
    API_BASE_URL: '/cbcapi',
  },
  production: {
    API_BASE_URL: 'https://10.17.20.224/cbcapi',
  },
};

export const API_BASE_URL = CONFIG[ENV].API_BASE_URL;
