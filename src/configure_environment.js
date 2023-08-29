function getConfig() {
    if (process.env.NODE_ENV === 'production') {
    var config = require('./config_prod.js');
    } else {
    var config = require('./config_dev.js');
    }
    return config;
}

export { getConfig };