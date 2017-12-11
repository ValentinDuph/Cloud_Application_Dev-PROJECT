function onload() {
  displayDelay();
  getAirportList();
}
function displayDelay() {
  $.getJSON('db_data?q=delay_avg', function(data) {
      var container = document.getElementById("percentage-container");
      for (item of data) {
        container.innerHTML += '<div class="col-md-2">'
        + '<svg viewbox="0 0 36 36" class="circular-chart blue">'
        + '<path class="circle-bg"'
        + 'd="M18 2.0845'
        + 'a 15.9155 15.9155 0 0 1 0 31.831'
        + 'a 15.9155 15.9155 0 0 1 0 -31.831"'
        + '/>'
        + '<path class="circle"'
        + 'stroke-dasharray="' + parseFloat(item.avg_Delay)*100 + ', 100"'
        + 'd="M18 2.0845'
        + 'a 15.9155 15.9155 0 0 1 0 31.831'
        + 'a 15.9155 15.9155 0 0 1 0 -31.831"'
        + '/>'
        + '<text x="18" y="19" class="percentage">' + item._id + ' (' + parseInt(parseFloat(item.avg_Delay)*100) + '%)</text>'
        + '</svg>'
        + '</div>'
      }
  });
}

function getAirportList() {
  $.getJSON('db_data?q=airports', function(data) {
      var list = document.getElementById("originAiports");
      for (item of data) {
        var option = document.createElement("option");
        option.text = item._id;
        option.value = item._id;
        list.appendChild(option);
      }
  });
}

function displayArray(json_data) {
  var table_container = document.getElementById("table-container");
  table_container.innerHTML = '<table id="flights_table">'
    +'<tr>'
    +'<th>Flight ID</th>'
    +'<th>Date</th>'
    +'<th>Info</th>'
    +'</tr>'
    +'</table>';
  var flights_table = document.getElementById("flights_table");
  for (elem of json_data) {
    var FlightDate = elem.FlightDate.substring(0,10);
    flights_table.innerHTML += '<tr onclick="window.location.href=\'/flightInfo?id=' + elem._id + '\';">'
      +'<td>' + elem._id + '</td>'
      +'<td>' + FlightDate + '</td>'
      +'<td>' + elem.origin + ' -> ' + elem.destination + '</td>'
      +'</tr>';
  }

}

function displayFlights() {
  var o_airport = document.getElementById("originAiports").value;
  var from_date = document.getElementById("from").value;
  var to_date = document.getElementById("to").value;
  if((o_airport && from_date && to_date) != '') {
    var json_url = '/db_data?q=flights_arc&o_airport=' + o_airport + '&from=' + from_date + '&to=' + to_date;
    console.log(json_url);
    d3.json(json_url, function(json_data) {
      // Arcs coordinates can be specified explicitly with latitude/longtitude,
      // or just the geographic center of the state/country.
      map.arc(json_data);
      displayArray(json_data);
    });
  }
}

function hide_container(container_num) {
  switch (container_num) {
    case 1:
      var container = document.getElementById("percentage-container");
      var icon = document.getElementById("icon1");

      if($(container).is(":visible")) {
        icon.innerHTML = '<i class="fas fa-angle-left" style="height:100%; font-size: 250%; color : white"></i>';
        $(container).hide();
      } else {
        icon.innerHTML = '<i class="fas fa-angle-down" style="height:100%; font-size: 250%; color : white"></i>'
        $(container).show();
      }
      break;
      case 2:
        var container = document.getElementById("map-container");
        var icon = document.getElementById("icon2");

        if($(container).is(":visible")) {
          icon.innerHTML = '<i class="fas fa-angle-left" style="height:100%; font-size: 250%; color : white"></i>';
          $(container).hide();
        } else {
          icon.innerHTML = '<i class="fas fa-angle-down" style="height:100%; font-size: 250%; color : white"></i>'
          $(container).show();
        }
        break;
      default:
        break;
  }
}
