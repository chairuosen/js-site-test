var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.set('view engine','jade');
app.use(bodyParser.urlencoded({ extended: true }));
require('./router')(app);
require('./error')(app);

var config = require('./config')
global.CONFIG = config;
app.listen(config.listen_port || 3000);
var path = __filename.split('/')
path.pop();
global.APP_PATH = path.join('/')+"/";
