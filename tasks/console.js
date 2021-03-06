define(function (require) {
  function throwIfError(err) {
    if (err) {
      console.error(err);
      throw err;
    }
  }

  return {
    register: function (grunt) {
      grunt.registerTask('console', 'Start node CLI.', function (nodb) {
        var repl = require('repl');
        var done = this.async();

        global.grunt = grunt;
        global.requirejs = requirejs;
        global.config = require('../lib/server/config.js');
        global.mongo = require('../lib/server/mongo.js');
        global.lo = require('lodash');
        global.sinon = require('sinon-restore');
        global.tileName = require('../lib/common/tile_name.js');

        Object.defineProperty(global, 'exit', {
          get: function () { done(true); return 'bye'; }
        });

        function startRepl() {
          repl.start({
            prompt: '> ',
            useGlobal: true
          }).on('exit', function () {
            done(true);
          });
        }

        if (nodb === 'nodb') {
          return startRepl();
        } else {
          mongo.connect(function (err) {
            throwIfError(err);
            console.log('mongo connected to ' + mongo.url());
            startRepl();
          });
        }
      });
    }
  };
});
