/// ALL REQUIRED PACKAGES
var http = require('http');
var url = require('url');
var querystring = require('querystring');
var fct = require('./functions.js'); // Fait appel à functions_lib.js (dans le dossier functions)
var express = require('express');
var path = require('path');
var mongodb = require('mongodb');

// CONSTANTE VARIABLES
const app = express();
const mongoClient = mongodb.MongoClient;
const url_db = "mongodb://localhost:27017/Airline";
const flights_collection = "On_Time_On_Time_Performance_2016_1"

//PATHS
const path_app_standard = __dirname + "/www/App_Standard/";
const path_app_analyste = __dirname + "/www/App_Analyste/";
const path_app_administrateur = __dirname + "/www/App_Administrateur/";;

var server = app.listen(8080, function () {
  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port);
  fct.direBonjour();
})

// Store all HTML files in view folder.
app.use(express.static('www'));

app.get('/standard', function (req, res) {
  res.sendFile( path_app_standard + "index.html" );
})
app.get('/analyst', function (req, res) {
  res.sendFile( path_app_analyste + "map.html" );
})
app.get('/flightInfo', function (req, res) {
  var flight_id = req.query.id;
  res.sendFile( path_app_analyste + "flightInfo.html" );
})

app.get('/admin', function (req, res) {
  res.sendFile( path_app_administrateur + "" );
})

app.get('/db_data', function(req,res) {
  var query_type = req.query.q;

  switch(query_type) {
    case 'flights_arc' :
      var from = new Date(req.query.from);
      var to = new Date (req.query.to);
      var o_airport = req.query.o_airport;

      console.log(o_airport);
      console.log(from + ' --> ' + to);
      mongoClient.connect(url_db, function(err, db) {
        db.collection(flights_collection).aggregate(
          [
            {
              $match: {
                OriginCityName : o_airport,
                FlightDate: {$gte: from, $lte: to}
              }
            },
            {
              $project: {
                  "origin" : "$OriginState",
                  "destination" : "$DestState",
                  FlightDate : 1
              }
            },
          ]
        ).toArray(function(err, result) {
          if (err) throw err;
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(result));
          db.close();
        });
      });
      break;
    case 'flight_info' :
      var flightNb = req.query.for;
      //var date = new Date(req.query.on);
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
      mongoClient.connect(url_db, function(err, db) {
        db.collection(flights_collection).find({}).limit(100).toArray(function(err, result) {
          if (err) throw err;
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(result));
          db.close();
        })
      )};
      break;
    case 'airports' :
      mongoClient.connect(url_db, function(err, db) {
        db.collection(flights_collection).aggregate([
                    {
                      $group:{
                        _id:'$OriginCityName'
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
      case 'delay_avg':
        mongoClient.connect(url_db, function(err, db) {
          db.collection(flights_collection).aggregate([
            {
              $match: {
                "DepDel15" : { "$exists": true, "$ne": "NULL" }
              }
            },
            {
              $project: {
                _id : "$OriginCityName",
                "DepDel15" : '$DepDel15'
              }
            },
            {
              $group: {
                _id : "$_id",
                "avg_Delay": { $avg: "$DepDel15"}
              }
            },
            {
              $sort: {
                'avg_Delay' : -1
              }
            }
          ]).toArray(function(err, result) {
            if (err) throw err;
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(result));
            db.close();
          });;
        });
        break;
    default:
      break;
  }
})

app.get('/findOne', function(req,res) {
  mongoClient.connect(url_db, function(err, db) {
    if (err) throw err;
    db.collection(flights_collection).findOne({}, function(err, result) {
      if (err) throw err;
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(result));
      db.close();
    });
  });
})

app.get('/findAll', function(req,res) {
  mongoClient.connect(url_db, function(err, db) {
    if (err) throw err;
    db.collection(flights_collection).find({}).toArray(function(err, result) {
      if (err) throw err;
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(result));
      db.close();
    });
  });
})

server.on('close', function() { // On écoute l'évènement close
  console.log('Bye bye !');
})
