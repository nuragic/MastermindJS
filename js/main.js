requirejs.config({
  baseUrl: 'js/libs',
  paths: {
      amd:  '../modules',
      tmpl: '../../tmpl'
  }
});


requirejs([
  'jquery',
  'amd/mastermind',
  'text!tmpl/_row.html'
  ],

  function ($, mastermind, rowTemplate) {

    $(function() {

      var $board = $('#board');

      var onWin = function (ev) {
        alert('You win!');
      }

      var onLose = function (ev, secret) {
        alert('You lose! Hidden code was ' + secret.join(', '));
      }

      mastermind.init({
        level: 1
      });

      for (var i = 1; i <= mastermind.level.attempts; i++) {
        $board.append(rowTemplate);
      }

      mastermind.play();

      $(mastermind).on('win', onWin);
      $(mastermind).on('lose', onLose);
    });

});