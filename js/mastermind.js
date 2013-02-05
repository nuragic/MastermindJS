/*!
 * Mastermind JS
 *  The classic Mastermind game written in JavaScript.
 *
 *  Copyleft 2013, Andrea Puddu <andrea@morethanweb.net>
 *  Released under the GNU GPL v3 License.
 *  More information: http://morethanweb.net/mastermind
 *  About the original Mastermind game: http://en.wikipedia.org/wiki/Mastermind_(board_game)
 */

define(["kimbo"], function($) {

  var Mastermind = function () {

    var ಠ_ಠ = {},

        self = this,

        secret = [],

        colors = ['yellow', 'orange', 'red',  'green', 'blue', 'purple', 'pink', 'brown', 'black', 'white'],

        levels = [
          { name: 'normal', attempts: 10, colors: colors.slice(0, 6) },
          { name: 'medium', attempts: 8,  colors: colors.slice(0, 8) },
          { name: 'hard',   attempts: 6,  colors: colors.slice()     }
        ],

        currentLevel,

        currentAttempt,

        $currentRow,

        defaults = {
          level: 0
        },

        initialized = false;

    /*
     * PRIVATE METHODS
     */
    ಠ_ಠ.generateSecret = function() {
      var len =  currentLevel.colors.length,
          _secret = [],
          i;

      for (i = 0; i < 4; i++) {
        _secret[i] = currentLevel.colors[ Math.floor(Math.random() * len) ];
      }

      return _secret;
    }

    ಠ_ಠ.getHints = function(combination) {
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
    }

    ಠ_ಠ.displayHints = function(hintsObject) {
      var hints,
          b, w, ww;

      //hints = $('.hints:eq('+(currentLevel.attempts - currentAttempt)+') .hole');
      hints = $('.hints').eq(currentLevel.attempts - currentAttempt).find('.hole');

      for(b = 0; b < hintsObject.black; b++){
        $(hints[b]).addClass('peg black');
      }

      for(ww = hintsObject.white, w = b; ww > 0; ww--, w++){
        $(hints[w]).addClass('peg white');
      }
    }

    ಠ_ಠ.nextAttempt = function() {
      if(currentAttempt <= currentLevel.attempts) {
        //$currentRow = $('.combination:eq('+(currentLevel.attempts - currentAttempt)+')');
        $currentRow = $('.combination').eq(currentLevel.attempts - currentAttempt);
        $currentRow.addClass('active');
        //listen to the current attempt
        $currentRow.on('click', '.hole', {colors: currentLevel.colors}, ಠ_ಠ.switchPegs);

      } else {
        $(self).trigger('lose', [secret]);
        return false;
      }
    }

    ಠ_ಠ.switchPegs = function (ev) {
        //get the possibility to change peg colors
        var $this = $(this),
            x = parseInt($this.data('x'), 10),
            colors = ev.data.colors;

        x = (x < colors.length - 1) ? x + 1 : 0;

        //$(this).css('background', 'radial-gradient(at 30% 40% , '+colors[x]+', #000000)');
        $this.removeClass().addClass('hole peg '+colors[x]);
        $this.data('color', colors[x]);
        $this.data('x', x);
    }

    /*
     * PUBLIC METHODS
     */
    self.init = function(options) {
      if (!initialized) {
        options && options.level || (options = defaults);

        currentLevel = levels[options.level];
        currentAttempt = 1;

        secret = ಠ_ಠ.generateSecret();
        self.level = currentLevel

        initialized = true;
      }

      return self;
    }

    self.play = function() {
      initialized || self.init();

      var $check = $('#check');

      //listen the 'check button' click
      $check.click(function() {
        var combination = [],
            hints = {},
            color;

        //get the current row colors
        $currentRow.find('.hole').each(function() {
          color = $(this).data('color');
          if (color) {
            combination.push(color);
          }
        });

        //check the pegs
        if(combination.length === 4) {
          //unbind click on the current row
          $currentRow.off('click', '.hole');
          //display hints
          hints = ಠ_ಠ.getHints(combination);
          ಠ_ಠ.displayHints(hints);

          if(hints.black === 4) {
            $(self).trigger('win');
            return true;
          }

          currentAttempt += 1;
          ಠ_ಠ.nextAttempt();
        }
      });

      //first attempt
      ಠ_ಠ.nextAttempt();
    }

    return self;
  }

  return Mastermind.call({});
});
