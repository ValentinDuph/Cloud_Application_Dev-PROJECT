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
      var origin_city = req.query.from;
      var dest_cty = req.query.to;
      var date = new Date(req.query.on);
        mongoClient.connect(url_db, function(err, db) {
          db.collection(flights_collection).aggregate([
            {
        			$match: {
        				ORIGIN_CITY_NAME: origin_city,
        				DEST_CITY_NAME: dest_cty,
        				FL_DATE: date,
        			}
            },
            {
        			$project: {
        				"Airline" : "$AIRLINE_NAME",
        				"Flight Number" : "$FL_NUM",
        				"Date" : "$FL_DATE",
        				"Departure Time" : "$DEP_TIME",
        				"Arrival Time" : "$ARR_TIME",
        				"Flight Time" : "$AIR_TIME",
        			}
        		}
          ]).toArray(function(err, result) {
            if (err) throw err;
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(result));
            db.close();
          });
        });
        break;

    case 'company_flights':
      var company = req.query.for;
      var date = new Date(req.query.on);
      mongoClient.connect(url_db, function(err, db) {
        db.collection(flights_collection).aggregate([
          {
            $match: {
              AIRLINE_NAME:company,
              FL_DATE:date,
            }
          },
          {
            $project: {
              "Airline" : "$CARRIER",
              "Flight Number" : "$FL_NUM",
              "Departure" : "$ORIGIN_CITY_NAME",
              "Arrival" : "$DEST_CITY_NAME",
              "Date" : "$FL_DATE",
              "Departure Time" : "$DEP_TIME",
              "Arrival Time" : "$ARR_TIME",
              "Flight Time" : "$AIR_TIME",
            }
          }
        ]).toArray(function(err, result) {
          if (err) throw err;
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(result));
          db.close();
        });
      });
      break;

    case 'airport_flights':
      var airport = req.query.for;
      var date = new Date(req.query.on);
      mongoClient.connect(url_db, function(err, db) {
        db.collection(flights_collection).aggregate([
          {
            $match: {
              $or: [ { ORIGIN_CITY_NAME: airport} , { DEST_CITY_NAME: airport } ],
              FL_DATE:date95959+5*+4,
            }
          },
          {
            $project: {
              "Airline" : "$AIRLINE_NAME",      //A CHANGER
              "Flight Number" : "$FL_NUM",
              "Date" : "$FL_DATE",
              "Departure Time" : "$DEP_TIME",
              "Arrival Time" : "$ARR_TIME",
              "Flight Time" : "$AIR_TIME",
            }
          }
        ]).toArray(function(err, result) {
          if (err) throw err;
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(result));
          db.close();
        });
      });
      break;

    case 'flight_info' :
      var flightNb = req.query.for;

      mongoClient.connect(url_db, function(err, db) {
        db.collection(flights_collection).find({
            "FL_NUM" : flightNb,
        }, {
            "_id" : 0.0,
            "CARRIER" : 1.0,
            "FL_NUM" : 1.0,
            "ORIGIN_CITY_NAME" : 1.0,
            "DEST_CITY_NAME" : 1.0
        }).toArray(function(err, result) {
          if (err) throw err;
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(result));
          db.close();
        })
      });
      break;

    case 'get_all' :
      api.getAll(req,res);
      break;

    case 'airports' :
      api.getAirports(req, res)
      break;

    case 'company':
      // Return list of airline companies
      mongoClient.connect(url_db, function(err, db) {
        db.collection(flights_collection).aggregate([
          {
            $group:{
              _id:'$AIRLINE_NAME'
            }
          },
          { $sort : { _id : 1 } }
        ]).toArray(function(err, result) {
          if (err) throw err;
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(result));
          db.close();
        });
      });
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

    default:
      break;
  }
})

server.on('close', function() { // On écoute l'évènement close
  console.log('Bye bye !');
})
