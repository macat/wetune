
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();
var redis = require("redis"),
    redis_client = redis.createClient();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

// Index page
app.get('/', function(req, res) {
  res.render('index', {
    title: 'WE TUNE',
    bodyId: 'index'
  });
});

// Table (json)
app.get('/table/:group', function(req, res) {
  redis_client.hgetall(req.params.group +':table', function(err, replies){
    var table = [];
    for (var k = 0; k < 8; k++) {
      var row = [];
      for (var i = 0; i < 32; i++) {
        if (replies[i +':'+ k] && replies[i +':'+ k] == 1){
          row.push(1);
        } else {
          row.push(0);
        }
      }
      table.push(row);
    }
    res.contentType('json');
    res.send({'table': table});
  });
});


var io = require('socket.io').listen(app);

// Start server
app.listen(3000);

// Set up 'websockets'
io.sockets.on('connection', function (socket) {
  group = 'techno';
  socket.join(group);
  socket.on('table/change', function (coor) {
    console.log(coor);
    redis_client.hset(group +':table', coor.x +':'+ coor.y, parseInt(coor.active, 10));
    socket.broadcast.to(group).emit('table/changed', coor);
  });
});

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
