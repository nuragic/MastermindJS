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

      var $board = $('#board'), i;

      for (i = 1; i <= 10; i++) {
        $board.append(rowTemplate);
      }

      mastermind.play();

    });

});