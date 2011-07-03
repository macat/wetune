define(function(){
  var 
    view = {
      init: function(){
        $(function(){
          $('#loginform').removeClass('hide').submit(function(e){
            e.preventDefault();

            var group = $('select[name="group"]').val(), 
                username = $('input[name="username"]').val();

            $.publish('services/wetune/login', [group, username]);
            $('#user').text(username);
            $('#group').text(group);
            $('#login').addClass('hide');
            $('#logout').removeClass('hide');
            $.publish('/views/user_group/loggedin', [group, username]);
          });
        });
      }
    };

  return function(config) {
    var v = Object.create(view);
    $.extend(v, config);
    v.init();
  }; 
});
