define(["jquery"], function($) {

  /*!
   * Mastermind JS
   *  The classic Mastermind game written in JavaScript (also uses jQuery,HTML5,CSS3).
   *
   *  Copyright 2012, Andrea Puddu <andrea@morethanweb.net>
   *  Released under the GNU GPL v3 License.
   *  More information: http://morethanweb.net/mastermind
   *  About the original Mastermind game: http://en.wikipedia.org/wiki/Mastermind_(board_game)
   */
  var Mastermind = {};

  (function () {

    //"use strict";

    var VERSION = '0.2.1',

        initialized = false,

        secret = [],

        allColors = ['yellow', 'orange', 'red',  'green', 'blue', 'purple', 'pink', 'brown', 'black', 'white'],

        //TODO: fully implement levels, currently partial supported
        levels = [
          { name: 'normal', time: 0,   attempts: 10, colors: allColors.slice(0, 6) },
          { name: 'medium', time: 600, attempts: 8,  colors: allColors.slice(0, 8) },
          { name: 'hard',   time: 300, attempts: 6,  colors: allColors.slice()     }
        ],

        currentLevel,

        currentAttempt = 1,

        $currentRow,

        defaults = {
          level: 0
        };

    /*
     * Public methods
     */
    this.init = function(options) {
      options && options.level || (options = defaults);

      this.setLevel(options.level);
      this.colors = this.getLevel().colors;
      secret = this.generateSecret();
      initialized = true;
    },

    this.setLevel = function(l) {
      currentLevel = l;
    },

    this.getLevel = function() {
      return levels[currentLevel];
    },

    this.generateSecret = function() {
      var i,
          len =  this.colors.length,
          secret = [];

      for (i = 0; i < 4; i++) {
        secret[i] = this.colors[ Math.floor(Math.random() * len) ];
      }

      return secret;
    },

    this.getHints = function(combination) {
      var hints = {black: 0, white: 0},
          secretCombination = secret.slice(),
          userCombination   = combination.slice(),
          i, x;

      //check for correct positions
      for (i = 0; i < 4; i++) {
        if (userCombination[i] === secretCombination[i]) {
          hints.black += 1;
          secretCombination[i] = userCombination[i] = null;
        }
      }
      //check for incorrect positions
      for (i = 0; i < 4; i++) {
        for (x = 0; x < 4; x++) {
          if(userCombination[i] && secretCombination[x]) {
            if (userCombination[i] === secretCombination[x]) {
              hints.white += 1;
              secretCombination[x] = userCombination[i] = null;
            }
          }
        }
      }

      return hints;
    },

    this.displayHints = function(hintsObject) {
      var hints,
          attempts = this.getLevel().attempts,
          b, w, ww;

      hints = $('.hints:eq('+(attempts - currentAttempt)+') .circle');

      for(b = 0; b < hintsObject.black; b++){
        $(hints[b]).css('background-color', 'black');
      }

      for(ww = hintsObject.white, w = b; ww > 0; ww--, w++){
        $(hints[w]).css('background-color', 'white');
      }
    },

    this.play = function() {
      if(!initialized)
        this.init();

      var self = this,
          attempts = this.getLevel().attempts,
          $check = $('#check');

      //listen the 'check button' click
      $check.click(function() {
        var combination = [],
            hints = {},
            color;

        //get the current row colors
        $currentRow.find('.circle').each(function() {
          color = $(this).data('color');
          if (color) {
            combination.push(color);
          }
        });

        //check the pegs
        if(combination.length === 4) {
          //unbind click on the current row
          $currentRow.off('click', '.circle');
          //display hints
          hints = self.getHints(combination);
          self.displayHints(hints);

          if(hints.black === 4) {
            //TODO: remove alerts, trigger a 'win' event instead
            alert('You win!');
            return true;
          }

          currentAttempt += 1;
          self.nextAttempt();
        }
      });

      //first attempt
      self.nextAttempt();
    },

    this.nextAttempt = function() {
      var attempts = this.getLevel().attempts;

      if(currentAttempt <= attempts) {
        $currentRow = $('.combination:eq('+(attempts - currentAttempt)+')');
        $currentRow.addClass('active');
        //listen to the current attempt
        $currentRow.on('click', '.circle', {colors: this.colors}, function(ev) {
          //get the possibility to change peg colors
          var colors = ev.data.colors,
              x = $(this).data('x');

          x = (x < colors.length - 1) ? x + 1 : 0;

          $(this).css('background-color', colors[x]);
          $(this).data('color', colors[x]);
          $(this).data('x', x);
        });

      } else {
        //TODO: remove alerts, trigger a 'lose' event instead
        alert('You lose! Hidden code was ' + secret.join(', '));
        return false;
      }
    };

  }).call(Mastermind);


  return Mastermind;

});