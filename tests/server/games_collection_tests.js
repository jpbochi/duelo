define(function (require) {
  var _ = require('lodash');
  var assert = require('chai').assert;
  var sinon = require('sinon-restore');
  var support = require('tests/support/server.js');
  var should = require('tests/support/should.js');
  var mongo = require('lib/server/mongo.js');
  var games = mongo.games;

  function verifyGameIsValid(game, done) {
    game.validate(function (err) {
      assert.isUndefined(err);
      done && done();
    });
  }

  describe('mongo.games.create()', function () {
    it('creates a valid game in lobby state by default', function (done) {
      var game = games.create();

      assert.equal(game.state, 'lobby');
      verifyGameIsValid(game, done);
    });

    it('accepts an initial player', function (done) {
      var player = { displayName: 'O Joker' };
      var game = games.create({ players: [player] });

      require('assert').deepEqual(_.pluck(game.players, 'displayName'), ['O Joker']);
      assert.deepEqual(_.pluck(game.players, 'displayName'), ['O Joker']);
      verifyGameIsValid(game, done);
    });

    it('records a createdAt date', function () {
      var expectedDate = Date.UTC(2013, 2, 28);
      sinon.stub(Date, 'now').returns(expectedDate);

      var game = games.create();

      should.dateEqual(game.createdAt, expectedDate, 'game.createdAt');
    });
  });

  describe('mongo.games.get()', function () {
    it('gets a game by its id', function (done) {
      var existing = [
        new games.model({ state: 'one' }),
        new games.model({ state: 'two' })
      ];

      support.saveAll(existing, function (all) {
        games.get(existing[1].id, function (err, result) {
          assert.isNull(err);

          assert.equal(result.id, existing[1].id);
          assert.equal(result.state, 'two');
          done();
        });
      });
    });
  });
});
