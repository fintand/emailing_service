var validator   = require("email-validator");
var Client      = require('../models/client');
var config      = require('../config');
var API_KEY     = config.API_KEY;
var DOMAIN      = config.DOMAIN;
var EMAIL_FROM  = config.EMAIL.FROM;
var EMAIL_TO    = config.EMAIL.TO;
var mailgun     = require('mailgun-js')({apiKey: API_KEY, domain: DOMAIN}); // emailing service
var mailcomposer = require('mailcomposer');

module.exports = function (app, express) {
    var apiRoutes = express.Router();

    apiRoutes.get('/', function(req, res) {
        res.json({ message: 'root of API' });
    });

    apiRoutes.post('/contact', function (req, res) {

        // data from user
        var spam = req.body.company;
        var name = req.body.name;
        var number = req.body.number;
        var location = req.body.location;
        var interest = req.body.interest;
        var email = req.body.email;
        var time = req.body.time;

        // spam protection
        if(spam) {
            res.send({
                message: 'spambot',
                err: true
            });
            return;
        }

        // check email
        var isValidEmail = validator.validate(email);
        if(!isValidEmail) {
            res.status(400).send({
                message: 'invalid email',
                err: true
            });
            return;
        }


        if(name && number && location && interest) {

            var mail = mailcomposer({
                from: EMAIL_FROM,
                to: EMAIL_TO,
                subject: 'Message from Email Service',
                body: 'Test email subject',
                html:   '<h2>Name:&nbsp;' + name + '</h2>' +
                        '<br>' +
                        '<h2>Number:&nbsp;' + '<a href="tel:' + number +'">' + number + '</a>' + '</h2>' +
                        '<br>' +
                        '<h2>Location:&nbsp;' + location + '</h2>' +
                        '<br>' +
                        '<h2>Interest:&nbsp;' + interest + '</h2>' +
                        '<br>' +
                        '<h2>Email:&nbsp;' + email + '</h2>' +
                        '<br>' +
                        '<h2>Time:&nbsp;' + time + '</h2>' +
                        '<br>'
            });

            mail.build(function(mailBuildError, message) {

                var dataToSend = {
                    to: EMAIL_TO,
                    message: message.toString('ascii')
                };

                mailgun.messages().sendMime(dataToSend, function (sendError, body) {
                    if (sendError) {
                        console.log(sendError);
                        return;
                    }

                    var newClient = new Client();
                    newClient.name = name;
                    newClient.number = number;
                    newClient.location = location;
                    newClient.interest = interest;
                    newClient.email = email;
                    newClient.time = time;
                    newClient.save();

                    res.status(201).send({
                        message: 'email sent & client saved',
                        err: false,
                        client: {
                            name: name,
                            number: number
                        }
                    });
                });
            });
            return;
        }

        // default response
        res.status(400).send({
            message: 'no data',
            err: true
        })
    });

    return apiRoutes;
};

