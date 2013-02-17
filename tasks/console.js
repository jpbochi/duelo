define(function (require) {
  return {
    register: function (grunt) {
      grunt.registerTask('console', 'Start node CLI.', function () {
        var repl = require('repl');
        require('../external/underscore/underscore-1.4.4.min.js');
        var config = require('../lib/server/config.js');
        var mongo = require('../lib/server/mongo.js');

        global.grunt = grunt;
        global.requirejs = requirejs;
        global.config = config;
        global.redis = config.redis;
        global.mongo = mongo;

        var done = this.async();

        config.redis.on('connect', function () {
          console.log('redis connected to', config.redisUrl, '.');

          mongo.connect(function () {
            console.log('mongo connected to ' + mongo.url());

            repl.start({
              prompt: '> ',
              useGlobal: true
            }).on('exit', function () {
              done(true);
            });
          });
        });
      });
    }
  };
});
