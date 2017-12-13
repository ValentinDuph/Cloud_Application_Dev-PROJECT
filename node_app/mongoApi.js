
function getAirports(mongoClient, url_db, flights_collection, req, res) {
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
}

exports.getAirports = getAirports;
