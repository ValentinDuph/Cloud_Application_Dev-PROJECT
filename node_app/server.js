/// ALL REQUIRED PACKAGES
var http = require('http');
var url = require('url');
var querystring = require('querystring');
var fct = require('./functions.js'); // Fait appel à functions_lib.js (dans le dossier functions)
var api = require('./mongoApi.js')
var express = require('express');
var path = require('path');
var mongodb = require('mongodb');

// CONSTANTE VARIABLES
const app = express();
const mongoClient = mongodb.MongoClient;
const url_db = "mongodb://localhost:27017/Airline";
const flights_collection = "FLIGHTS"

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
  res.sendFile( path_app_analyste + "analyst.html" );
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

      var date_from = new Date(req.query.from);
      var date_to = new Date (req.query.to);
      var origin_airport = req.query.o_airport;

      mongoClient.connect(url_db, function(err, db) {
        db.collection(flights_collection).aggregate([
          {
            $match: {
              ORIGIN_CITY_NAME : origin_airport,
              FL_DATE : {$gte: date_from, $lte: date_to}
            },
          },
          { $limit : 50 },
          {
            $project: {
                "origin" : "$ORIGIN_STATE_ABR",
                "destination" : "$DEST_STATE_ABR",
                "FlightDate" : "$FL_DATE"
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

    case 'journey_info' :
      var origin_city = req.query.from;
      var dest_cty = req.query.to;
      var date = new Date(req.query.on);
        mongoClient.connect(url_db, function(err, db) {
          db.collection(flights_collection).aggregate([
            {
        			$match: {
        				ORIGIN_CITY_NAME:origin_city,
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
      mongoClient.connect(url_db, function(err, db) {
        db.collection(flights_collection).find({}).limit(500).toArray(function(err, result) {
          if (err) throw err;
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(result));
          db.close();
        })
      });
      break;

    case 'airports' :
      // Return list of airports city name
      mongoClient.connect(url_db, function(err, db) {
        db.collection(flights_collection).aggregate([
          {
            $group:{
              _id:'$ORIGIN_CITY_NAME'
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

    case 'company_Name':
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

      var airport = req.query.airport;

      mongoClient.connect(url_db, function(err, db) {
        db.collection(flights_collection).aggregate([
          {
            $match: {
              "DEP_DEL15" : { "$exists": true, "$ne": "NULL" },
              "DEP_DELAY" : { "$exists": true, "$ne": "NULL" },
              ORIGIN_CITY_NAME : airport
            }
          },
          {
            $project: {
              _id : "$ORIGIN_CITY_NAME",
              "DepDel15" : '$DEP_DEL15',
              "DepDelay" : '$DEP_DELAY'
            }
          },
          {
            $group: {
              _id : "$_id",
              "avg_Delay": { $avg: "$DepDel15"},
              "avg_DelayTime": { $avg: "$DepDelay"},
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

      case 'arr_delay_avg' :
        var airport = req.query.airport;

        mongoClient.connect(url_db, function(err, db) {
          db.collection(flights_collection).aggregate([
            {
              $match: {
                "ARR_DEL15" : { "$exists": true, "$ne": "NULL" },
                "ARR_DELAY" : { "$exists": true, "$ne": "NULL" },
                DEST_CITY_NAME : airport
              }
            },
            {
              $project: {
                _id : "$DEST_CITY_NAME",
                "ArrDel15" : '$ARR_DEL15',
                "ArrDelay" : '$ARR_DELAY',
              }
            },
            {
              $group: {
                _id : "$_id",
                "avg_Delay": { $avg: "$ArrDel15"},
                "avg_DelayTime": { $avg: "$ArrDelay"},
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

    case 'delay_avg':
      mongoClient.connect(url_db, function(err, db) {
        db.collection(flights_collection).aggregate([
          {
            $match: {
              "DEP_DEL15" : { "$exists": true, "$ne": "NULL" }
            }
          },
          {
            $project: {
              _id : "$ORIGIN_CITY_NAME",
              "DepDel15" : '$DEP_DEL15'
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

    case 'arr10companies':
      var airport = req.query.airport;

      mongoClient.connect(url_db, function(err, db) {
        db.collection(flights_collection).aggregate([
          {
      			$match: {
      			  DEST_CITY_NAME : airport
      			}
      		},
          {
      			$project: {
      			    AIRLINE_NAME : 1
      			}
      		},
          {
      			$group: {
      			  _id: "$AIRLINE_NAME",
      			  count : {$sum : 1}
      			}
      		},
          {
      			$sort: {
      			  count : -1
      			}
      		},
          {
      			$limit: 10
      		}
      	]).toArray(function(err, result) {
          if (err) throw err;
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(result));
          db.close();
        });;
      });
      break;

    case 'dep10companies':
      var airport = req.query.airport;

      mongoClient.connect(url_db, function(err, db) {
        db.collection(flights_collection).aggregate([
          {
      			$match: {
      			  ORIGIN_CITY_NAME : airport
      			}
      		},
          {
      			$project: {
      			    AIRLINE_NAME : 1
      			}
      		},
          {
      			$group: {
      			  _id: "$AIRLINE_NAME",
      			  count : {$sum : 1}
      			}
      		},
          {
      			$sort: {
      			  count : -1
      			}
      		},
          {
      			$limit: 10
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

server.on('close', function() { // On écoute l'évènement close
  console.log('Bye bye !');
})
