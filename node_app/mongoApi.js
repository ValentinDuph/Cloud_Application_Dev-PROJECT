
var mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const url_db = "mongodb://localhost:27017/Airline";
const flights_collection = "FLIGHTS"
const log_collection = "LOG_ADM"

function insertToLog(req, res, date, query, type, time) {
  var new_log = {
    "date" : date,
    "query" : query,
    "type" : type,
    "time" : time
  };

  mongoClient.connect(url_db, function(err, db) {
    if (err) throw err;
    db.collection(log_collection).insertOne(new_log, function(err,res) {
      if(err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
}

exports.getAll = function(req,res){
  var date = new Date();
  // Return list of 500 flights
  mongoClient.connect(url_db, function(err, db) {
    db.collection(flights_collection).find({}).limit(500).toArray(function(err, result) {
      if (err) throw err;
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(result));
      db.close();
    })
  });
  insertToLog(req, res, date, "getAll", "ANALYST", new Date() - date);
}

exports.getAirports = function(req,res) {
  // Return list of airports city name
  var date = new Date();
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
  insertToLog(req, res, date, "getAirports", "STANDARD+ANALYST", new Date() - date);
}

exports.getCompany = function(req,res){
  // Return list of airline companies
  var date = new Date();
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
  insertToLog(req, res, date, "getCompany", "STANDARD", new Date() - date);
}

exports.getCompanyFlights = function(req,res){
  var company = req.query.for;
  var flight_date = new Date(req.query.on);
  var date = new Date();
  mongoClient.connect(url_db, function(err, db) {
    db.collection(flights_collection).aggregate([
      {
        $match: {
          AIRLINE_NAME:company,
          FL_DATE:flight_date,
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
  insertToLog(req, res, date, "getCompanyFlights", "STANDARD", new Date() - date);
}

exports.getFlightInfo = function(req,res){
  var flightNb = req.query.for;
  var date = new Date();
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
  insertToLog(req, res, date, "getFlightInfo", "STANDARD", new Date() - date);
}

exports.getAirportFlights = function(req,res){
  var airport = req.query.for;
  var flight_date = new Date(req.query.on);
  var date = new Date();
  mongoClient.connect(url_db, function(err, db) {
    db.collection(flights_collection).aggregate([
      {
        $match: {
          $or: [ { ORIGIN_CITY_NAME: airport} , { DEST_CITY_NAME: airport } ],
          FL_DATE:flight_date,
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
  insertToLog(req, res, date, "getFlightsbyAirports", "STANDARD", new Date() - date);
}

exports.getJourney = function(req,res){
  var origin_city = req.query.from;
  var dest_cty = req.query.to;
  var flight_date = new Date(req.query.on);
  var date = new Date();
  mongoClient.connect(url_db, function(err, db) {
    db.collection(flights_collection).aggregate([
      {
        $match: {
          ORIGIN_CITY_NAME: origin_city,
          DEST_CITY_NAME: dest_cty,
          FL_DATE: flight_date,
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
  insertToLog(req, res, date, "getJourney", "STANDARD", new Date() - date);
}

exports.getOriginDestination = function(req,res) {
  var date_from = new Date(req.query.from);
  var date_to = new Date (req.query.to);
  var origin_airport = req.query.o_airport;
  var date = new Date();
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
  insertToLog(req, res, date, "getOriginDestination", "STANDARD", new Date() - date);
}

exports.getAvgDelayArr = function(req,res) {
  var airport = req.query.airport;
  var date = new Date();
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
    });
  });
  insertToLog(req, res, date, "getAvgDelayArr", "ANALYST", new Date() - date);
}

exports.getAvgDelayDep = function(req,res) {
  var airport = req.query.airport;
  var date = new Date();
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
    });
  });
  insertToLog(req, res, date, "getAvgDelayDep", "ANALYST", new Date() - date);
}

exports.get10ArrCompanies = function(req,res) {
  var airport = req.query.airport;
  var date = new Date();
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
    });
  });
  insertToLog(req, res, date, "get10ArrCompanies", "ANALYST", new Date() - date);
}

exports.get10DepCompanies = function (req,res) {
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
    });
  });
}

exports.getLog = function(req,res) {
  var date;
  var t = req.query.type;
  if(t==undefined) {
      date = new Date();
      mongoClient.connect(url_db, function(err, db) {
        db.collection(log_collection).find(
        ).sort({date: -1}).toArray(function(err, result) {
          if (err) throw err;
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(result));
          db.close();
        });
      });
      insertToLog(req, res, date, "getLog "+t, "ADMINISTRATOR", new Date() - date);
    } else {
      date = new Date()
      mongoClient.connect(url_db, function(err, db) {
        db.collection(log_collection).aggregate([
          {
            $match: {
              type : {$regex : ".*"+t+".*"}
            }
          },
          {
            $project: {
              query : 1,
              time : 1
            }
          },
          {
            $group: {
              _id : "$query",
              "time_avg" : { $avg : "$time"}
            }
          }
        ]).toArray(function(err, result) {
          if (err) throw err;
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(result));
          db.close();
        });
      });
      insertToLog(req, res, date, "getLog "+t.substring(0,3), "ADMINISTRATOR", new Date() - date);
    }
}
