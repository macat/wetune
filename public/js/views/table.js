define(['lib/simple_template', 'text!views/templates/table.template'], 
function(tmpl, template_table){
  var 
    view = {
      url: 'http://localhost:3000',
      table: [],
      init: function() {
        this.initTable();
        this.renderTable();

        $.subscribe('services/wetune/changed', $.proxy(this, 'onChanged'));

            var samples = [
              '/audio/491__skiptracer__DjembeCheapMicSessionUno_35_.wav',
              '/audio/947__vate__sint1.wav',
              '/audio/471__skiptracer__DjembeCheapMicSessionUno_15_.wav',
              '/audio/.wav',
              '/audio/.wav',
              '/audio/.wav',
              '/audio/.wav',
              '/audio/.wav'
            ];
            for (var i = 0; i < 16; i++) samples.push();
            var beat = 0;
            var ttable = this.table;
            $(function(){
                $('#machine').delegate('.c', 'click', function(e){
                    $(this).toggleClass('active'); 
                    var index = $(this).data('index');
                    var rowindex = $(this).parent().data('rowindex');
                    if (ttable[rowindex][index] === false){
                      ttable[rowindex][index] = new Audio(samples[rowindex]);
                    } else {
                      ttable[rowindex][index] = false; 
                    }
                });
                window.setInterval(function(){
                    for (var i = 0; i < 8; i++) {
                      if (ttable[i][beat]) {
                        ttable[i][beat].play();
                      }
                    }
                    $('.highlighted').removeClass('highlighted');
                    $('[data-index='+beat +']').addClass('highlighted');
                    beat++;
                    if (beat > 31) beat = 0;
                }, 125);
            });

      },
      onChanged: function(coor) {
        alert('ok');
      },
      initTable: function() {
        for (var i = 0; i < 8; i++) {
          var row = [];
          for (var k = 0; k < 32; k++){
            row.push(false); 
          }
          this.table.push(row);
        }
      },
      renderTable: function() {
        $('#machine').html(tmpl(template_table, { rows: this.table }));
      }

    };

  return function(config) {
    var v = Object.create(view);
    $.extend(v, config);
    v.init();
  }; 
});

