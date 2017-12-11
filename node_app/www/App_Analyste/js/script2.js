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

function displayDelay() {
  $.getJSON('db_data?q=delay_avg', function(data) {
      var container = document.getElementById("delay-container");
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
