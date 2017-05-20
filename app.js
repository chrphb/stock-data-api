'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
module.exports = app; // for testing
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
var bodyParser = require('body-parser') ;
var morgan = require("morgan");

var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://chrphb.eu.auth0.com/.well-known/jwks.json"
    }),
    audience: 'https://daubassesdataapi.com',
    issuer: "https://chrphb.eu.auth0.com/",
    algorithms: ['RS256']
});

module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

var error400 = function(err, req, res, next) {
  if(err.name == "UnauthorizedError") {
    res.status(401).json({message: "Missing or invalid authorization token"});
    //next();
  } else {
    res.status(400).send({error: "can't find this"});
    //next() ;
  }
} ;


app.use(morgan('combined')) ;
app.use(bodyParser.raw()) ;
app.use(bodyParser.urlencoded({ extended: true }));

// Generic Error
app.use(error400);

app.use(jwtCheck);

// CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);
  var port = process.env.PORT || 10010;
  app.listen(port);

});
