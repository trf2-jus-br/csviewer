const { version } = require('./package.json');

module.exports = {
    publicRuntimeConfig: {
        version,
    },
    serverRuntimeConfig: {
        context: { vazio: true }
    }
};