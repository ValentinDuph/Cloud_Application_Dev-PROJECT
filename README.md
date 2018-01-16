# [PROJET] Développement d'application Cloud

##### Cloud_Application_Dev-PROJEC

## Introduction
This repository contains a school project.
The aim of this project is to Visualize Data using simple and complex queries.
We choose a database containing information of USA flights in January, February and March.

<a href="https://relational.fit.cvut.cz/dataset/Airline"><b>[SQL Database : Airline]</b></a>

Database ref. : https://www.transtats.bts.gov/DL_SelectFields.asp?Table_ID=236&DB_Short_Name=On-Time
## Technologies

1. NodeJS
2. MongoDB
3. D3js

## Installation

1. Clone repository
```
git clone https://github.com/akiraquenot/Cloud_Application_Dev-PROJECT
```

2. Install project dependencies using npm
```
cd Cloud_Application_Dev-PROJECT/node_app
npm install dependencies
```

3. Run mongodb server in a new Terminal
```
mongod
```

4. Import data into your mongo server. You can easily do that using a Mongo Client :
  * Connect the client to the server
  * Import data : Right click on your server > "Import..." > "BSON - mongodump folder" > Select the folder : Cloud_Application_Dev-PROJECT/data/data_BSON_new/"

5. Run Node server
```
node node_app/server.js
```

6. Go to http://localhost:8080/ to display index.html
