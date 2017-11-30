var http = require('http');
var url = require("url");
var querystring = require('querystring');

var server = http.createServer(function(req, res) {
  var get_url = url.parse(req.url);
  var page = get_url.pathname;
  var params = querystring.parse(get_url.query);

  console.log(get_url);
  console.log(page);
  console.log(params);

  res.writeHead(200, {"Content-Type": "text/plain"});

  // get params :
  // url.parse(req.url).query

  if (page == "/contact") {
    //Send contact page
  }
  else if (page == "/private") {
    res.write('This is a protected area')
  }
  else {
    //Send index page
  }

  res.end();
});

server.on('close', function() { // On écoute l'évènement close
  console.log('Bye bye !');
})

server.listen(8000);
