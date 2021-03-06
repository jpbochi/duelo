define(function () {
  'use strict';
  var _ = require('lodash');
  var userNotLogged = { state: 'not-logged' };
  var userLoggedNotPlaying = { state: 'not-playing' };

  return function (game, user) {
    var loggedPlayer = _.once(function () {
      if (!user) { return userNotLogged; }

      return _(game.players).find(function (player) {
        return player.href === user._links.self.href;
      }) || userLoggedNotPlaying;
    });
    var canJoin = _.once(function () {
      return loggedPlayer().state === userLoggedNotPlaying.state;
    });
    var canBecomeReady = _.once(function () {
      return loggedPlayer().state === 'lobby';
    });

    var allPlayersReady = function () {
      return _(game.players).all(function (player) {
        return player.state === 'ready';
      });
    };
    var startGame = function () {
      game.players.forEach(function (player) {
        player.state = 'playing';
      });
      game.setState('playing');
    };

    return {
      join: function () {
        if (!canJoin()) { return; }

        game.players.push(game.buildPlayer(user));
        return true;
      },
      becomeReady: function () {
        if (!canBecomeReady()) { return; }

        loggedPlayer().state = 'ready';
        allPlayersReady() && startGame();
        return true;
      },
      addLinks: function (view) {
        var selfHref = view._links.self.href;

        if (user) {
          view.link('viewed-by', user._links.self.href);

          canJoin() && view.link('join', selfHref + '/join');
          canBecomeReady() && view.link('become-ready', selfHref + '/become-ready');
        }
      }
    };
  };
});
