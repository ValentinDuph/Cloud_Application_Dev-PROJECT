var airports_list = [];
var companies_list = [];
var currentQueryArgument = [];

//PRE-LOAD AND STOCK SIMPLES QUERIES
//LIKE AIRPORTS AND COMPANIES LIST
function onload(){
  console.log("loading...");

  var query_company = "/db_data?q=company";
  var query_airport = "/db_data?q=airports";
  d3.json(query_company, function(json_data) {
    json_data.forEach(function(doc){
      companies_list.push(doc[Object.keys(doc)] );
    });
    move(80,100);
  });

  d3.json(query_airport, function(json_data) {
    json_data.forEach(function(doc){
      airports_list.push(doc[Object.keys(doc)] );
    });
    move(5,80);
  });

  console.log(companies_list);



  console.log(airports_list);

  console.log("Loaded!");
}

function move(from,to) {
    var bar = document.getElementById("progress")
    var elem = document.getElementById("result-progress");
    var width = from;
    var id = setInterval(frame, 10);
    function frame() {
      if(width > 99){
        bar.style.visibility = 'hidden';
      }
      if (width >= to) {
          clearInterval(id);
      } else {
          width++;
          elem.style.width = width + '%';
      }
    }
}

function querySelect(){
  var selectors = document.getElementById("selectors");
  while (selectors.firstChild) {       //clean previous selector list
    selectors.removeChild(selectors.firstChild);
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
      currentQueryArgument = ["company","date"];
      break;
    case "3":
      currentQueryArgument = ["airport","date"];
      break;
    case "4":
      currentQueryArgument = ["departure","arrival","date"];
      break;
  }
  currentQueryArgument.forEach(function(argument){
    var objTo = document.getElementById("selectors");
    if(argument == "date"){
      var newElement = document.createElement('input');
      newElement.id = argument;
      newElement.type = "date";
      objTo.appendChild(newElement);
    }
    else{
      objTo.appendChild(generateElementSelect(argument));
    }
  });
}

//CREATE SELECTORS IN FUNCTION OF QUERY
function generateElementSelect(argument){
  var new_select = document.createElement('select');
  new_select.id = argument;
  var new_option = document.createElement('option');
  // new_option.selected;
  // new_option.disabled;
  new_option.innerHTML = "Choose the " + argument;
  new_select.appendChild(new_option);

  // if(argument == "departure" || argument == "arrival" || argument == "airport"){
  //   var query = query_airport;
  // }
  // else if(argument == "company"){
  //   var query = query_company;
  // }
  // //var query = "/db_data?q=" + argument;
  // d3.json(query, function(json_data) {
  //   //alert(json_data[1][Object.keys(json_data[1])]);
  //   json_data.forEach(function(doc){
  //     //alert(doc[Object.keys(doc)]);
  //     var new_option = document.createElement('option');
  //     new_option.innerHTML = doc[Object.keys(doc)];
  //     new_select.appendChild(new_option);
  //   });
  // });

  var option_List;
  if(argument == "departure" || argument == "arrival" || argument == "airport"){
    option_List = airports_list;
  }
  else if(argument == "company"){
    option_List = companies_list;
  }

  option_List.forEach(function(option){
    var new_option = document.createElement('option');
    new_option.innerHTML = option;
    new_select.appendChild(new_option);
  })
  return new_select;
}


// CREATE ARRAY FROM JSON
function json_ToArray(json_data){
  if(json_data != null && json_data != "" && json_data != "[]"){
    console.log(json_data);
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
  else{ alert("No data founded")}
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
        var company = document.getElementById("company");
        var date = document.getElementById("date");
        query += 'company_flights&for=' + company.value + '&on=' + date.value;
        break;
      case "3":
        var airport = document.getElementById("airport");
        var date = document.getElementById("date");
        query += 'airport_flights&for=' + airport.value + '&on=' + date.value;
        break;
      case "4":
        var departure = document.getElementById("departure");
        var arrival = document.getElementById("arrival");
        var date = document.getElementById("date");
        query += 'journey&from='+ departure.value + '&to=' + arrival.value + '&on=' + date.value;
        break;
      default: alert("error");
    }
    console.log(query);
  }
  d3.json(query, function(json_data) {
    json_ToArray(json_data);
  });
}
