function onload() {
  getLog();
}

function getLog() {
  $.getJSON('db_data?q=getLog', function(data) {
      var user_console = document.getElementById("user_console");
      user_console.innerHTML = ""
      for (item of data) user_console.innerHTML += item.date + ' : ' + ' [' + item.type + '] ' + item.query + " = " + item.time + ' ms <br>';
  });
}
