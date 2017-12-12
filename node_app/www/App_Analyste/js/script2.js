
function onload() {
  getAirportList();
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
      list.classList.remove('is-invalid');
      list.classList.add('is-valid');
  });
}

function displayInfo() {
  var selectedAiport = document.getElementById("originAiports").value;
  diplayDelayAvg(selectedAiport);
  displayDelayBar(selectedAiport);
}

function diplayDelayAvg(selectedAiport) {
  $.getJSON('db_data?q=dep_delay_avg&airport='+selectedAiport, function(data) {
    document.getElementById("dep-delay-container").innerHTML =
      '<div class="c100 p' + parseInt(parseFloat(data[0].avg_Delay)*100) + ' dark big orange" style=" display: table; margin: 0 auto;">'
      + '<span>' + parseInt(parseFloat(data[0].avg_Delay)*100) + '%</span>'
      + '<div class="slice">'
      + '<div class="bar"></div>'
      + '<div class="fill"></div>'
      + '</div>'
      + '</div>';
  });
  $.getJSON('db_data?q=arr_delay_avg&airport='+selectedAiport, function(data) {
    document.getElementById("arr-delay-container").innerHTML =
      '<div class="c100 p' + parseInt(parseFloat(data[0].avg_Delay)*100) + ' dark big orange" style=" display: table; margin: 0 auto;">'
      + '<span>' + parseInt(parseFloat(data[0].avg_Delay)*100) + '%</span>'
      + '<div class="slice">'
      + '<div class="bar"></div>'
      + '<div class="fill"></div>'
      + '</div>'
      + '</div>';
  });
}

function displayDelayBar(selectedAiport) {
  $.getJSON('db_data?q=dep_delay_avg&airport='+selectedAiport, function(json_data) {
    var depDelayTime = parseFloat(json_data[0].avg_DelayTime);
    $.getJSON('db_data?q=arr_delay_avg&airport='+selectedAiport, function(json_data2) {
      var arrDelayTime = parseFloat(json_data2[0].avg_DelayTime);
      var data = {
        labels: ["Departures", "Arrivals"],
        datasets: [
          {
              label: "Delay Average (min)",
              fillColor: "rgba(220,220,220,0.5)",
              strokeColor: "rgba(220,220,220,0.8)",
              highlightFill: "rgba(220,220,220,0.75)",
              highlightStroke: "rgba(220,220,220,1)",
              data: [depDelayTime,arrDelayTime]
          }
        ]
      }
      var options = {
          scaleBeginAtZero: false,
          responsive: true,
          scaleStartValue : -50,
          maintainAspectRatio: false,
      };

      var ctx = document.getElementById("myChart").getContext("2d");


      var myBarChart = new Chart(ctx, {
          type: 'bar',
          data: data,
          options: options
      });
      ctx.height = 500;
      ctx.width = 100;
    });
  });
}
