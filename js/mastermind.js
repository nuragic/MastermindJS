/*
 * The classic Mastermind game re-written in JavaScript.
 *
 * @author Andrea Puddu <andrea@morethanweb.net>
 * @date 01/05/2012
 */

var Mastermind = {};

(function () {

  const VERSION = '0.0.4';

  var _secret = [],
  
      colors = ['yellow', 'orange', 'red',  'green', 'blue', 'purple', 'pink', 'brown', 'black', 'white'],
      //TODO
      levels = [
        { name: 'normal', time: 0,   attempts: 10, colors: 6  },
        { name: 'medium', time: 600, attempts: 8,  colors: 8  },
        { name: 'hard',   time: 300, attempts: 6,  colors: 10 },
      ],

      level = 0,

      getSecret = function (colors) {
        var i,
            cc =  colors.length -1,
            secret = [];

        for (i = 0; i < 4; i++) {
          secret[i] = colors[ Math.floor(Math.random() * cc) ];
        }

        return secret;
      };
  
  
  this.setLevel = function (l) {
    level = l;
  },

  this.getLevel = function () {
    return levels[level];
  },
  
  this.colors = colors.slice(0, this.getLevel().colors -1),
  
  this.hints = function(combination) {
    var hints = {black: 0, white: 0},
        SecretCache = _secret.slice(),
        UserCache   = combination.slice(),
        i, x;
        
    //check for correct positions
    for (i = 0; i < 4; i++) {
      if (UserCache[i] === SecretCache[i]) {
        hints.black += 1;
        SecretCache[i] = UserCache[i] = null;
      }
    }
    //check for incorrect positions
    for (i = 0; i < 4; i++) {
      for (x = 0; x < 4; x++) {
        if(UserCache[i] && SecretCache[x]) {
          if (UserCache[i] === SecretCache[x]) {
            hints.white += 1;
            SecretCache[x] = UserCache[i] = null;
          }
        }
      }
    }
    
    return hints;
  },
  
  this.play = function () {
    _secret = getSecret(this.colors);
    
    var attempts = [],
        combination,
        str,
        currentLevel = this.getLevel();
	
    while(currentLevel.attempts) {
      str = prompt('Give me the secret key!');
      if(str) {
        combination = str.split(' ');
        result = this.hints(combination);
        //attempts.push({combination: combination, result: result});
        currentLevel.attempts-=1;
        
        console.log('Your combination: '+str);
        console.log('Hints: ', result);
          
        if(result.black === 4) {
          console.log('SECRET: ', _secret);
          alert('You win!');
          return true;
        }
      } else {
        return;
      }
    }
    
    console.log('SECRET: ', _secret);
    alert('You lose!');
    
    return false;
  };
  
}).apply(Mastermind);