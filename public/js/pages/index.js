define(['services/wetune', 'views/table', 'views/user_group'], 
function(wetune, table, user_group){
  wetune({}); 
  user_group({});
  $.subscribe('/views/user_group/loggedin', function(group, username){
      table({
        group: group
      });
  });

});

