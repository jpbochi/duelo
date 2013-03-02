define(function (require) {
  return {
    register: function (grunt) {
      grunt.registerTask('test:set_env', 'Sets environment variables to test.', function () {
        process.env.MONGOHQ_URL = 'mongodb://localhost/duelo_test';
      });

      grunt.registerTask('test:node:all', 'Runs node-side tests.', function (port) {
        this.requires('test:set_env');

        var testrunner = require('qunit');

        testrunner.setup({
          log: {
            tests: true,
            errors: true,
            globalSummary: true
          }
        });

        var done = this.async();

        testrunner.run({
          code: 'package.json',
          tests: 'tests/server.js'
        }, function (err, report) {
          if (err) {
            done(false);
            throw err;
          } else {
            var succeeded = report && report.failed === 0;
            done(succeeded);
          }
        });
      });

      grunt.registerTask(
        'test:node',
        'Run all server-side tests.',
        ['test:set_env', 'test:node:all']
      );
      grunt.registerTask(
        'test:client',
        'Run all client-side tests.',
        ['test:set_env', 'server:test:3333', 'qunit']
      );
      grunt.registerTask(
        'test',
        'Run all tests.',
        ['test:client', 'test:node']
      );
    }
  };
});
