/*!
 * MasterMindJS
 *  The classic Mastermind game re-written in JavaScript.
 *
 *  Copyright 2012, Andrea Puddu <andrea@morethanweb.net>
 *  Released under the GPL License.
 *  More information: http://morethanweb.net/mastermind
 *  About the original Mastermind game: http://en.wikipedia.org/wiki/Mastermind_(board_game)
 */
var Mastermind = window.Mastermind = {};

(function (){

  var VERSION = '0.1.0',
      
      initialized = false,
      
      secret = [],
      
      allColors = ['yellow', 'orange', 'red',  'green', 'blue', 'purple', 'pink', 'brown', 'black', 'white'],
      //TODO: fully implement levels, currently partial supported
      levels = [
        { name: 'normal', time: 0,   attempts: 10, colors: allColors.slice(0, 5) },
        { name: 'medium', time: 600, attempts: 8,  colors: allColors.slice(0, 7) },
        { name: 'hard',   time: 300, attempts: 6,  colors: allColors.slice()     },
      ],

      currentLevel,
      
      currentAttempt = 1;    
      
  /*
   * Public methods
   */
  this.init = function(o) {
    //TODO: default options
    this.setLevel(o.level);
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
        cc =  this.colors.length -1,
        secret = [];

    for (i = 0; i < 4; i++) {
      secret[i] = this.colors[ Math.floor(Math.random() * cc) ];
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
        attempts = this.getLevel().attempts;
    
    hints = $('.hints:eq('+(attempts - currentAttempt)+') .circle');
    
    for(b = 0; b < hintsObject.black; b++){
      $(hints[b]).css('background-color', 'black');
    }
    for(ww = hintsObject.white,w = b; ww > 0; ww--, w++){
      $(hints[w]).css('background-color', 'white');
    }
  },  
  
  this.play = function() {
    var self = this,
        attempts = this.getLevel().attempts,
        $check = $('#check'),
        $row;
        
    //listen the 'check button' click
    $check.click(function() {
      var combination = [],
          hints = {},
          color;
          
      //get the current row colors
      $row = $('.combination:eq('+(attempts - currentAttempt)+')');
      $row.find('.circle').each(function() {
        color = $(this).data('color');
        if (color) {
          combination.push(color);
        }
      });
      
      //check the pegs
      if(combination.length == 4) {
        $row.off('click', '.circle');
        hints = self.getHints(combination);
        self.displayHints(hints);
        
        if(hints.black === 4) {
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
      row = $('.combination:eq('+(attempts - currentAttempt)+')');
      //listen to the current attempt
      row.on('click', '.circle', {colors: this.colors}, function(ev) {
        //get the possibility to change peg colors
        var colors = ev.data.colors,
            x = $(this).data('x');
            
        if(x < colors.length-1) {
          x = x+1;
        } else {
          x = 0;
        }
        $(this).css('background-color', colors[x]);
        $(this).data('color', colors[x]);
        $(this).data('x', x);
      });
     
    } else {
      alert('You loose! Hidden code was ' + secret.join(', '));
      return false;
    }
  }
  
}).apply(Mastermind);