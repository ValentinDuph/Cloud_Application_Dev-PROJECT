/// ALL REQUIRED PACKAGES
var http = require('http');
var url = require('url');
var querystring = require('querystring');
var fct = require('functions'); // Fait appel à functions_lib.js (dans le dossier functions)
var express = require('express');
var path = require('path');
var mongodb = require('mongodb');

// CONSTANTE VARIABLES
const app = express();
const mongoClient = mongodb.MongoClient;
const url_db = "mongodb://localhost:27017/Airline";

// Store all HTML files in view folder.
app.use(express.static('www'));


app.get('/findOne', function(req,res) {
  mongoClient.connect(url_db, function(err, db) {
    if (err) throw err;
    db.collection("On_Time_On_Time_Performance_2016_1").findOne({}, function(err, result) {
      if (err) throw err;
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(result));
      db.close();
    });
  });
})

app.get('/test', function (req, res) {
  res.sendFile( __dirname + "/www/index0.html" );
})

var server = app.listen(8080, function () {
  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port);
  fct.direBonjour();
})

server.on('close', function() { // On écoute l'évènement close
  console.log('Bye bye !');
})
