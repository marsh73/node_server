var path = require('path'),
    fs = require('fs'),
    http = require('http'),
    express = require('express');

// Setup the server
var app =
  express()
    .set('port', process.env.PORT || 9000)
    // The route base is ../app
    .set('views', path.resolve(__dirname, '../app'))
    // Render html by just spitting the file out
    .set('view engine', 'html')
    .engine('html', function (path, options, fn) {
      if ('function' == typeof options) {
        fn = options, options = {};
      }
      fs.readFile(path, 'utf8', fn);
    })
    .use(express.favicon())
    .use(express.bodyParser())
    .use(express.logger('dev'))
    // Serve the app folder statically
    .use(express.static(path.resolve(__dirname, '../app')));

// ========================
// App
// ========================

app
  // Point all requests at one file
  .get('*', function (req, res) {
    res.render('index.html', { layout: null });
  });

app
  .use(app.router)
  .use(express.errorHandler({ dumpExceptions: true, showStack: true }));

// ========================
// Go, go, go!
// ========================

http.createServer(app).listen(app.get('port'), function(){
  console.log("Server listening on port " + app.get('port'));
});