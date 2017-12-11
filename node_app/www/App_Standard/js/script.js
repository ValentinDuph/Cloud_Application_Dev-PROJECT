

var standardQueries = [
  "Get all time infos for one flight",
  "Get all flights of one company",
  "Get all flights arrival and departure of one airport",
  "Get all flights sorted by time for one journey",
]


var currentQueryArgument = [];
var childList = [];

function querySelect(){

  if (childList != null) {
    childList.forEach(function(nodeChild){
      var elem = document.getElementById(nodeChild);
      elem.parentNode.removeChild(elem);
      childList = [];
      return false;
    });
  }
  var querySelected = document.getElementById("querySelector").value;

  switch (querySelected) {
    case "0":
      currentQueryArgument = [];
      break;
    case "1":
      currentQueryArgument = ["flight_Number","date"]
      break;
    case "2":
      currentQueryArgument = ["company_Name"]
      break;
    case "3":
      currentQueryArgument = ["airport_Code"]
      break;
    case "4":
      currentQueryArgument = ["departure","arrival","date"]
      break;
  }

  currentQueryArgument.forEach(function(argument){
    var objTo = document.getElementById("formQuery");
    var newElement = document.createElement('input');
    newElement.id = argument;
    if(argument == "date"){ newElement.type = "date"; }
    else{ newElement.type = "text"; }
    newElement.placeholder = argument;
    //newElement.value= argument;
    childList.push(newElement.id);
    //objTo.appendChild(newElement);
    objTo.insertBefore(newElement, document.getElementById("submitButton"));

  });

}

function query(){
  var query = "/db_data?q=";
  var queryNb = document.getElementById("querySelector");
  if(queryNb.value != "1" && queryNb.value != "2" && queryNb.value != "3" && queryNb.value != "4"){
    alert("Please select a query");
  }
  else{
    switch (queryNb.value) {
      case "1":
        var flight_Number = document.getElementById("flight_Number");
        var date = document.getElementById("date");
        query += 'flight_info&for='+ flight_Number.value + '&on=' + date.value;
        break;
      case "2":
        var company_Name = document.getElementById("company_Name");
        query += 'company_flights&for='+company_Name.value;
        break;
      case "3":
        var airport_Code = document.getElementById("airport_Code");
        query += 'ariport_flights&for='+airport_Code.value;
        break;
      case "4":
        var departure = document.getElementById("departure");
        var arrival = document.getElementById("arrival");
        var date = document.getElementById("date");
        query += 'flight&from='+ departure.value + '&to=' + arrival.value + '&on=' + date.value;
        break;
      default: alert("error");
    }
  }
  alert(query);
  d3.json(query, function(json_data) {
    // Arcs coordinates can be specified explicitly with latitude/longtitude,
    // or just the geographic center of the state/country.
    console.log(json_data);
  });

}
