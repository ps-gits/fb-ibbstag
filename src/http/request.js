const axios = require('axios');
const apiUrl = "https://tstws2.ttinteractive.com/Zenith/TTI.PublicApi.Services/JsonSaleEngineService.svc";

async function request(method, endpoint, data) {
  try {
    const config = {
      method: method.toUpperCase(),
      url: `${apiUrl}/${endpoint}`,
      data,
    };
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = request;