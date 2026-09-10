//DO NOT DELETE
//UNCOMMENT FOR IIS DEPLOYMENT

// const config = {
//   apiUrl: 'http://192.168.1.19:80/api',
//   socketUrl: 'http://192.168.1.19:80/appreciationHub',
// };

// END

const BASE_URL = process.env.REACT_APP_BASE_URL;

const config = {
  apiUrl: `${BASE_URL}/oltp`,
  socketUrl: `${BASE_URL}/appreciationHub`,
  notificationUrl: `${BASE_URL}/notificationHub`,
  olapUrl: `${BASE_URL}/olap`,
  operationsUrl: `${BASE_URL}/operations`,
};


export default config;




