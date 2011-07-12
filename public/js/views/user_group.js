define(function(){
  var 
    view = {
      init: function(){
        $('#loginform').removeClass('hide').submit($.proxy(this, 'onLoginFormSubmit'));
      },
      onLoginFormSubmit: function(e){
        e.preventDefault();

        var group = $('select[name="group"]').val(), 
            username = $('input[name="username"]').val();

        $('#logout-button').click($.proxy(this, 'onLogoutClick'));

        $.publish('services/wetune/login', [group, username]);
        $('#user').text(username);
        $('#group').text(group);
        $('#login').addClass('hide');
        $('#logout').removeClass('hide');
        $.publish('views/user_group/loggedin', [group, username]);
      },
      onLogoutClick: function(e) {
        e.preventDefault();
        $.publish('services/wetune/logout', []);        
        $('#login').removeClass('hide');
        $('#logout').addClass('hide');
        $('#user').text('');
        $('#group').text('');
      }
    };

  return function(config) {
    var v = Object.create(view);
    $.extend(v, config);
    v.init();
  }; 
});
