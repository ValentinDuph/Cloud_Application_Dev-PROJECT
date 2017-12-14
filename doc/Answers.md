# [PROJET] Développement d'application Cloud

##### Cloud_Application_Dev-PROJEC

## 1.1 Jeux de données
In this project, we are using the Airlines database.
<b>[SQL Database : Airline]</b>


## 1.2 Spécification des besoins

4 queries for a standard user:
- For one flight, get all time infos (departure, arrival, delay, etc.)
- For one company, get all flights in a specified time
- For one airport get all flights arrival and departure in a specified time
- For one journey, get all flights sort by time


2 queries for analysts:
- Get flight delay average (departure and arrival) by airports
- Get sum of of delay by company
- top 5 airports
- pour chaque aeroport, la company qui fait le plus de vol

Performance indicators:
- Result time for a given amount of datas
- Result time for a result amount of datas





```
db.FLIGHTS.update({},
{$set: {AIRLINE_NAME: null}},
{multi: true});

db.FLIGHTS.find().forEach(function (flightInfo) {

    var doc2 = db.L_AIRLINE_ID.findOne({ Code : flightInfo.AIRLINE_ID }, { Description: 1 });

    if (doc2 != null) {
        flightInfo.AIRLINE_NAME = doc2.Description;
        db.FLIGHTS.save(flightInfo);
    }
});


WriteResult({ "nMatched" : 1349131, "nUpserted" : 0, "nModified" : 1349131 })
```
