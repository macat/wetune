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
        this.socket.on('table/changed', function(coor){
          $.publish('services/wetune/changed', [coor]);
        });
      },
      connect: function() {
        this.socket = io.connect(this.url);
      },
      login: function(group, username) {
        this.socket.emit('login', group, username);
      },
      logout: function() {
        this.socket.emit('logout');
      },
      change: function(coor) {
        this.socket.emit('table/change', coor);      
      }
    };

  return function(config) {
    var s = Object.create(service);
    $.extend(s, config);
    s.init();
  }; 
});
