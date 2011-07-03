define(['lib/simple_template', 'text!views/templates/table.template'], 
function(tmpl, template_table){
  var 
    view = {
      url: 'http://localhost:3000',
      table: [],
      beat: 0,
      samples: [
        '/audio/491__skiptracer__DjembeCheapMicSessionUno_35_.wav',
        '/audio/947__vate__sint1.wav',
        '/audio/471__skiptracer__DjembeCheapMicSessionUno_15_.wav',
        '/audio/.wav',
        '/audio/.wav',
        '/audio/.wav',
        '/audio/.wav',
        '/audio/.wav'
      ],
      init: function() {
        this.initTable();

        $.subscribe('services/wetune/changed', $.proxy(this, 'onChanged'));


        $('#machine').delegate('.c', 'click', $.proxy(this, 'onFieldClick'));
        $('#play').click($.proxy(this, 'onPlay'));
        $('#stop').click($.proxy(this, 'onStop'));
      },
      onChanged: function(coor) {
        alert('ok');
      },
      onFieldClick: function(e) {
        var $element = $(e.target);
        $element.toggleClass('active'); 
        var index = $element.data('index');
        var rowindex = $element.parent().data('rowindex');
        if (this.table[rowindex][index] === 0){
          this.activateField(index, rowindex); 
          $.publish('services/wetune/change', [{x: index, y: rowindex, active: 1}]);
        } else {
          this.deactivateField(index, rowindex); 
          $.publish('services/wetune/change', [{x: index, y: rowindex, active: 0}]);
        }
      },
      activateField: function(x, y) {
        this.table[y][x] = new Audio(this.samples[y]);
      },
      deactivateField: function(x, y) {
        this.table[y][x] = 0;
      },
      initTable: function() {
        $.getJSON('/table/techno', $.proxy(this, 'onInitDataReceived'));
      },
      onInitDataReceived: function(data) {
        for (var i = 0; i < data.table.length; i++) {
          var row = [];
          for (var k = 0; k < data.table[i].length; k++){
            row.push(data.table[i][k]); 
          }
          this.table.push(row);
        }
        this.renderTable();
      },
      renderTable: function() {
        $('#machine').html(tmpl(template_table, { rows: this.table }));
      },
      intervalID: null,
      onPlay: function() {
          this.intervalID = setInterval($.proxy(this, 'playMachine'), 125);
      },
      onStop: function() {
        clearInterval(this.intervalID);
      },
      playMachine: function() {
        for (var i = 0; i < 8; i++) {
          if (this.table[i][this.beat]) {
            this.table[i][this.beat].play();
          }
        }
        $('.highlighted').removeClass('highlighted');
        $('[data-index='+this.beat +']').addClass('highlighted');
        this.beat++;
        if (this.beat > 31) this.beat = 0;
      }

    };

  return function(config) {
    var v = Object.create(view);
    $.extend(v, config);
    v.init();
  }; 
});

