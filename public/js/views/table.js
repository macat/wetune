define(['lib/simple_template', 'text!views/templates/table.template'], 
function(tmpl, template_table){
  var 
    view = {
      table: [],
      beat: 0,
      group: '',
      samples: [
        '/audio/491__skiptracer__DjembeCheapMicSessionUno_35_.ogg',
        '/audio/947__vate__sint1.ogg',
        '/audio/471__skiptracer__DjembeCheapMicSessionUno_15_.ogg',
        '/audio/21583__djgriffin__beast_stab_d.ogg',
        '/audio/21585__djgriffin__sub_bass_stab_1.ogg',
        '/audio/924__sleep__PTXSNA_2.ogg',
        '/audio/36535__ErrorCell___Sky_BassDrum044.ogg',
        '/audio/4197__RealRhodesSounds__Cminor7.ogg'
      ],
      init: function() {
        this.initTable();

        $.subscribe('services/wetune/changed', $.proxy(this, 'onChanged'));
        $.subscribe('services/wetune/logout', $.proxy(this, 'onLogout'));


        $('#machine').delegate('.c', 'click', $.proxy(this, 'onFieldClick'));
        $('#play').click($.proxy(this, 'onPlay'));
        $('#stop').click($.proxy(this, 'onStop'));

        $('#machine,#controls').removeClass('hide');
      },
      onChanged: function(coor) {
        if (coor.active === 1){
          this.activateField(coor.x, coor.y); 
          $('[data-rowindex='+ coor.y +']').find('[data-index='+ coor.x +']')
            .addClass('active');
        } else {
          this.deactivateField(coor.x, coor.y); 
          $('[data-rowindex='+ coor.y +']').find('[data-index='+ coor.x +']')
            .removeClass('active');
        }
      },
      onLogout: function() {
        this.onStop();
        $('#machine,#controls').addClass('hide');
        $('#machine').empty();
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
        $.getJSON('/table/'+ this.group, $.proxy(this, 'onInitDataReceived'));
      },
      onInitDataReceived: function(data) {
        for (var i = 0; i < data.table.length; i++) {
          var row = [];
          for (var k = 0; k < data.table[i].length; k++){
            if (data.table[i][k] == 0) {
              row.push(0);
            }
            else {
              row.push(new Audio(this.samples[i])); 
              
            }
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
        if (!this.intervalID) {
          this.intervalID = setInterval($.proxy(this, 'playMachine'), 125);
        }
      },
      onStop: function() {
        clearInterval(this.intervalID);
        this.intervalID = null;
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

