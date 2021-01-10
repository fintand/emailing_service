require('dotenv').config();
var express    = require('express');
var app        = express();
var path       = require('path');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
var cors       = require('cors')
var helmet     = require('helmet');
var config     = require('./config');
var port       = process.env.PORT || 8080;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());

// DB CONFIG
mongoose.connect(config.DB);
mongoose.connection.on('error', function (err) {
    console.log(err);
});

// API ROUTES
var apiRoutes = require('./routes/mail')(app, express);
app.use('/api', apiRoutes);

// LOG CONFIG
console.log(JSON.stringify(config, null, 2));

// START SERVER
app.listen(port);
console.log('Magic happens on port ' + port);

