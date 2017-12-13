

var standardQueries = [
  //"Get all time infos for one flight",
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
      currentQueryArgument = ["flight_Number","date"];
      break;
    case "2":
      currentQueryArgument = ["company_Name"];
      break;
    case "3":
      currentQueryArgument = ["airport_Code"];
      break;
    case "4":
      currentQueryArgument = ["departure","arrival","date"];
      break;
  }
  currentQueryArgument.forEach(function(argument){
    var objTo = document.getElementById("formQuery");
    if(argument == "date"){
      var newElement = document.createElement('input');
      newElement.id = argument;
      newElement.type = "date";
    }
    else{
      var newElement = document.createElement('select');
      newElement.id = argument;
      newElement.appendChild()

    }
    // var newElement = document.createElement('input');
    // newElement.id = argument;
    // if(argument == "date"){ newElement.type = "date"; }
    // else{ newElement.type = "text"; }
    // newElement.placeholder = argument;
    childList.push(newElement.id);
    objTo.insertBefore(newElement, document.getElementById("submitButton"));

  });

}

// CREATE ARRAY FROM JSON
function json_ToArray(json_data){
  if(json_data != null){
    var fields = Object.keys(json_data[0]);

    // CREATE HEAD OF ARRAY
    var table_head = document.getElementById("table_head");
    while (table_head.firstChild) {       //clean previous head
      table_head.removeChild(table_head.firstChild);
    }
    fields.forEach(function(field){       //add fields to array head
      if(field != "_id"){
        var new_th = document.createElement("th");
        new_th.innerHTML = field;
        table_head.appendChild(new_th);
      }
    });
    // CREATE ARRAY BODY
    var table_body = document.getElementById("table_body");
    while (table_body.firstChild) {       //clean previous body
      table_body.removeChild(table_body.firstChild);
    }
    for(var i = 0; i < json_data.length; i++){      //for each row of json
      var new_tr = document.createElement("tr");
      new_tr.onclick = flightInfo;
      table_body.appendChild(new_tr);
      fields.forEach(function(field){
        if(field != "_id"){
          var new_td = document.createElement("td");
          new_td.innerHTML = json_data[i][field];
          new_tr.appendChild(new_td);
        }
      })
    }
  }
}

function flightInfo(){
  var childlist = this.childNodes;
  var str = '';
  childlist.forEach(function(child){
    str += child.innerHTML;
  })
  alert(str);
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
        query += 'journey_info&from='+ departure.value + '&to=' + arrival.value + '&on=' + date.value;
        break;
      default: alert("error");
    }
  }
  d3.json(query, function(json_data) {
    json_ToArray(json_data);
  });

}
