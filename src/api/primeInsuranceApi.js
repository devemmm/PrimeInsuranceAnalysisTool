const axios = require('axios');
axios.defaults.baseURL = 'https://prime-insurance-api.nextreflexe.com';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

module.exports = axios