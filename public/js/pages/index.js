define(['services/wetune', 'views/table', 'views/user_group'], 
function(wetune, table, user_group){
  require.ready(function(){

    // Initalize wetune service
    wetune({
      url: appSettings.serverIOSocket
    }); 
    // Initialize user login/logout toolbox
    user_group({});

    $.subscribe('views/user_group/loggedin', function(group, username){
      var tableView = table({
        group: group
      });
      $.subscribe('services/wetune/logout', function(){
        tableView.destroy();
        tableView = null;
      });

    });

  });
});

