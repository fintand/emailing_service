var express    = require('express');
var app        = express();
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
var helmet     = require('helmet');
var config     = require('./config');
var port       = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());

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

