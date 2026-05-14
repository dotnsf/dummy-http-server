//. app.js
var express = require( 'express' ),
    bodyParser = require( 'body-parser' ),
    app = express();

//. Env values
var AUTH_USERNAME = 'AUTH_USERNAME' in process.env ? process.env.AUTH_USERNAME : "user"; 
var AUTH_PASSWORD = 'AUTH_PASSWORD' in process.env ? process.env.AUTH_PASSWORD : "pass"; 

app.use( bodyParser.urlencoded({ extended: true}) );
app.use( bodyParser.json() );
app.use( express.Router() );

if( AUTH_USERNAME && AUTH_PASSWORD ){
  var basicAuth = require( 'basic-auth-connect' );
  app.all( '/auth', basicAuth( AUTH_USERNAME, AUTH_PASSWORD ) );

  app.all( '/auth', function( req, res ){
    var method = req.method;
    res.contentType( 'application/json; charset=utf-8' );
    res.write( JSON.stringify( { status: true, text: "Hello Authed-" + method + " World!" }, null, 2 ) );
    res.end();
  });
}

app.all( '/', function( req, res ){
  var method = req.method;
  res.contentType( 'application/json; charset=utf-8' );
  res.write( JSON.stringify( { status: true, text: "Hello " + method + " World!" }, null, 2 ) );
  res.end();
});

var port = process.env.PORT || 8080;
app.listen( port );
console.log( "server starting on " + port + " ..." );
