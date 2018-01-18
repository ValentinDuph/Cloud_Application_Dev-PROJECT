/// ALL REQUIRED PACKAGES
var http = require('http');
var url = require('url');
var querystring = require('querystring');
var fct = require('./functions.js'); // Fait appel à functions.js (dans le dossier functions)
var api = require('./mongoApi.js') // Fait appel à mongoApi.js
var path = require('./paths.js') // Fait appel à mongoApi.js
var express = require('express');
var mongodb = require('mongodb');

// CONSTANTE VARIABLES
const app = express();
const mongoClient = mongodb.MongoClient;
const url_db = "mongodb://localhost:27017/Airline";
const flights_collection = "FLIGHTS"

var server = app.listen(8080, function () {
  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port);
  fct.direBonjour();
})

// Store all HTML files in view folder.
app.use(express.static('www'));

app.get('/standard', function (req, res) {
  res.sendFile( path.app_standard + "index.html" );
})
app.get('/flightInfo', function (req, res) {
  var flight_id = req.query.id;
  res.sendFile( path.app_standard + "flightInfo.html", {id:flight_id} );
})
app.get('/analyst', function (req, res) {
  res.sendFile( path.app_analyste + "analyst.html" );
})
app.get('/admin', function (req, res) {
  res.sendFile( path.app_administrateur + "" );
})

app.get('/db_data', function(req,res) {
  var query_type = req.query.q;

  switch(query_type) {

    case 'flights_arc' :
      api.getOriginDestination(req,res);
      break;

    case 'journey' :
      api.getJourney(req,res);
      break;

    case 'company_flights':
      api.getCompanyFlights(req,res);
      break;

    case 'airport_flights':
      api.getAirportFlights(req,res);
      break;

    case 'flight_info' :
      api.getFlightInfo(req,res);
      break;

    case 'get_all' :
      api.getAll(req,res);
      break;

    case 'airports' :
      api.getAirports(req,res);
      break;

    case 'company':
      api.getCompany(req,res);
      break;

    case 'dep_delay_avg' :
      api.getAvgDelayDep(req,res)
      break;

    case 'arr_delay_avg' :
      api.getAvgDelayArr(req,res);
      break;

    case 'arr10companies':
      api.get10ArrCompanies(req,res);
      break;

    case 'dep10companies':
      api.get10DepCompanies(req,res);
      break;

    case 'getLog':
      api.getLog(req,res)
      break;

    default:
      break;
  }
})

server.on('close', function() { // On écoute l'évènement close
  console.log('Bye bye !');
})
