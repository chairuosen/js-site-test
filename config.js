var fs = require('fs');
eval('var config = '+fs.readFileSync('./config.json'));
module.exports = config;