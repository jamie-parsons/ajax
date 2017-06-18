var currentGame = {}
var showForm = false;
var editingGame;

$(document).ready( function() {
  function toggle() {
    showForm = !showForm
    $('#game-form').remove();
    $('#games-list').toggle();

   if (showForm) {
      $.ajax({
        url: '/game_form',
        method: 'GET',
        data: { id: editingGame }
      }).done( function(html) {
        $('#toggle').after(html)
      });
    }
  };

 function getGame(id) {
    $.ajax({
      url: '/games/' + id,
      method: 'GET',
    }).done( function(game) {
      if (editingGame) {
        var li = $("[data-id='" + id + "'")
        $(li).parent().replaceWith(game)
        editingGame = null
      } else {
        $('#games-list').append(game);
      }
    });
  }

 $(document).on('submit', '#game-form form', function(e) {
    e.preventDefault();
    var data = $(this).serializeArray();
    var url = '/games';
    var method = 'POST';

   if (editingGame) {
      url = url + '/' + editingGame;
      method: 'PUT'
    }

   $.ajax({
      url: url,
      type: method,
      dataType: 'JSON',
      data: data
    }).done( function(game) {
      toggle();
      getGame(game.id)
    }).fail( function(err) {
      alert(err.responseJSON.errors)
    });
  });

 $('#toggle').on('click', function() {
    toggle();
  });

 $(document).on('click', '#edit-game', function() {
    editingGame = $(this).siblings('.game-item').data().id
    toggle();
  });

 $(document).on('click', '#delete-game', function() {
    var id = $(this).siblings('.game-item').data().id;
    $.ajax({
      url: '/games/' + id,
      method: 'DELETE'
    }).done( function() {
      var row = $("[data-id='" + id + "'");
      row.parent('li').remove();
    });
  });