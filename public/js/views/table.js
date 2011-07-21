define(['lib/simple_template', 'lib/buzz', 'text!views/templates/table.template'], 
function(tmpl, buzz, template_table){
  var 
    view = {
      table: [],
      $tableContent: null,
      beat: 0,
      group: '',
      samples: [
        '/audio/491__skiptracer__DjembeCheapMicSessionUno_35_',
        '/audio/947__vate__sint1',
        '/audio/471__skiptracer__DjembeCheapMicSessionUno_15_',
        '/audio/21583__djgriffin__beast_stab_d',
        '/audio/21585__djgriffin__sub_bass_stab_1',
        '/audio/924__sleep__PTXSNA_2',
        '/audio/36535__ErrorCell___Sky_BassDrum044',
        '/audio/4197__RealRhodesSounds__Cminor7'
      ],
      init: function() {
        this.initTable();

        $.subscribe('services/wetune/changed', $.proxy(this, 'onChanged'));
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
      destroy: function() {
        this.onStop();
        this.$tableContent.remove();
        this.$tableContent = null;
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
        this.table[y][x] = new buzz.sound(this.samples[y], {
                formats: ['ogg', 'mp3'],
                autoload: true
              });
      },
      deactivateField: function(x, y) {
        this.table[y][x] = 0;
      },
      initTable: function() {
        $.getJSON('/table/'+ this.group, $.proxy(this, 'onInitDataReceived'));
      },
      onInitDataReceived: function(data) {
        // Create audio objects
        for (var i = 0; i < data.table.length; i++) {
          var row = [];
          for (var k = 0; k < data.table[i].length; k++){
            if (data.table[i][k] === 0) {
              row.push(0);
            }
            else {
              row.push(new buzz.sound(this.samples[i], {
                formats: ['ogg', 'mp3'],
                autoload: true
              })); 
            }
          }
          this.table.push(row);
        }
        this.renderTable();
        // Add eventhandlers
        this.$tableContent.delegate('.c', 'click', $.proxy(this, 'onFieldClick'));
        this.$tableContent.find('.play').click($.proxy(this, 'onPlay'));
        this.$tableContent.find('.stop').click($.proxy(this, 'onStop'));
        // Insert into DOM
        $('#machine').append(this.$tableContent);
      },
      renderTable: function() {
        this.$tableContent = $(tmpl(template_table, { rows: this.table }));
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
    return {
      destroy: $.proxy(v, 'destroy')
    };
  }; 
});

