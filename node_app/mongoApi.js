
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
  var date = new Date();
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
  insertToLog(req, res, date, "getAirports", "ANALYST", new Date() - date);
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
