function onload() {
  getLog();
}

function getLog() {
  $.getJSON('db_data?q=getLog', function(data) {
      var user_console = document.getElementById("user_console");
      if(data!="") {
        user_console.innerHTML = ""
        for (item of data) user_console.innerHTML += item.date + ' : ' + ' [' + item.type + '] ' + item.query + " = " + item.time + ' ms <br>';
      }
  });

  $.getJSON('db_data?q=getLog&type=STANDARD', function(data) {
      var table = document.getElementById("Standard");
      if(data!="") {
        table.innerHTML = ""
        for (item of data) table.innerHTML += '<tr><td>' + item._id + '</td><td>' + parseFloat(Math.round(item.time_avg * 100) / 100).toFixed(2) + ' ms</td></tr>'
      }
  });

  $.getJSON('db_data?q=getLog&type=ANALYST', function(data) {
      var table = document.getElementById("Analyst");
      if(data!="") {
        table.innerHTML = ""
        for (item of data) table.innerHTML += '<tr><td>' + item._id + '</td><td>' + parseFloat(Math.round(item.time_avg * 100) / 100).toFixed(2) + ' ms</td></tr>'
      }
  });

  $.getJSON('db_data?q=getLog&type=ADMINISTRATOR', function(data) {
    var table = document.getElementById("Administrator");
    if(data!="") {
      table.innerHTML = ""
      for (item of data) table.innerHTML += '<tr><td>' + item._id + '</td><td>' + parseFloat(Math.round(item.time_avg * 100) / 100).toFixed(2) + ' ms</td></tr>'
    }
  });
}
