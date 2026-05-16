//. app.js
var express = require( 'express' ),
    asiosBase = require( 'axios' ),
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
    var json = { status: true, text: "Hello Authed-" + method + " World!" };
    if( req.body ){
      var body = req.body;
      json.body = body;
    }
    res.contentType( 'application/json; charset=utf-8' );
    res.write( JSON.stringify( json, null, 2 ) );
    res.end();
  });
}

app.all( '/', function( req, res ){
  var method = req.method;
  var json = { status: true, text: "Hello " + method + " World!" };
  if( req.body ){
    var body = req.body;
    json.body = body;
  }

  res.contentType( 'application/json; charset=utf-8' );
  res.write( JSON.stringify( json, null, 2 ) );
  res.end();
});

app.all( '/redirect', function( req, res ){
  res.redirect( 301, '/' );  //. 301: Not found, 302: Found
});

app.all( '/proxy', async function( req, res ){
  var method = req.method;
  var headers = req.headers;
  //console.log( JSON.stringify( req.query, null, 2 ) );
  var _url = req.query._url;
  if( _url ){
    var _query = '';
    if( req.query ){
      var ary = [];
      Object.keys( req.query ).forEach( function( key ){
        var value = req.query[key];
        ary.push( key + '=' + value );
      });
      if( ary.length > 0 ){
        _query = '?' + ary.join( '&' );
      }
    }
    var body = req.body;

    var response = await _request( _url + _query, method, body, headers );
    res.write( JSON.stringify( response, null, 2 ) );
    res.end();
  }else{
    res.status( 400 ); 
    res.contentType( 'application/json; charset=utf-8' );
    res.write( JSON.stringify( { status: false, usage: '?_url=https://example.com/xxx/' }, null, 2 ) );
    res.end();
  }
});

async function _request( url, method, body, headers ){
  return new Promise( function( resolve, reject ){
    var options = {
      method: method,
      url: url,
      headers: headers,
      data: body
    };
    axiosBase.request( options )
      .then( function( response ){
        resolve( response.data );
      })
      .catch( function( error ){
        reject( error );
      });
  });
}


var port = process.env.PORT || 8080;
app.listen( port );
console.log( "server starting on " + port + " ..." );
