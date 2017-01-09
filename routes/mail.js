var validator = require("email-validator");
var Client = require('../models/client');
var config = require('../config');
var API_KEY = config.API_KEY;
var DOMAIN = config.DOMAIN;
var EMAIL_FROM = config.EMAIL.FROM;
var EMAIL_TO = config.EMAIL.TO;
var mailgun = require('mailgun-js')({apiKey: API_KEY, domain: DOMAIN}); // emailing service
var mailcomposer = require('mailcomposer');
var Hogan = require('hogan.js');
var fs = require('fs');

var template = fs.readFileSync('./views/email.hjs', 'utf-8');
var compiledTemplate = Hogan.compile(template);

module.exports = function (app, express) {
  var apiRoutes = express.Router();

  apiRoutes.get('/', function (req, res) {
    res.json({message: 'root of API'});
  });

  apiRoutes.post('/contact', function (req, res) {

    // data from user
    var spam = req.body.company;
    var name = req.body.name;
    var number = req.body.number;
    var subject = req.body.subject;
    var user_message = req.body.message;
    var email = req.body.email;

    // spam protection
    if (spam) {
      res.send({
        message: 'spambot',
        err: true
      });
      return;
    }

    // check email
    if (email) {
      var isValidEmail = validator.validate(email);
      if (!isValidEmail) {
        res.status(400).send({
          message: 'invalid email',
          err: true
        });
        return;
      }
    }


    if (name && number && subject && user_message) {

      var mail = mailcomposer({
        from: EMAIL_FROM,
        to: EMAIL_TO,
        subject: name + '::' + subject,
        body: 'Test email subject',
        html: compiledTemplate.render({name: name, email: email, number: number, subject: subject, message: user_message})
      });

      mail.build(function (mailBuildError, message) {

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
          newClient.subject = subject;
          newClient.message = user_message;
          newClient.email = email;
          newClient.ip = req.ip;
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

