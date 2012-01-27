
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();
var redis_client = require('redis-url').createClient(process.env.REDISTOGO_URL);

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
  app.set('serverIOSocket', 'http://localhost:3000');
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
  var port = process.env.PORT || 3000;
  app.set('serverIOSocket', 'http://0.0.0.0:' + port);
});

// Routes

// Index page
app.get('/', function(req, res) {
  res.render('index', {
    title: 'WE TUNE',
    bodyId: 'index',
    clientSettings: JSON.stringify({
      serverIOSocket: app.settings.serverIOSocket
    })
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

//io.configure('development', function() {
//  io.set('store', new require('socket.io').RedisStore); 
//});
//io.configure('production', function() {
//  io.set('store', new require('socket.io').RedisStore); 
//});

// Start server
app.listen(process.env.PORT);

// Set up 'websockets'
io.sockets.on('connection', function (socket) {
  group = 'minimal';
  socket.join(group);
  socket.on('login', function(group, username) {
    console.log('login');
    console.log(group);
    socket.set('group', group);
    socket.set('user', username, function(){
      socket.broadcast.to(group).emit('user/loggedin', username);
    });
  });
  socket.on('logout', function(username) {
    socket.broadcast.to(socket.get('group')).emit('user/loggedout', username);
  });
  socket.on('table/change', function (coor) {
    var group = 'minimal'; // socket.get('group');
    redis_client.hset(group +':table', coor.x +':'+ coor.y, parseInt(coor.active, 10));
    socket.broadcast.to(group).emit('table/changed', coor);
  });
});

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
