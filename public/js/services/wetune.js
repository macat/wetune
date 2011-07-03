define(['/socket.io/socket.io.js'], function(){
  var 
    service = {
      socket: null,
      url: 'http://localhost:3000',
      init: function() {
        this.connect();
        $.subscribe('services/wetune/login', $.proxy(this, 'login'));
        $.subscribe('services/wetune/logout', $.proxy(this, 'logout'));
        $.subscribe('services/wetune/change', $.proxy(this, 'change'));
        this.socket.on('wetune/changed', function(coor){
          $.publish('services/wetune/changed', [coor]);
        });
      },
      connect: function() {
        this.socket = io.connect(this.url);
      },
      login: function(username) {
        this.socket.emit('wetune/login', {'user': username});
      },
      logout: function() {
        this.socket.emit('wetune/logout');
      },
      change: function(coor) {
        this.socket.emit('wetune/change', coor);      
      }
    };

  return function(config) {
    var s = Object.create(service);
    $.extend(s, config);
    s.init();
  }; 
});
